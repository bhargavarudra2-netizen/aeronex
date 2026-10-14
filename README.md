# Aeronex 🧠✨
### On-Device TinyML Gesture Recognition & BLE Wireless Controller for ESP32

[![Platform](https://img.shields.io/badge/Platform-ESP32-000000?logo=espressif&logoColor=white)](https://www.espressif.com/)
[![TinyML](https://img.shields.io/badge/TinyML-Edge%20Impulse-3848A6?logo=edgeimpulse&logoColor=white)](https://edgeimpulse.com/)
[![Framework](https://img.shields.io/badge/Framework-PlatformIO%20%2F%20Arduino-F16529?logo=platformio&logoColor=white)](https://platformio.org/)
[![BLE](https://img.shields.io/badge/Interface-BLE%20HID%20Keyboard-blue?logo=bluetooth&logoColor=white)](https://www.bluetooth.com/)
[![Accuracy](https://img.shields.io/badge/Accuracy-95%25-success)](#how-it-works)
[![Inference](https://img.shields.io/badge/Inference-~10ms-brightgreen)](#how-it-works)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📌 Overview

**Aeronex** is an ultra-responsive, wearable gesture-control system running directly on an **ESP32** microcontroller. Using an **MPU6050 6-axis IMU** and an **Edge Impulse** TinyML neural network, Aeronex detects and classifies complex 3D hand gestures entirely on-device (zero cloud dependency) and translates them into system shortcuts via **Bluetooth Low Energy (BLE) HID**.

Whether you want to capture screenshots, manage your clipboard, or switch applications seamlessly without touching your mouse or keyboard, Aeronex delivers tactile, latency-free control.

---

## 🎯 Gesture-to-Action Shortcuts

| Gesture | Movement Description | Triggered OS Action | Windows Shortcut | macOS Equivalent |
|:---|:---|:---|:---:|:---:|
| ⭕ **Circle** | Clockwise / circular air motion | Snipping Tool | `Win + Shift + S` | `Cmd + Shift + 4` |
| ➡️ **Forward** | Quick forward thrust motion | Clipboard History | `Win + V` | Paste History / Paste |
| ↔️ **Left-Right** | Horizontal swipe (left or right) | Application Switcher | `Alt + Tab` | `Cmd + Tab` |
| ↕️ **Up-Down** | Vertical swipe (up or down) | Task View / Mission Control | `Win + Tab` | `Control + Up` |
| 🛑 **Idle** | Resting / holding position | None (Filtered out) | — | — |

---

## ⚡ Key Highlights & Architecture

1. **Edge Impulse Neural Network**: 7-feature sensor fusion model (`ax`, `ay`, `az`, `gx`, `gy`, `gz`, `adc`) running locally with an inference speed of **~10ms**.
2. **DMP (Digital Motion Processor) Fusion**: Hardware offloading on the MPU6050 computes 6-axis motion fusion quaternions and linear acceleration, freeing up ESP32 processing cycles.
3. **Active FIFO Drain Logic**: Drains the MPU6050 FIFO buffer continuously in non-blocking loops to eliminate FIFO overflow errors and motion lag.
4. **Push-to-Gesture Activation**: Controlled via a physical activation switch (GPIO 18). Gestures are only sampled and processed when intentionally holding the trigger button, preventing false triggers during regular hand movements.
5. **Dual-Path Temporal Validation**:
   - **Hot Start**: Rapidly detects deliberate gestures performed with velocity before the button press.
   - **Consecutive-Reading Filter**: Requires sequential confidence before triggering, boosting real-world accuracy to **95%**.
6. **Driverless BLE HID**: Appears as a native Bluetooth keyboard (`ESP32 BLE Keyboard`). No host companion software or drivers are required on Windows, macOS, Linux, Android, or iOS.

---

## 🛠️ Hardware Requirements & Wiring

### Components
- **ESP32 Development Board** (NodeMCU-32S, ESP32-WROOM-32, etc.)
- **MPU6050 6-Axis IMU Module** (Accelerometer + Gyroscope)
- **Push Button / Tactile Switch** (Gesture activation trigger)
- **Breadboard & Jumper Wires**
- **Micro-USB / Type-C Cable** (Data cable for programming and power)

### Pinout Connection Table

| MPU6050 Pin | ESP32 Pin | Function / Description |
|:---|:---:|:---|
| **VCC** | `3V3` (or `5V` if module has 3.3V regulator) | Power Supply |
| **GND** | `GND` | Ground |
| **SCL** | `GPIO 22` | I2C Clock |
| **SDA** | `GPIO 21` | I2C Data |
| **INT** | `GPIO 34` | Hardware Interrupt (DMP Data Ready) |
| **AD0** | `GND` | I2C Address Select (`0x68`) |

| Button Pin | ESP32 Pin | Function / Description |
|:---|:---:|:---|
| **Terminal 1** | `GPIO 18` | Gesture Activation (Internal Pull-Up enabled) |
| **Terminal 2** | `GND` | Ground (Active LOW signal when pressed) |

> [!TIP]
> Make sure **GPIO 34** is used for the MPU interrupt as configured in [`src/tempClassifyWithAction.cpp`](src/tempClassifyWithAction.cpp). If using a different pin, update `INTERRUPT_PIN` accordingly.

---

## 🚀 How to Set Up & Use

### Step 1: Install Prerequisites

1. Install **[Visual Studio Code](https://code.visualstudio.com/)**.
2. Install the **[PlatformIO IDE extension](https://platformio.org/install/ide?install=vscode)** from the VS Code Marketplace.
3. Install USB-to-UART drivers if your ESP32 is not recognized:
   - For **CP2102** chips: Run the installer included in [`cp2102_driver/pololu-cp2102-windows/`](cp2102_driver/pololu-cp2102-windows/)
   - For **CH340** chips: Download and install the standard CH341SER driver.

---

### Step 2: Clone the Repository

```bash
git clone https://github.com/bhargavarudra2-netizen/aeronex.git
cd aeronex
```

---

### Step 3: Build & Flash Firmware

#### Using PlatformIO CLI:
```bash
# 1. Compile the project
pio run

# 2. Flash to connected ESP32 board
pio run --target upload

# 3. Open Serial Monitor (Baud rate: 115200)
pio device monitor
```

#### Using VS Code PlatformIO GUI:
1. Open the project folder in VS Code.
2. Click the **PlatformIO Alien Icon** on the sidebar.
3. Under **Project Tasks** > `esp32dev`:
   - Click **Build** to compile the firmware.
   - Click **Upload** to flash the code to your ESP32.
   - Click **Monitor** to open the real-time serial output (115200 baud).

---

### Step 4: Pair with Your Computer via Bluetooth

1. Power on your ESP32 (keep the device resting on a flat surface for 2 seconds while MPU6050 DMP calibration initializes).
2. Open Bluetooth settings on your computer / laptop:
   - **Windows**: Settings > Bluetooth & Devices > Add Device > Bluetooth.
   - **macOS**: System Settings > Bluetooth.
3. Look for **`ESP32 BLE Keyboard`** in the list of available devices and click **Connect**.
4. Once paired, the ESP32 acts as a standard wireless keyboard.

---

### Step 5: Performing Gestures

1. Hold the controller in your hand with the MPU6050 facing forward/flat.
2. **Press and hold the button** connected to `GPIO 18`.
3. **Perform the desired gesture**:
   - Draw a circle in the air ➔ Snipping Tool (`Win+Shift+S`) opens.
   - Thrust forward ➔ Clipboard history (`Win+V`) opens.
   - Swipe left or right ➔ Application switch (`Alt+Tab`) triggers.
   - Swipe up or down ➔ Task View (`Win+Tab`) triggers.
4. **Release the button** when finished. Releasing the button flushes the motion buffer and prevents unintended keystrokes.

---

## 📁 Repository Structure

```
aeronex/
├── cp2102_driver/                      # Windows CP2102 USB-to-UART bridge drivers
├── include/                            # Project header definitions
├── lib/
│   ├── ESP32-BLE-Combo-main/           # BLE HID Keyboard & Mouse library
│   └── five-gesture_v1_inferencing_customBalance/ # Edge Impulse C++ SDK & ML model
├── src/
│   └── tempClassifyWithAction.cpp      # Main firmware: DMP polling, ML inference, action mapping
├── .gitignore                          # Git ignore rules for build artifacts
├── LICENSE                             # MIT License
├── platformio.ini                      # PlatformIO board & dependency configurations
└── README.md                           # Documentation and usage guide
```

---

## ⚙️ Customization

### Changing Keystroke Shortcuts
You can customize the assigned keyboard actions by editing `execute_gesture_action()` in [`src/tempClassifyWithAction.cpp`](src/tempClassifyWithAction.cpp):

```cpp
void execute_gesture_action(int gesture_index) {
    if (Keyboard.isConnected()) {
        if (gesture_index == 0) { // CIRCLE
            // Example: Change to Play/Pause media
            Keyboard.write(KEY_MEDIA_PLAY_PAUSE);
        }
        else if (gesture_index == 1) { // FORWARD
            // Example: Copy (Ctrl + C)
            Keyboard.press(KEY_LEFT_CTRL); Keyboard.press('c');
            delay(100); Keyboard.releaseAll();
        }
        // ...
    }
}
```

### Changing the Trigger Pin
If you need to connect your push button to a different GPIO, update `BUTTON_PIN`:
```cpp
const int BUTTON_PIN = 18; // Change to your preferred input pin
```

---

## 🔍 Troubleshooting

| Issue | Likely Cause | Solution |
|:---|:---|:---|
| `MPU6050 connection failed` | Wiring issue or incorrect I2C address | Check SDA/SCL connections. Ensure AD0 is tied to GND. Verify pullup resistors if using long wires. |
| Device reboots continuously | Strapping pin conflict or power brownout | Ensure `BUTTON_PIN` is not using strapping pins like GPIO 0, 2, 12, or 15. Power ESP32 from a reliable USB port. |
| Bluetooth not connecting | Cached pairing on host OS | Remove `ESP32 BLE Keyboard` from your computer's paired Bluetooth list and re-pair. |
| Inaccurate gesture triggering | Fast movements before pressing button | Utilize the Push-to-Gesture button: press button, execute distinct gesture, then release. |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Third-party libraries under `lib/` (Edge Impulse SDK, ESP32-BLE-Combo, and I2Cdevlib) are subject to their respective licenses.
