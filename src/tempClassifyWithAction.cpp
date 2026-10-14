/* Includes ---------------------------------------------------------------- */
#include <five-gesture_v1_inferencing.h>
#include <BleCombo.h> // Uses the "ESP32-BLE-Combo" library you installed
#include "I2Cdev.h"
#include "MPU6050_6Axis_MotionApps20.h"
#include <Wire.h>
#include "esp_task_wdt.h"

/** Struct to link sensor axis name to sensor value function */
typedef struct{
    const char *name;
    float *value;
    uint8_t (*poll_sensor)(void);
    bool (*init_sensor)(void);
    int8_t status;
} eiSensors;

/* Constant defines -------------------------------------------------------- */
#define CONVERT_G_TO_MS2    9.80665f
#define MAX_ACCEPTED_RANGE  2.0f
#define N_SENSORS   7 

/* Forward declarations ------------------------------------------------------- */
float ei_get_sign(float number);
static bool ei_connect_fusion_list(const char *input_list);

bool init_IMU(void);
bool init_ADC(void);
uint8_t poll_IMU(void); // <--- FIXED: Back to uint8_t to match struct
uint8_t poll_ADC(void);
void DMPDataReady(void);
int run_inference_and_get_max();
void process_logic(int new_reading);
void execute_gesture_action(int gesture_index);

/* Private variables ------------------------------------------------------- */
static const bool debug_nn = false;
static float data[N_SENSORS];
static int8_t fusion_sensors[N_SENSORS];
static int fusion_ix = 0;

// --- MPU6050 Global Variables ---
MPU6050 mpu;
int const INTERRUPT_PIN = 34; 

bool DMPReady = false;
uint8_t MPUIntStatus;
uint8_t devStatus;
uint16_t packetSize;
uint8_t FIFOBuffer[64];

Quaternion q;
VectorInt16 aa;
VectorInt16 gy;
VectorInt16 aaReal;
VectorFloat gravity;

volatile bool MPUInterrupt = false;
void DMPDataReady() {
    MPUInterrupt = true;
}

// --- EI Sensor Struct ---
eiSensors sensors[] =
{
    "ax", &data[0], &poll_IMU, &init_IMU, -1,
    "ay", &data[1], &poll_IMU, &init_IMU, -1,
    "az", &data[2], &poll_IMU, &init_IMU, -1,
    "gx", &data[3], &poll_IMU, &init_IMU, -1,
    "gy", &data[4], &poll_IMU, &init_IMU, -1,
    "gz", &data[5], &poll_IMU, &init_IMU, -1,
    "adc", &data[6], &poll_ADC, &init_ADC, -1,
};

// --- LOGIC SETTINGS ---
// Button pin moved from GPIO 5 (strapping pin) to GPIO 18
const int BUTTON_PIN = 18; // Active LOW: connect button between GPIO 18 and GND
int label_buffer[3] = {-1, -1, -1}; 
int buffer_count = 0;              
int CIRCLE_INDEX = 0;              
int IDLE_INDEX = 2;
// ----------------------

void setup()
{
    Serial.begin(115200);
    delay(1000); 
    Serial.println("\r\n========================================");
    Serial.println("Edge Impulse Gesture Keyboard Starting...");
    Serial.println("========================================");
    Serial.flush();

    // 1. Init Bluetooth
    Keyboard.begin(); 
    // Mouse.begin(); // Not using mouse here, but safe to leave if using Combo

    pinMode(BUTTON_PIN, INPUT_PULLUP);

    // --- Init Sensors ---
    bool imu_ok = init_IMU();
    bool adc_ok = init_ADC();

    if(ei_connect_fusion_list(EI_CLASSIFIER_FUSION_AXES_STRING) == false) {
        ei_printf("ERR: Errors in sensor list detected\r\n");
        return;
    }

    // --- Check Status ---
    for(int i = 0; i < fusion_ix; i++) {
        int sensor_ix = fusion_sensors[i];
        if (sensors[sensor_ix].init_sensor == &init_IMU) {
            if (imu_ok) sensors[sensor_ix].status = 1;
            else sensors[sensor_ix].status = -1;
        }
        else if (sensors[sensor_ix].init_sensor == &init_ADC) {
            if (adc_ok) sensors[sensor_ix].status = 1;
            else sensors[sensor_ix].status = -1;
        }
    }
}

void loop()
{
    poll_IMU(); 

    // Check Button State
    if (digitalRead(BUTTON_PIN) == HIGH) { 
        buffer_count = 0;
        label_buffer[0] = -1;
        label_buffer[1] = -1;
        label_buffer[2] = -1;
        return; 
    }

    // Run Inference
    static unsigned long last_inference_time = 0;
    if (millis() - last_inference_time > EI_CLASSIFIER_INTERVAL_MS) {
        
        int prediction_index = run_inference_and_get_max();
        
        if (prediction_index != -1) {
            process_logic(prediction_index);
            last_inference_time = millis();
        }
    }
}

