#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecureBearSSL.h>

// Configurazione WiFi
#define STASSID "Gruppo4Network"
#define STAPSK  "Networks"

// Configurazione RestDB
#define RESTDB_URL "https://clonedb1-7b36.restdb.io"
#define API_KEY "2e1c9e05dd157fa74d69bfeab6b520b7c1e58"

ESP8266WiFiMulti WiFiMulti;

void setup() {
  Serial.begin(115200);
  Serial.println("\nAvvio connessione WiFi...");
  
  WiFi.mode(WIFI_STA);
  WiFiMulti.addAP(STASSID, STAPSK);
  
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.print("\nConnesso! IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFiMulti.run() == WL_CONNECTED) {
    
    std::unique_ptr<BearSSL::WiFiClientSecure> client(new BearSSL::WiFiClientSecure);
    client->setInsecure(); // Per sviluppo - in produzione usa certificati!
    
    HTTPClient https;
    
    // Scegli l'endpoint che ti serve:
    String endpoint = RESTDB_URL;
    endpoint += "/rest/rilevazioni"; // Cambia qui per altri endpoint
    
    Serial.println("[HTTPS] Connessione a: " + endpoint);
    
    if (https.begin(*client, endpoint)) {
      
      // Headers richiesti da RestDB
      https.addHeader("Content-Type", "application/json");
      https.addHeader("x-apikey", API_KEY);
      https.addHeader("cache-control", "no-cache");
      
      // Creazione JSON con ArduinoJson
      StaticJsonDocument<200> doc;
      
      // Inserisci i tuoi dati qui
      doc["weight"] = 1256;
      doc["humidity"] = 100;
      doc["temperature"] = 50;
      doc["sound_level"] = 999;
      
      // Serializza JSON in stringa
      String jsonOutput;
      serializeJson(doc, jsonOutput);
      
      Serial.println("[POST] Invio dati:");
      Serial.println(jsonOutput);
      
      // Invio POST
      int httpCode = https.POST(jsonOutput);
      
      if (httpCode > 0) {
        Serial.printf("[HTTP] Risposta: %d\n", httpCode);
        
        if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_CREATED) {
          String payload = https.getString();
          Serial.println("Risposta del server:");
          Serial.println(payload);
          
          // Se vuoi parsare la risposta JSON:
          StaticJsonDocument<512> responseDoc;
          DeserializationError error = deserializeJson(responseDoc, payload);
          
          if (!error) {
            Serial.println("JSON ricevuto correttamente!");
            // Accedi ai campi: responseDoc["campo"]
          }
        }
      } else {
        Serial.printf("[HTTP] Errore: %s\n", https.errorToString(httpCode).c_str());
      }
      
      https.end();
      
    } else {
      Serial.println("[HTTPS] Connessione fallita!");
    }
  } else {
    Serial.println("WiFi disconnesso!");
  }
  
  Serial.println("\nAttesa 10 secondi...\n");
  delay(10000);
}

// ESEMPIO: Per inviare a endpoint diversi, cambia la riga 48:
// "/rest/apiari"      - per apiari
// "/rest/arnie"       - per arnie  
// "/rest/sensori"     - per sensori
// "/rest/rilevazioni" - per rilevazioni
// "/rest/notifiche"   - per notifiche
// "/rest/tipi"        - per tipi
// "/rest/utenti"      - per utenti
