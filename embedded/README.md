## Setup

### Using Arduino IDE
Necessary Libraries
- Download Adafruit Unifed Sensor Library (v1.1)
- Download Adafruit MPU6050 Library (v2.2)
- Download mWebSockets Library by Dawid Kurek https://github.com/skaarj1989/mWebSockets (v1.6)
- Download Board specific Libraries (if you board needs them)

--- 

By default the configuration is set to Right side, if you are Southpaw or are using the board on the left for other reasons you can specify it by editing this project's **config.h** by replacing "R" with "L" (you will have to flash your board again for this to be applied)


#### setup your connection
create a file named **"arduino_secrets.h"**  with your wifi information. DO NOT COMMIT this file to source control.
It should look something like this:
```c
#define SECRET_SSID "<your_SSID>"
#define SECRET_PASS "<your_password>"
```
It would be even better to inject these parameters in an even safer way, ideally at runtime.


If you stil get errors related to wifi you may need to go to the directory in which Arduino IDE downloads libraries and change a configuration option.
Go to Arduino/libraries/mWebSockets/src and edit the file **"config.h"** 

```c
//#define NETWORK_CONTROLLER ETHERNET_CONTROLLER_W5X00 
// change line above into the following 
#define NETWORK_CONTROLLER NETWORK_CONTROLLER_WIFI
```

#### Schematics for Arduino Uno Rev4
| Arduino | MPU6050|
|---------| -------|
| GND | GND|
| 3.3V | VCC |
| A4 | SCL |
| A5 | SDA | 

#### compile and upload
You can connect your board and compile and upload the sketch


---

Necessary external libraries are not distributed with this project and are licenced under their own license
