#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// Configurazione WiFi
#define STASSID "Gruppo4Network"
#define STAPSK  "Networks"

// Configurazione RestDB - CLONE 5
#define API_KEY "28ade382b313db86d3cab6da35d50b0666f2f"
#define URLsensori "https://clonedb5dhsjjhhfudii-66f3.restdb. io/rest/sensori"  // ← CORRETTO

// ===== CONFIGURAZIONE SENSORE =====
#define SENSORE_ID "696b57209f6efb4f00000ffe"
#define SEN_ID_NUM 1
#define NUOVO_STATO false      // ← true=ACCESO, false=SPENTO
#define SEN_MIN 18.0
#define SEN_MAX 26.0
#define SEN_ARN_ID 1
#define SEN_TIP_ID 1

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== ESP32-CAM RestDB - PATCH Stato Sensore ===");
  Serial.println("Database: CLONE 5");
  Serial.println("Connessione WiFi...");
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(STASSID, STAPSK);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  Serial.println();
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("✓ WiFi connesso!");
    Serial.print("  IP: ");
    Serial.println(WiFi.localIP());
    Serial.print("  Signal: ");
    Serial.print(WiFi. RSSI());
    Serial.println(" dBm");
    
    delay(2000);
    
    modificaStatoSensore();
    
  } else {
    Serial.println("✗ Connessione WiFi fallita!");
  }
  
  Serial.println("\n=== Completato ===");
  Serial.println("Premi RESET per modificare di nuovo");
  
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
}

void loop() {
  delay(10000);
}

