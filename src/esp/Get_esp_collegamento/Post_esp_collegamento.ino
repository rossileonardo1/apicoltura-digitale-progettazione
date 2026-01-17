// ============================================================================
// CONNECTION MANAGER - Data Manager per comunicazione con RestDB
// ============================================================================

#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "SensorValidation.h"

// ============================================================================
// STRUTTURE DATI
// ============================================================================

struct ServerConfig {
  char baseUrl[128];
  char apiKey[64];
  int timeout;
};

struct ConfigData {
  bool success;
  SensorConfig ds18b20;
  SensorConfig sht21_humidity;
  SensorConfig sht21_temperature;
  SensorConfig hx711;
  float calibrationFactor;
  long calibrationOffset;
};

struct SensorData {
  char macAddress[18];
  char tipoSensore[32];
  char idSensore[32];
  float valore;
  char unita[8];
  unsigned long timestamp;
  int codiceStato;
  bool alert;
  char alertTipo[8];
};

struct NotificationData {
  char macAddress[18];
  char tipoSensore[32];
  float valoreRiferimento;
  unsigned long timestamp;
  char messaggio[128];
  int livello;
};

// ============================================================================
// VARIABILI GLOBALI
// ============================================================================
ServerConfig* globalServerConfig = nullptr;
bool dataManagerReady = false;

// ============================================================================
// INIZIALIZZAZIONE DATA MANAGER
// ============================================================================
void init_data_manager(ServerConfig* config) {
  Serial.println("  Inizializzazione Data Manager...");
  globalServerConfig = config;
  dataManagerReady = true;
  Serial.println("  + Data Manager pronto");
}

bool is_data_manager_ready() {
  return dataManagerReady;
}

// ============================================================================
// FETCH SENSOR CONFIG - Legge configurazione sensori dal database
// ============================================================================
ConfigData fetch_sensor_config(const char* macAddress) {
  ConfigData config;
  config.success = false;
  
  // Valori di default
  config.ds18b20.abilitato = true;
  config.ds18b20.min = -10.0;
  config.ds18b20.max = 50.0;
  config.ds18b20.intervallo = 60000;
  
  config.sht21_humidity.abilitato = true;
  config.sht21_humidity.min = 20.0;
  config.sht21_humidity.max = 80.0;
  config.sht21_humidity.intervallo = 60000;
  
  config.sht21_temperature.abilitato = true;
  config.sht21_temperature.min = 0.0;
  config.sht21_temperature.max = 45.0;
  config.sht21_temperature.intervallo = 60000;
  
  config.hx711.abilitato = true;
  config.hx711.min = 0.0;
  config.hx711.max = 100.0;
  config.hx711.intervallo = 300000;
  
  config.calibrationFactor = 1.0;
  config.calibrationOffset = 0;
  
  if (!dataManagerReady || globalServerConfig == nullptr) {
    Serial.println("  ! Data Manager non inizializzato");
    return config;
  }
  
  WiFiClientSecure *client = new WiFiClientSecure;
  
  if (client) {
    client->setInsecure();
    client->setTimeout(15);
    
    HTTPClient https;
    
    // Costruisci URL per sensori
    char url[256];
    snprintf(url, sizeof(url), "%s/sensori", globalServerConfig->baseUrl);
    
    Serial.print("  [GET] ");
    Serial.println(url);
    
    https.setTimeout(15000);
    
    if (https.begin(*client, url)) {
      https.addHeader("Content-Type", "application/json");
      https.addHeader("x-apikey", globalServerConfig->apiKey);
      https.addHeader("cache-control", "no-cache");
      
      int httpCode = https.GET();
      
      Serial.print("  [HTTP] Codice risposta: ");
      Serial.println(httpCode);
      
      if (httpCode == HTTP_CODE_OK) {
        String payload = https.getString();
        
        JsonDocument responseDoc;
        DeserializationError error = deserializeJson(responseDoc, payload);
        
        if (!error) {
          if (responseDoc.is<JsonArray>()) {
            JsonArray array = responseDoc.as<JsonArray>();
            
            if (array.size() > 0) {
              // Leggi il primo sensore come esempio
              JsonObject obj = array[0];
              
              if (!obj["sen_stato"].isNull()) {
                bool stato = obj["sen_stato"].as<bool>();
                config.ds18b20.abilitato = stato;
                config.sht21_humidity.abilitato = stato;
                config.sht21_temperature.abilitato = stato;
                config.hx711.abilitato = stato;
              }
              
              if (!obj["sen_min"].isNull()) {
                float minVal = obj["sen_min"].as<float>();
                config.ds18b20.min = minVal;
                config.sht21_humidity.min = minVal;
                config.sht21_temperature.min = minVal;
                config.hx711.min = minVal;
              }
              
              if (!obj["sen_max"].isNull()) {
                float maxVal = obj["sen_max"].as<float>();
                config.ds18b20.max = maxVal;
                config.sht21_humidity.max = maxVal;
                config.sht21_temperature.max = maxVal;
                config.hx711.max = maxVal;
              }
              
              config.success = true;
              Serial.println("  + Configurazione caricata dal server");
            }
          }
        } else {
          Serial.print("  ! Errore parsing JSON: ");
          Serial.println(error.c_str());
        }
      } else {
        Serial.print("  ! Errore HTTP: ");
        Serial.println(httpCode);
      }
      
      https.end();
    } else {
      Serial.println("  ! Impossibile iniziare connessione HTTPS");
    }
    
    delete client;
  }
  
  return config;
}

