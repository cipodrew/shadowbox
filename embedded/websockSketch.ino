#include <WiFiS3.h>
#include <WebSocketServer.h>
#include "arduino_secrets.h"
#include "config.h"

#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <Wire.h>


using namespace net;

Adafruit_MPU6050 mpu;
WebSocketServer webSockServer{ 3000 };

const char ssid[] = SECRET_SSID;  // change your network SSID
const char pass[] = SECRET_PASS;  // change your network password

int status = WL_IDLE_STATUS;

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  Serial.println("Starting now");

  mpuSetup();

  String fv = WiFi.firmwareVersion();
  if (fv < WIFI_FIRMWARE_LATEST_VERSION)
    Serial.println("Please upgrade the firmware");

  // attempt to connect to WiFi network:
  while (status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);

    // wait 4 seconds for connection:
    delay(4000);
  }

  // print your board's IP address:
  Serial.print("IP Address: ");
  IPAddress ip = WiFi.localIP();
  Serial.println(ip);

  ////------------
  webSockServer.onConnection([](WebSocket &ws) {
    const auto protocol = ws.getProtocol();
    if (protocol) {
      Serial.print(F("Client protocol: "));
      Serial.println(protocol);
    }

    ws.onClose([](WebSocket &, const WebSocket::CloseCode, const char *,
                  uint16_t) {
      Serial.println(F("Disconnected"));
    });

    Serial.print(F("New WebSocket Connnection from client: "));
    Serial.println(ws.getRemoteIP());

    const char message[]{ "Hello from Arduino server!" };
    ws.send(WebSocket::DataType::TEXT, message, strlen(message));
  });
  ////////--------

  webSockServer.begin();
}

//========---------------main loop--------=======
//===--Globals and constants--====
// const int COMMUNICATION_PROTOCOL_VERSION = 1;
// static const char SIDE[] = "R";
bool isValChanged = false;
bool hasMaxChanged = false;
float lastReadings = 0;
float maxReadings = 0;
const float X_treshHold = 4.2;
const float delta_treshHold = 4.2;

typedef struct Prev {
  float x;
  float y;
  float z;
} Prev;
Prev prev_accel = { 0, 0, 0 };

float deltaX = 0;
float deltaY = 0;
float deltaZ = 0;

typedef struct Delta {
  float x;
  float y;
  float z;
} Delta;
Delta delta_accel = { 0, 0, 0 };

typedef struct ReadingToSend {
  float x;
  float y;
  float z;
  float modulus;
} ReadingToSend;
ReadingToSend reading_to_send = { 0, 0, 0, 0 };

float local_max = 0;
bool is_in_punching_motion = false;

  //---High pass che fa filtering invece che mandare ogni singola lettura ----
  /*
      7 perché 4 per il numero contando 2 decimali di parte intera e 2 di parte decimale
      +1 per punto separatore
      +1 per terminatore di stringa (0 binario)
      +1 per il possibile segno - per letture negative
      //ATTENZIONE: POSSIBILE CODICE UNSAFE
      //tuttavia non dovrebbe essere umanamente possibile superare le 2 cifre intere come lettura
      */
  const int NUM_SIZE = 7;
  char string_x[NUM_SIZE];
  char string_y[NUM_SIZE];
  char string_z[NUM_SIZE];
  char string_mod[NUM_SIZE];
  char result[sizeof(COMMUNICATION_PROTOCOL_VERSION) + sizeof(SIDE) + NUM_SIZE * 4] = "";  // Adjust the buffer size as needed