// --- YOUR WORKING LOGIC (With Hot Start Fix) ---
void process_logic(int new_reading) {
    
    // 1. Shift buffer or fill it up
    if (buffer_count < 3) {
        label_buffer[buffer_count] = new_reading;
        buffer_count++;
    } else {
        label_buffer[0] = label_buffer[1];
        label_buffer[1] = label_buffer[2];
        label_buffer[2] = new_reading;
    }

    // Need at least 2 readings for Hot Start check
    if (buffer_count < 2) return;

    // --- PATH A: HOT START (Moving before button press) ---
    // If the FIRST reading is NOT IDLE, and matches the second, trust it immediately.
    if (label_buffer[0] != IDLE_INDEX && label_buffer[0] != -1) {
        if (label_buffer[1] == label_buffer[0]) {
            execute_gesture_action(label_buffer[0]);
            
            // Flush immediately
            buffer_count = 0;
            label_buffer[0] = -1; label_buffer[1] = -1; label_buffer[2] = -1;
            return;
        }
    }

    // Need full buffer for Cold Start logic
    if (buffer_count < 3) return;

    // --- PATH B: COLD START (Started Idle) ---

    // RULE 1: Flush ONLY if it is a stable IDLE
    if (label_buffer[0] == label_buffer[1] && label_buffer[1] == label_buffer[2]) {
        if (label_buffer[0] == IDLE_INDEX) {
            buffer_count = 0; // Just ignore stable idle
            return;
        } else {
            // Stable Gesture (missed by Hot Start for some reason)
            execute_gesture_action(label_buffer[0]);
            buffer_count = 0;
            return;
        }
    }

    // RULE 2: Idle Transition Filter
    if (label_buffer[0] == IDLE_INDEX && 
        label_buffer[1] == IDLE_INDEX && 
        label_buffer[2] != IDLE_INDEX) {
        
        label_buffer[0] = label_buffer[1];
        label_buffer[1] = label_buffer[2];
        buffer_count = 2; 
        return; 
    }

    // RULE 3: Priority Output
    int final_output = -1;
    if (label_buffer[1] == CIRCLE_INDEX) final_output = CIRCLE_INDEX;
    else if (label_buffer[2] == CIRCLE_INDEX) final_output = CIRCLE_INDEX;
    else final_output = label_buffer[1];

    execute_gesture_action(final_output);
    
    // Flush
    buffer_count = 0;
    label_buffer[0] = -1; label_buffer[1] = -1; label_buffer[2] = -1;
}

// --- BLUETOOTH ACTIONS ---
void execute_gesture_action(int gesture_index) {
    if (gesture_index >= 0 && gesture_index < EI_CLASSIFIER_LABEL_COUNT) {
        ei_printf("GESTURE DETECTED: %s\n", ei_classifier_inferencing_categories[gesture_index]);
    }

    if (Keyboard.isConnected()) {
        if (gesture_index == 0) { // CIRCLE -> Snipping Tool
            Keyboard.press(KEY_LEFT_GUI); Keyboard.press(KEY_LEFT_SHIFT); Keyboard.press('s');
            delay(100); Keyboard.releaseAll();
        }
        else if (gesture_index == 1) { // FORWARD -> Clipboard
            Keyboard.press(KEY_LEFT_GUI); Keyboard.press('v');
            delay(100); Keyboard.releaseAll();
        }
        else if (gesture_index == 3) { // LEFTRIGHT -> Alt+Tab
            Keyboard.press(KEY_LEFT_ALT); Keyboard.press(KEY_TAB);
            delay(100); Keyboard.releaseAll();
        }
        else if (gesture_index == 4) { // UPDOWN -> Task View
            Keyboard.press(KEY_LEFT_GUI); Keyboard.press(KEY_TAB);
            delay(100); Keyboard.releaseAll();
        }
    }
}

// --- STANDARD HELPER FUNCTIONS ---

int run_inference_and_get_max() {
    float buffer[EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE] = { 0 };

    for (size_t ix = 0; ix < EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE; ix += EI_CLASSIFIER_RAW_SAMPLES_PER_FRAME) {
        int64_t next_tick = (int64_t)micros() + ((int64_t)EI_CLASSIFIER_INTERVAL_MS * 1000);

        for(int i = 0; i < fusion_ix; i++) {
            if (sensors[fusion_sensors[i]].status == 1) {
                sensors[fusion_sensors[i]].poll_sensor();
                sensors[fusion_sensors[i]].status = 2;
            }
            if (sensors[fusion_sensors[i]].status == 2) {
                buffer[ix + i] = *sensors[fusion_sensors[i]].value;
                sensors[fusion_sensors[i]].status = 1;
            }
        }

        // CRITICAL FIX: Keep draining FIFO while waiting
        while ((int64_t)micros() < next_tick) {
            poll_IMU();
        }
    }

    signal_t signal;
    int err = numpy::signal_from_buffer(buffer, EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE, &signal);
    if (err != 0) return -1;

    ei_impulse_result_t result = { 0 };
    err = run_classifier(&signal, &result, debug_nn);
    if (err != EI_IMPULSE_OK) return -1;

    float max_score = 0.0;
    int max_index = -1;

    for (size_t ix = 0; ix < EI_CLASSIFIER_LABEL_COUNT; ix++) {
        if (result.classification[ix].value > max_score) {
            max_score = result.classification[ix].value;
            max_index = ix;
        }
    }
    
    #if EI_CLASSIFIER_HAS_ANOMALY == 1
    if (result.anomaly > 1.0) return -1; 
    #endif

    return max_index;
}

