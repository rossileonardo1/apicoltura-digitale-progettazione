<#include <Arduino.h>
#include <ArduinoJson.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

// Configurazione WiFi
#define STASSID "Gruppo4Network"
#define STAPSK  "Networks"

// Configurazione RestDB - CLONE 5
#define RESTDB_URL "https://clonedb5dhsjjhhfudii-66f3.restdb.io"
#define API_KEY "28ade382b313db86d3cab6da35d50b0666f2f"
#define URLsensori "https://clonedb5dhsjjhhfudii-66f3.restdb.io/rest/sensori"

void setup() {
  Serial.begin(115200);
  delay(1000);
  
  Serial.println("\n=== ESP32-CAM RestDB - GET Sensori ===");
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
    
    // Attesa per stabilizzare connessione
    delay(1000);
    
    // Lettura dati sensori
    leggiSensori();
    
  } else {
    Serial.println("✗ Connessione WiFi fallita!");
  }
  
  Serial.println("\n=== Completato ===");
  Serial.println("Premi RESET per nuova lettura");
  
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
}

void loop() {
  delay(10000);
}

void leggiSensori() {
  Serial.println("\n--- GET dati sensori dal database ---");
  
  WiFiClientSecure *client = new WiFiClientSecure;
  
  if(client) {
    // Impostazioni SSL
    client->setInsecure();
    client->setTimeout(15); // Timeout 15 secondi
    
    HTTPClient https;
    
    // Usa URLsensori direttamente
    Serial.print("[GET] ");
    Serial.println(URLsensori);
    
    // Timeout più lungo per ESP32-CAM
    https.setTimeout(15000); // 15 secondi
    
    if (https.begin(*client, URLsensori)) {
      
      Serial.println("[HTTPS] Connessione stabilita");
      
      https.addHeader("Content-Type", "application/json");
      https.addHeader("x-apikey", API_KEY);
      https.addHeader("cache-control", "no-cache");
      
      Serial.println("[GET] Invio richiesta...");
      
      int httpCode = https.GET();
      
      Serial.print("[HTTP] Risposta ricevuta - Codice: ");
      Serial.println(httpCode);
      
      if (httpCode > 0) {
        
        if (httpCode == HTTP_CODE_OK) {
          Serial.println("✓ SUCCESS");
          
          String payload = https.getString();
          
          // Mostra risposta RAW
          Serial.println("\n--- RISPOSTA SERVER (RAW) ---");
          Serial.println(payload);
          Serial.println("-----------------------------\n");
          
          JsonDocument responseDoc;
          DeserializationError error = deserializeJson(responseDoc, payload);
          
          if (!error) {
            
            if (responseDoc.is<JsonArray>()) {
              JsonArray array = responseDoc.as<JsonArray>();
              
              Serial.println("╔════════════════════════════════════════════════╗");
              Serial.println("║           SENSORI - TABELLA COMPLETA           ║");
              Serial.println("╠════════════════════════════════════════════════╣");
              
              if (array.size() == 0) {
                Serial.println("║ ⚠️  NESSUN SENSORE NEL DATABASE!              ║");
                Serial.println("║                                                ║");
                Serial.println("║ Devi prima inserire dati nella tabella SENSORI║");
                Serial.println("║ usando POST o manualmente da RestDB.io        ║");
                Serial.println("╚════════════════════════════════════════════════╝");
              } else {
                int count = 0;
                for (JsonObject obj : array) {
                  count++;
                  
                  Serial.print("║ Sensore #");
                  Serial.println(count);
                  Serial.println("╟────────────────────────────────────────────────╢");
                  
                  // sen_id
                  if (!obj["sen_id"].isNull()) {
                    Serial.print("║ ID Sensore:  ");
                    Serial.println(obj["sen_id"].as<int>());
                  }
                  
                  // sen_stato
                  if (!obj["sen_stato"].isNull()) {
                    Serial.print("║ Stato:       ");
                    Serial.println(obj["sen_stato"].as<bool>() ? "ATTIVO" : "SPENTO");
                  }
                  
                  // sen_min
                  if (!obj["sen_min"].isNull()) {
                    Serial.print("║ Soglia MIN:  ");
                    Serial.println(obj["sen_min"].as<float>(), 2);
                  }
                  
                  // sen_max
                  if (!obj["sen_max"].isNull()) {
                    Serial.print("║ Soglia MAX:  ");
                    Serial.println(obj["sen_max"].as<float>(), 2);
                  }
                  
                  // Timestamp automatico RestDB
                  if (!obj["_created"].isNull()) {
                    Serial.print("║ Creato:      ");
                    Serial.println(obj["_created"].as<const char*>());
                  }
                  
                  Serial.println("╚════════════════════════════════════════════════╝");
                  Serial.println();
                }
                
                Serial.print("Totale sensori: ");
                Serial.println(array.size());
              }
              
            } else if (responseDoc.is<JsonObject>()) {
              // Singolo sensore
              Serial.println("╔════════════════════════════════════════════════╗");
              Serial.println("║              SINGOLO SENSORE                   ║");
              Serial.println("╠════════════════════════════════════════════════╣");
              
              if (!responseDoc["sen_id"].isNull()) {
                Serial.print("║ ID Sensore:  ");
                Serial.println(responseDoc["sen_id"].as<int>());
              }
              
              if (!responseDoc["sen_stato"].isNull()) {
                Serial.print("║ Stato:       ");
                Serial.println(responseDoc["sen_stato"].as<bool>() ? "ATTIVO" : "SPENTO");
              }
              
              if (!responseDoc["sen_min"].isNull()) {
                Serial.print("║ Soglia MIN:  ");
                Serial.println(responseDoc["sen_min"].as<float>(), 2);
              }
              
              if (!responseDoc["sen_max"].isNull()) {
                Serial.print("║ Soglia MAX:  ");
                Serial.println(responseDoc["sen_max"].as<float>(), 2);
              }
              
              if (!responseDoc["_created"].isNull()) {
                Serial.print("║ Creato:      ");
                Serial.println(responseDoc["_created"].as<const char*>());
              }
              
              Serial.println("╚════════════════════════════════════════════════╝");
            }
            
          } else {
            Serial.print("✗ Errore parsing JSON: ");
            Serial.println(error.c_str());
          }
          
        } else if (httpCode == HTTP_CODE_MOVED_PERMANENTLY || httpCode == HTTP_CODE_FOUND) {
          Serial.println("⚠ Redirect - controlla URL");
        } else if (httpCode == HTTP_CODE_UNAUTHORIZED) {
          Serial.println("✗ ERRORE: API Key non valida!");
        } else if (httpCode == HTTP_CODE_NOT_FOUND) {
          Serial.println("✗ ERRORE: Endpoint non trovato!");
        } else {
          Serial.print("✗ ERRORE HTTP: ");
          Serial.println(httpCode);
          String errorPayload = https.getString();
          if (errorPayload.length() > 0) {
            Serial.println("\n--- Dettagli errore ---");
            Serial.println(errorPayload);
            Serial.println("-----------------------");
          }
        }
      } else {
        Serial.printf("✗ Errore connessione: %s\n", https.errorToString(httpCode).c_str());
        Serial.println("\nPossibili cause:");
        Serial.println("- Timeout di connessione");
        Serial.println("- Problemi DNS");
        Serial.println("- Firewall/Router blocca connessione");
        Serial.println("- SSL handshake fallito");
      }
      
      https.end();
      
    } else {
      Serial.println("✗ [HTTPS] Impossibile iniziare connessione!");
      Serial.println("Verifica URL e connessione internet");
    }
    
    delete client;
    
  } else {
    Serial.println("✗ Impossibile creare WiFiClientSecure!");
  }
}