void modificaStatoSensore() {
  Serial.println("\n--- PATCH - Modifica stato sensore ---");
  
  WiFiClientSecure *client = new WiFiClientSecure;
  
  if(client) {
    client->setInsecure();
    client->setTimeout(30);
    client->setHandshakeTimeout(30);
    
    HTTPClient https;
    
    String endpoint = URLsensori;
    endpoint += "/";
    endpoint += SENSORE_ID;
    
    Serial.print("[PATCH] ");
    Serial.println(endpoint);
    
    https.setTimeout(30000);
    
    Serial.println("[HTTPS] Tentativo connessione...");
    
    if (https.begin(*client, endpoint)) {
      
      Serial.println("[HTTPS] Connessione stabilita");
      
      // Headers
      https.addHeader("Content-Type", "application/json");
      https.addHeader("x-apikey", API_KEY);
      https.addHeader("cache-control", "no-cache");
      
      // JSON completo
      JsonDocument doc;
      doc["sen_id"] = SEN_ID_NUM;
      doc["sen_stato"] = NUOVO_STATO;
      doc["sen_min"] = SEN_MIN;
      doc["sen_max"] = SEN_MAX;
      doc["sen_arn_id"] = SEN_ARN_ID;
      doc["sen_tip_id"] = SEN_TIP_ID;
      
      String jsonOutput;
      serializeJson(doc, jsonOutput);
      
      Serial. println("\n[PATCH] Dati da inviare:");
      Serial.println(jsonOutput);
      Serial.println();
      Serial.print("Sensore ID: ");
      Serial.println(SEN_ID_NUM);
      Serial.print("Nuovo stato: ");
      Serial.println(NUOVO_STATO ?  "ACCESO (true)" : "SPENTO (false)");
      Serial.print("Arnia ID: ");
      Serial.println(SEN_ARN_ID);
      Serial.print("Tipo ID: ");
      Serial.println(SEN_TIP_ID);
      Serial.println();
      
      Serial.println("[PATCH] Invio richiesta...");
      Serial.println("(Attendi, può richiedere fino a 30 secondi)");
      
      int httpCode = https.PATCH(jsonOutput);
      
      Serial.print("[HTTP] Risposta ricevuta - Codice:  ");
      Serial.println(httpCode);
      
      if (httpCode > 0) {
        
        if (httpCode == HTTP_CODE_OK || httpCode == 200) {
          Serial.println("✓ STATO MODIFICATO CON SUCCESSO!");
          
          String payload = https.getString();
          
          Serial.println("\n--- RISPOSTA SERVER ---");
          Serial.println(payload);
          Serial.println("-----------------------\n");
          
          JsonDocument responseDoc;
          DeserializationError error = deserializeJson(responseDoc, payload);
          
          if (!error) {
            Serial.println("╔════════════════════════════════════════════════╗");
            Serial.println("║         SENSORE AGGIORNATO                     ║");
            Serial. println("╠════════════════════════════════════════════════╣");
            
            if (! responseDoc["sen_id"].isNull()) {
              Serial.print("║ ID Sensore:    ");
              Serial.println(responseDoc["sen_id"].as<int>());
            }
            
            if (!responseDoc["sen_stato"].isNull()) {
              Serial.print("║ NUOVO Stato:  ");
              Serial.println(responseDoc["sen_stato"].as<bool>() ? "ACCESO ✓" : "SPENTO ✗");
            }
            
            if (!responseDoc["sen_min"].isNull()) {
              Serial.print("║ Soglia MIN:   ");
              Serial.println(responseDoc["sen_min"].as<float>(), 2);
            }
            
            if (!responseDoc["sen_max"].isNull()) {
              Serial.print("║ Soglia MAX:   ");
              Serial.println(responseDoc["sen_max"].as<float>(), 2);
            }
            
            if (!responseDoc["sen_arn_id"].isNull()) {
              Serial.print("║ Arnia ID:     ");
              Serial.println(responseDoc["sen_arn_id"].as<int>());
            }
            
            if (!responseDoc["sen_tip_id"]. isNull()) {
              Serial. print("║ Tipo ID:       ");
              Serial.println(responseDoc["sen_tip_id"].as<int>());
            }
            
            if (!responseDoc["_changed"].isNull()) {
              Serial.print("║ Modificato:   ");
              Serial.println(responseDoc["_changed"]. as<const char*>());
            }
            
            Serial. println("╚════════════════════════════════════════════════╝");
            
          } else {
            Serial.print("✗ Errore parsing risposta: ");
            Serial.println(error.c_str());
          }
          
        } else if (httpCode == HTTP_CODE_NOT_FOUND || httpCode == 404) {
          Serial.println("✗ ERRORE: Sensore non trovato!");
          Serial.println("Verifica che SENSORE_ID sia corretto");
        } else if (httpCode == HTTP_CODE_UNAUTHORIZED || httpCode == 401) {
          Serial.println("✗ ERRORE:  API Key non valida!");
        } else if (httpCode == HTTP_CODE_BAD_REQUEST || httpCode == 400) {
          Serial.println("✗ ERRORE:  Dati non validi!");
          String errorPayload = https.getString();
          Serial.println(errorPayload);
        } else {
          Serial.print("✗ ERRORE HTTP: ");
          Serial.println(httpCode);
          String errorPayload = https.getString();
          if (errorPayload.length() > 0) {
            Serial. println("\n--- Dettagli errore ---");
            Serial. println(errorPayload);
            Serial.println("-----------------------");
          }
        }
      } else {
        Serial.print("✗ Errore connessione (codice: ");
        Serial.print(httpCode);
        Serial.println(")");
        Serial.print("   Descrizione: ");
        Serial.println(https.errorToString(httpCode));
        
        if (httpCode == -1) {
          Serial.println("\n💡 SUGGERIMENTI:");
          Serial.println("   - Verifica la connessione WiFi");
          Serial.println("   - Controlla il segnale WiFi (RSSI)");
          Serial.println("   - RestDB potrebbe essere temporaneamente non disponibile");
          Serial.println("   - Prova ad aumentare il timeout o riprovare");
        }
      }
      
      https.end();
      
    } else {
      Serial.println("✗ [HTTPS] Impossibile iniziare connessione!");
      Serial.println("   Verifica URL e connessione internet");
    }
    
    delete client;
    
  } else {
    Serial.println("✗ Impossibile creare client!");
  }
}