static int8_t ei_find_axis(char *axis_name)
{
    int ix;
    for(ix = 0; ix < N_SENSORS; ix++) {
        if(strstr(axis_name, sensors[ix].name)) return ix;
    }
    return -1;
}

static bool ei_connect_fusion_list(const char *input_list)
{
    char *buff;
    char *input_string = (char *)ei_malloc(strlen(input_list) + 1);
    if (input_string == NULL) return false;
    memset(input_string, 0, strlen(input_list) + 1);
    strncpy(input_string, input_list, strlen(input_list));
    memset(fusion_sensors, 0, N_SENSORS);
    fusion_ix = 0;
    buff = strtok(input_string, "+");

    while (buff != NULL) {
        int8_t found_axis = ei_find_axis(buff);
        if(found_axis >= 0) {
            if(fusion_ix < N_SENSORS) {
                fusion_sensors[fusion_ix++] = found_axis;
                sensors[found_axis].status = 0;
            }
        }
        buff = strtok(NULL, "+ ");
    }
    ei_free(input_string);
    return true;
}

float ei_get_sign(float number) {
    return (number >= 0.0) ? 1.0 : -1.0;
}

bool init_IMU(void) {
    if (DMPReady) return true;

    #if I2CDEV_IMPLEMENTATION == I2CDEV_ARDUINO_WIRE
      Wire.begin();
      Wire.setClock(400000); 
    #elif I2CDEV_IMPLEMENTATION == I2CDEV_BUILTIN_FASTWIRE
      Fastwire::setup(400, true);
    #endif

    mpu.initialize();
    pinMode(INTERRUPT_PIN, INPUT);

    if (mpu.testConnection() == false) {
      ei_printf("MPU6050 connection failed\n");
      return false;
    }
    ei_printf("MPU6050 connection successful\n");

    devStatus = mpu.dmpInitialize();
    delay(1); 
    
    mpu.setXGyroOffset(-32);
    mpu.setYGyroOffset(50);
    mpu.setZGyroOffset(28);
    mpu.setXAccelOffset(-1345);
    mpu.setYAccelOffset(350);
    mpu.setZAccelOffset(2716);

    if (devStatus == 0) {
      mpu.setDMPEnabled(true);
      attachInterrupt(digitalPinToInterrupt(INTERRUPT_PIN), DMPDataReady, RISING);
      MPUIntStatus = mpu.getIntStatus();
      DMPReady = true;
      packetSize = mpu.dmpGetFIFOPacketSize();
      return true;
    } else {
      return false;
    }
}

bool init_ADC(void) {
  return true;
}

// --- FIXED: Back to uint8_t to match eiSensors struct ---
uint8_t poll_IMU(void) {
    if (!DMPReady || !MPUInterrupt) return 0;

    MPUInterrupt = false; 
    MPUIntStatus = mpu.getIntStatus();
    uint16_t fifoCount = mpu.getFIFOCount();

    if ((MPUIntStatus & _BV(MPU6050_INTERRUPT_FIFO_OFLOW_BIT)) || fifoCount >= 1024) {
        mpu.resetFIFO();
        return 0;
    } 

    while (fifoCount >= packetSize) {
        mpu.getFIFOBytes(FIFOBuffer, packetSize);
        fifoCount -= packetSize;

        mpu.dmpGetQuaternion(&q, FIFOBuffer);
        mpu.dmpGetAccel(&aa, FIFOBuffer);
        mpu.dmpGetGyro(&gy, FIFOBuffer);
        mpu.dmpGetGravity(&gravity, &q);
        mpu.dmpGetLinearAccel(&aaReal, &aa, &gravity);

        data[0] = (float)aaReal.x;
        data[1] = (float)aaReal.y;
        data[2] = (float)aaReal.z;
        data[3] = (float)gy.x;
        data[4] = (float)gy.y;
        data[5] = (float)gy.z;
    }
    return 0; // Returning 0 means success
}

uint8_t poll_ADC(void) {
    data[6] = analogRead(A0);
    return 0;
}