/*
 * ╔═══════════════════════════════════════════════════════════╗
 * ║     CODICE GET - SENSORI CON DEBUG E TIMEOUT FISSI       ║
 * ╚═══════════════════════════════════════════════════════════╝
 * 
 * CORREZIONI APPLICATE:
 * ═══════════════════════════════════════════════════════════
 * ✓ Aggiunta #define URLsensori
 * ✓ Timeout aumentato a 15 secondi (client e https)
 * ✓ Delay 1s dopo connessione WiFi per stabilizzare
 * ✓ Debug dettagliato step-by-step
 * ✓ Gestione errori HTTP migliorata
 * ✓ Messaggi di errore specifici per ogni caso
 * 
 * CAMPI LETTI:
 * ═══════════════════════════════════════════════════════════
 * ✓ sen_id      - ID sensore
 * ✓ sen_stato   - Stato ON/OFF
 * ✓ sen_min     - Soglia minima
 * ✓ sen_max     - Soglia massima
 * ✓ _created    - Timestamp creazione
 * 
 * SE SI BLOCCA ANCORA:
 * ═══════════════════════════════════════════════════════════
 * 1. Controlla che il router non blocchi ESP32-CAM
 * 2. Prova a pingare clonedb5dhsjjhhfudii-66f3.restdb.io
 * 3. Verifica che la API key sia corretta
 * 4. Controlla Serial Monitor per vedere dove si ferma
 */