// ============================================================================
// UTILITY - Ottieni timestamp ISO 8601
// ============================================================================
String getISOTimestamp(unsigned long unixTimestamp) {
  time_t rawtime = (time_t)unixTimestamp;
  struct tm* timeinfo = gmtime(&rawtime);
  
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%S.000Z", timeinfo);
  return String(buffer);
}

// ============================================================================
// SAVE VALUE - Salva singolo valore sensore (POST a rilevazioni)
// ============================================================================
bool save_value(const char* macAddress, const char* tipoSensore,
                const char* idSensore, float valore, const char* unita,
                unsigned long timestamp, int codiceStato,
                bool alert, const char* alertTipo) {
  
  if (!dataManagerReady || globalServerConfig == nullptr) {
    Serial.println("  ! Data Manager non pronto");
    return false;
  }
  
  WiFiClientSecure *client = new WiFiClientSecure;
  
  if (!client) {
    Serial.println("  ! Impossibile creare client");
    return false;
  }
  
  client->setInsecure();
  client->setTimeout(15);
  
  HTTPClient https;
  
  // Costruisci URL per rilevazioni
  char url[256];
  snprintf(url, sizeof(url), "%s/rilevazioni", globalServerConfig->baseUrl);
  
  https.setTimeout(15000);
  
  bool success = false;
  
  if (https.begin(*client, url)) {
    https.addHeader("Content-Type", "application/json");
    https.addHeader("x-apikey", globalServerConfig->apiKey);
    https.addHeader("cache-control", "no-cache");
    
    // Crea JSON payload per tabella rilevazioni
    JsonDocument doc;
    
    // CAMPI OBBLIGATORI per rilevazioni
    doc["ril_dato"] = valore;
    doc["ril_dataOra"] = getISOTimestamp(timestamp);
    
    // CAMPI OPZIONALI (aggiungi metadati utili)
    doc["ril_sensore"] = idSensore;
    doc["ril_tipo"] = tipoSensore;
    doc["ril_unita"] = unita;
    doc["ril_mac"] = macAddress;
    doc["ril_codice_stato"] = codiceStato;
    
    if (alert) {
      doc["ril_alert"] = true;
      doc["ril_alert_tipo"] = alertTipo;
    }
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    Serial.print("  [POST] ");
    Serial.println(url);
    Serial.print("  [DATI] ");
    Serial.println(jsonString);
    
    int httpCode = https.POST(jsonString);
    
    if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_CREATED) {
      Serial.println("  ✓ Rilevazione salvata sul server");
      
      String payload = https.getString();
      
      // Parsing risposta per ottenere ID
      JsonDocument responseDoc;
      DeserializationError error = deserializeJson(responseDoc, payload);
      
      if (!error && responseDoc.containsKey("_id")) {
        const char* id = responseDoc["_id"];
        Serial.print("    ID Record: ");
        Serial.println(id);
      }
      
      success = true;
    } else if (httpCode == 400) {
      Serial.println("  ✗ ERRORE VALIDAZIONE");
      String errorPayload = https.getString();
      Serial.print("    ");
      Serial.println(errorPayload);
    } else if (httpCode == 429) {
      Serial.println("  ✗ TROPPI INVII - Rate limit superato");
      Serial.println("    Attendi 2-5 minuti");
    } else {
      Serial.print("  ! Errore salvataggio - HTTP: ");
      Serial.println(httpCode);
      String errorPayload = https.getString();
      if (errorPayload.length() > 0) {
        Serial.print("    ");
        Serial.println(errorPayload);
      }
    }
    
    https.end();
  } else {
    Serial.println("  ! Impossibile connettersi al server");
  }
  
  delete client;
  return success;
}

