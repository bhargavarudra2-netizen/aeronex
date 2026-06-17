# Gesture Recognition with TinyML on ESP32 🧠

> On-device hand-gesture classification from a 6-axis IMU, using an **Edge Impulse** neural network running in real time on an **ESP32** — the AI module behind the [Multi-Functional Mouse FYP](https://github.com/abdullah3341429/multifunctional-mouse-fyp).

![Platform](https://img.shields.io/badge/Platform-ESP32-000000?logo=espressif&logoColor=white)
![TinyML](https://img.shields.io/badge/TinyML-Edge%20Impulse-3848A6)
![Accuracy](https://img.shields.io/badge/Accuracy-95%25-success)
![Inference](https://img.shields.io/badge/Inference-~10ms-blue)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## 📌 What this is

A self-contained TinyML pipeline that reads motion from an **MPU6050** IMU, runs a **sensor-fusion neural network** entirely on the ESP32 (no cloud), and maps recognised gestures to keyboard/mouse actions over **BLE**.

## 🎯 Recognised Gestures → Actions

| Gesture | Action triggered |
|---|---|
| ⭕ Circle motion | Snipping Tool (`Win+Shift+S`) |
| ➡️ Forward thrust | Clipboard History (`Win+V`) |
| ↔️ Left–right swipe | Task Switch (`Alt+Tab`) |
| ↕️ Up–down swipe | Task View (`Win+Tab`) |

## ⚙️ How it works

1. **Sensor fusion** — 7 input features are collected from the MPU6050 (accelerometer + gyroscope axes), polled via the DMP.
2. **On-device inference** — the Edge Impulse model (`five-gesture_v1_inferencing`) classifies the motion window in **~10 ms**.
3. **Temporal validation** — a *consecutive-reading* algorithm only fires an action once the same class is seen repeatedly, suppressing false positives from noisy real-world motion.
4. **Action dispatch** — the validated gesture is sent as an OS shortcut over BLE (ESP32-BLE-Combo).

This temporal-validation step is what raises real-world accuracy to **95%**.

## 📁 Structure

```
gesture-recognition-tinyml/
├── src/
│   └── tempClassifyWithAction.cpp   Inference + temporal validation + action dispatch
├── lib/
│   ├── five-gesture_v1_inferencing_customBalance/   Exported Edge Impulse model + SDK
│   └── ESP32-BLE-Combo-main/                        BLE HID keyboard/mouse
└── platformio.ini
```

> Earlier experiments included a 4-class directional model (`lrud` — left/right/up/down) before settling on the balanced 5-gesture model bundled here.

## 🚀 Build & Flash

[PlatformIO](https://platformio.org/) project:

```bash
pio run                 # build
pio run --target upload # flash to ESP32
pio device monitor      # serial monitor @ 115200
```

## 🔗 Part of a larger project

This module is integrated into the full **4-in-1 Multi-Functional Mouse** (air mouse, gesture, stylus, 3D space mouse):
→ [multifunctional-mouse-fyp](https://github.com/abdullah3341429/multifunctional-mouse-fyp)

## 👤 Author

**Abdullah Irshad** — Final Year Project

## 📄 License

Original source under the [MIT License](LICENSE). The Edge Impulse SDK and ESP32-BLE-Combo under `lib/` retain their upstream licenses.