void loop() {
  webSockServer.listen();

  sensors_event_t a, g, temp;
  mpu.getEvent(&a, &g, &temp);
  /*
 Caolcolo il delta di accelerazione
*/

//-----------print values---
  //====================== X =============
  // Serial.print("Acceleration:   X:");
  // Serial.print(a.acceleration.x);
  // Serial.println(" (m/s^2)");

  // Serial.print("Previous Acceleration:  X:");
  // Serial.print(prev_accel.x);
  // Serial.println(" (m/s^2)");

  delta_accel.x = a.acceleration.x - prev_accel.x;
  prev_accel.x = a.acceleration.x;
  // Serial.print("Delta X:");
  // Serial.print(delta_accel.x);
  // Serial.println(" (m/s^2)");
  // Serial.println();

  // //====================== Y =============
  // Serial.print("Acceleration:   Y:");
  // Serial.print(a.acceleration.y);
  // Serial.println(" (m/s^2)");

  // Serial.print("Previous Acceleration:  Y:");
  // Serial.print(prev_accel.y);
  // Serial.println(" (m/s^2)");

  delta_accel.y = a.acceleration.y - prev_accel.y;
  prev_accel.y = a.acceleration.y;
  // Serial.print("Delta Y:");
  // Serial.print(delta_accel.y);
  // Serial.println(" (m/s^2)");
  // Serial.println();

  // //====================== Z =============
  // Serial.print("Acceleration:   Z:");
  // Serial.print(a.acceleration.z);
  // Serial.println(" (m/s^2)");

  // Serial.print("Previous Acceleration:  Z:");
  // Serial.print(prev_accel.z);
  // Serial.println(" (m/s^2)");

  delta_accel.z = a.acceleration.z - prev_accel.z;
  prev_accel.z = a.acceleration.z;
  // Serial.print("Delta Z:");
  // Serial.print(delta_accel.z);
  // Serial.println(" (m/s^2)");
  // Serial.println();

  //====================== Modulus =============
  float modulus = sqrtf(a.acceleration.x * a.acceleration.x + a.acceleration.y * a.acceleration.y + a.acceleration.z * a.acceleration.z);
  // float modulus = sqrtf(a.acceleration.x² + a.acceleration.y² + a.acceleration.z²);
  // Serial.print("Modulus: ");
  // Serial.print(modulus);
  // Serial.println(" (m/s^2)");

  float delta_modulus = sqrtf(delta_accel.x * delta_accel.x + delta_accel.y * delta_accel.y + delta_accel.z * delta_accel.z);
  // Serial.print("DELTA Modulus: ");
  // Serial.print(delta_modulus);
  // Serial.println(" (m/s^2)");

    // Debounce: inviare solo il massimo locale, cioé il numero max da quando va sopra soglia a quando va sotto, é una macchina a 2 stati tramite la flag is_in_punching_motion
  if (highPass(delta_modulus)) {
    is_in_punching_motion = true;

    if (delta_modulus > local_max){
      local_max = delta_modulus;
      reading_to_send.x = delta_accel.x;
      reading_to_send.y = delta_accel.y;
      reading_to_send.z = delta_accel.z;
      reading_to_send.modulus = delta_modulus;

    }
  }
if(!highPass(delta_modulus)){ 
  if (is_in_punching_motion){ //punch execution ended
    dtostrf(reading_to_send.x, 4, 2, string_x);
    dtostrf(reading_to_send.y, 4, 2, string_y);
    dtostrf(reading_to_send.z, 4, 2, string_z);
    dtostrf(reading_to_send.modulus, 4, 2, string_mod);
    snprintf(result, sizeof(result), "%d|%s|%s|%s|%s|%s", COMMUNICATION_PROTOCOL_VERSION, SIDE, string_x, string_y, string_z, string_mod);
    Serial.println(result);
    webSockServer.broadcast(WebSocket::DataType::TEXT, result, strlen(result));
    is_in_punching_motion = false;
    local_max = 0;
  }
}

  delay(100);
}  //loop



bool highPass(float reading_delta) {
  if (reading_delta >= delta_treshHold) {  //we should not need to call abs() because modulus is always positive by definition
    return true;
  }
  return false;
}


void mpuSetup() {
  // Check if the MPU6050 sensor is detected
  if (!mpu.begin()) {
    Serial.println("Failed to find MPU6050 chip");
    while (1) {
      delay(10);
    }
  }
  Serial.println("MPU6050 Found!");

  // set accelerometer range to +-8G
  mpu.setAccelerometerRange(MPU6050_RANGE_8_G);

  // set gyro range to +- 500 deg/s
  mpu.setGyroRange(MPU6050_RANGE_500_DEG);

  // set filter bandwidth to 21 Hz
  mpu.setFilterBandwidth(MPU6050_BAND_21_HZ);

  // Add a delay for stability
  delay(100);
}

//Possiamo usare varie strategie per eseguire il push di informazioni tramite il metodo broadcast
/*
STRATEGIA 1: --semi-pollling
  push ogni tot  millisecondi del valore più alto dall'ultimo push

STRATEGIA 2: --Evento sopra soglia (high pass filter)
  push ogni volta che si registra un valore sopra soglia

STRATEGIA 3: --Evento nuovo massimo
  push ogni volta che si registra un nuovo massimo e si ignorano tutti gli altri valori anche se sono sopra soglia

STRATEGIA 4: --Evento cambiamenti percentuale sopra soglia
  push ogni volta che si registra un valore diverso dall'ultimo inviato se la differenza é sopra una certa soglia percentuale

STRATEGIA 5 (strategia scelta): --Debouncing per evitare di registrare la fase di ritiro come input
*/