// ============================================================================
// SAVE SENSOR DATA - Salva struttura completa
// ============================================================================
bool save_sensor_data(SensorData* data) {
  return save_value(
    data->macAddress,
    data->tipoSensore,
    data->idSensore,
    data->valore,
    data->unita,
    data->timestamp,
    data->codiceStato,
    data->alert,
    data->alertTipo
  );
}

// ============================================================================
// SEND NOTIFICATION - Invia notifica
// ============================================================================
bool send_notification(NotificationData* notification) {
  if (!dataManagerReady || globalServerConfig == nullptr) {
    return false;
  }
  
  WiFiClientSecure *client = new WiFiClientSecure;
  
  if (!client) {
    return false;
  }
  
  client->setInsecure();
  client->setTimeout(15);
  
  HTTPClient https;
  
  char url[256];
  snprintf(url, sizeof(url), "%s/notifiche", globalServerConfig->baseUrl);
  
  https.setTimeout(15000);
  
  bool success = false;
  
  if (https.begin(*client, url)) {
    https.addHeader("Content-Type", "application/json");
    https.addHeader("x-apikey", globalServerConfig->apiKey);
    https.addHeader("cache-control", "no-cache");
    
    JsonDocument doc;
    doc["mac_address"] = notification->macAddress;
    doc["tipo_sensore"] = notification->tipoSensore;
    doc["valore_riferimento"] = notification->valoreRiferimento;
    doc["timestamp"] = notification->timestamp;
    doc["messaggio"] = notification->messaggio;
    doc["livello"] = notification->livello;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    int httpCode = https.POST(jsonString);
    
    if (httpCode == HTTP_CODE_OK || httpCode == HTTP_CODE_CREATED) {
      success = true;
    }
    
    https.end();
  }
  
  delete client;
  return success;
}

// ============================================================================
// NOTIFY - Wrapper per invio notifica semplificato
// ============================================================================
bool notify(const char* macAddress, const char* tipoSensore,
            float valoreRiferimento, unsigned long timestamp,
            const char* messaggio, int livello) {
  
  NotificationData notification;
  strncpy(notification.macAddress, macAddress, sizeof(notification.macAddress) - 1);
  strncpy(notification.tipoSensore, tipoSensore, sizeof(notification.tipoSensore) - 1);
  notification.valoreRiferimento = valoreRiferimento;
  notification.timestamp = timestamp;
  strncpy(notification.messaggio, messaggio, sizeof(notification.messaggio) - 1);
  notification.livello = livello;
  
  return send_notification(&notification);
}
