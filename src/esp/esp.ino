// ============================================================================
// ESP32-CAM - Main Controller Sistema Monitoraggio Arnia
// ============================================================================

#include "SensorValidation.h"

// ============================================================================
// DICHIARAZIONE FUNZIONI DEI SENSORI (definite nei file .ino separati)
// ============================================================================

// DS18B20 - Temperatura interna
extern void setup_ds18b20();
extern void init_ds18b20(SensorConfig* config);
extern RisultatoValidazione read_temperature_ds18b20();
extern unsigned long get_intervallo_ds18b20();
extern bool is_abilitato_ds18b20();

// SHT21 - Temperatura e Umidita ambientale
extern void setup_sht21();
extern void init_humidity_sht21(SensorConfig* config);
extern void init_temperature_sht21(SensorConfig* config);
extern RisultatoValidazione read_humidity_sht21();
extern RisultatoValidazione read_temperature_sht21();
extern unsigned long get_intervallo_humidity_sht21();
extern unsigned long get_intervallo_temperature_sht21();
extern bool is_abilitato_humidity_sht21();
extern bool is_abilitato_temperature_sht21();

// HX711 - Peso
extern void setup_hx711();
extern void init_hx711(SensorConfig* config);
extern void calibrate_hx711(float calibration_factor, long offset);
extern RisultatoValidazione read_weight_hx711();
extern unsigned long get_intervallo_hx711();
extern bool is_abilitato_hx711();

// ============================================================================
// TIMING - Ultimo check per ogni sensore
// ============================================================================
unsigned long ultimoCheck_ds18b20 = 0;
unsigned long ultimoCheck_sht21_humidity = 0;
unsigned long ultimoCheck_sht21_temperature = 0;
unsigned long ultimoCheck_hx711 = 0;

// ============================================================================
// STATO SISTEMA
// ============================================================================
bool configCaricata = false;

// ============================================================================
// SIMULAZIONE CARICAMENTO CONFIG DA DATABASE
// TODO: Sostituire con chiamata REST reale a restdb.io
// ============================================================================
void caricaConfigDaDatabase() {
  Serial.println("\n--- CARICAMENTO CONFIGURAZIONE DA DATABASE ---\n");

  // TODO: Connessione Wi-Fi e chiamata REST
  // WiFi.begin(ssid, password);
  // HTTPClient http;
  // http.begin("https://xxx.restdb.io/rest/sensori");
  // ...

  // Config DS18B20 (temperatura interna arnia)
  SensorConfig config_ds18b20 = {
    .sogliaMin = 30.0f,
    .sogliaMax = 37.0f,
    .intervallo = 360000,  // 6 minuti
    .abilitato = true
  };
  init_ds18b20(&config_ds18b20);

  // Config SHT21 Umidita
  SensorConfig config_sht21_humidity = {
    .sogliaMin = 40.0f,
    .sogliaMax = 70.0f,
    .intervallo = 360000,  // 6 minuti
    .abilitato = true
  };
  init_humidity_sht21(&config_sht21_humidity);

  // Config SHT21 Temperatura (ambiente esterno)
  SensorConfig config_sht21_temp = {
    .sogliaMin = 10.0f,
    .sogliaMax = 45.0f,
    .intervallo = 360000,  // 6 minuti
    .abilitato = true
  };
  init_temperature_sht21(&config_sht21_temp);

  // Config HX711 (peso)
  SensorConfig config_hx711 = {
    .sogliaMin = 10.0f,
    .sogliaMax = 80.0f,
    .intervallo = 10800000,  // 3 ore
    .abilitato = true
  };
  init_hx711(&config_hx711);

  // Calibrazione peso (da DB o EEPROM)
  calibrate_hx711(2280.0f, 50000);

  configCaricata = true;
  Serial.println("\n--- CONFIGURAZIONE CARICATA ---\n");
}

// ============================================================================
// SETUP PRINCIPALE
// ============================================================================
void setup() {
  Serial.begin(115200);
  delay(2000);

  Serial.println("\n");
  Serial.println("========================================");
  Serial.println("  SISTEMA MONITORAGGIO ARNIA - PCTO");
  Serial.println("  Main Controller v2.0");
  Serial.println("  Architettura Modulare Sensori");
  Serial.println("========================================");
  Serial.println();

  // FASE 1: Inizializzazione hardware sensori
  Serial.println("FASE 1: INIZIALIZZAZIONE HARDWARE\n");
  setup_ds18b20();
  setup_sht21();
  setup_hx711();

  Serial.println("+ Tutti i sensori inizializzati\n");

  // FASE 2: Connessione DB e caricamento configurazione
  // TODO: Implementare connessione Wi-Fi reale
  Serial.println("FASE 2: CARICAMENTO CONFIGURAZIONE");
  caricaConfigDaDatabase();

  // Stampa intervalli configurati
  Serial.println("Intervalli di campionamento:");
  Serial.print("  - DS18B20 Temp:    "); Serial.print(get_intervallo_ds18b20() / 1000); Serial.println(" sec");
  Serial.print("  - SHT21 Humidity:  "); Serial.print(get_intervallo_humidity_sht21() / 1000); Serial.println(" sec");
  Serial.print("  - SHT21 Temp:      "); Serial.print(get_intervallo_temperature_sht21() / 1000); Serial.println(" sec");
  Serial.print("  - HX711 Peso:      "); Serial.print(get_intervallo_hx711() / 1000); Serial.println(" sec");
  Serial.println();

  Serial.println("========================================");
  Serial.println("  -> AVVIO MONITORAGGIO...");
  Serial.println("========================================\n");
}

// ============================================================================
// LOOP PRINCIPALE
// ============================================================================
void loop() {
  unsigned long tempoAttuale = millis();

  // ──────────────────────────────────────
  // DS18B20 - TEMPERATURA INTERNA
  // ──────────────────────────────────────
  if (is_abilitato_ds18b20() &&
      (tempoAttuale - ultimoCheck_ds18b20 >= get_intervallo_ds18b20())) {
    ultimoCheck_ds18b20 = tempoAttuale;

    Serial.println("\n[DS18B20] LETTURA TEMPERATURA INTERNA");
    RisultatoValidazione risultato = read_temperature_ds18b20();
    gestisciRisultatoValidazione(risultato);

    if (risultato.valido) {
      // TODO: Invia al database
      Serial.print("  -> Valore: "); Serial.print(risultato.valorePulito); Serial.println(" C");
    }
    Serial.println("---\n");
  }

  // ──────────────────────────────────────
  // SHT21 - UMIDITA
  // ──────────────────────────────────────
  if (is_abilitato_humidity_sht21() &&
      (tempoAttuale - ultimoCheck_sht21_humidity >= get_intervallo_humidity_sht21())) {
    ultimoCheck_sht21_humidity = tempoAttuale;

    Serial.println("\n[SHT21] LETTURA UMIDITA");
    RisultatoValidazione risultato = read_humidity_sht21();
    gestisciRisultatoValidazione(risultato);

    if (risultato.valido) {
      // TODO: Invia al database
      Serial.print("  -> Valore: "); Serial.print(risultato.valorePulito); Serial.println(" %");
    }
    Serial.println("---\n");
  }

  // ──────────────────────────────────────
  // SHT21 - TEMPERATURA AMBIENTE
  // ──────────────────────────────────────
  if (is_abilitato_temperature_sht21() &&
      (tempoAttuale - ultimoCheck_sht21_temperature >= get_intervallo_temperature_sht21())) {
    ultimoCheck_sht21_temperature = tempoAttuale;

    Serial.println("\n[SHT21] LETTURA TEMPERATURA AMBIENTE");
    RisultatoValidazione risultato = read_temperature_sht21();
    gestisciRisultatoValidazione(risultato);

    if (risultato.valido) {
      // TODO: Invia al database
      Serial.print("  -> Valore: "); Serial.print(risultato.valorePulito); Serial.println(" C");
    }
    Serial.println("---\n");
  }

  // ──────────────────────────────────────
  // HX711 - PESO
  // ──────────────────────────────────────
  if (is_abilitato_hx711() &&
      (tempoAttuale - ultimoCheck_hx711 >= get_intervallo_hx711())) {
    ultimoCheck_hx711 = tempoAttuale;

    Serial.println("\n[HX711] LETTURA PESO");
    RisultatoValidazione risultato = read_weight_hx711();
    gestisciRisultatoValidazione(risultato);

    if (risultato.valido) {
      // TODO: Invia al database
      Serial.print("  -> Valore: "); Serial.print(risultato.valorePulito); Serial.println(" kg");
    }
    Serial.println("---\n");
  }

  // Piccolo delay per evitare busy-wait
  delay(100);
}

// ============================================================================
// FUNZIONI UTILITY
// ============================================================================

void stampaStatisticheSistema() {
  Serial.println("\n--- STATISTICHE SISTEMA ---");
  Serial.print("Uptime: "); Serial.print(millis() / 1000); Serial.println(" sec");
  Serial.print("Free RAM: "); Serial.println(ESP.getFreeHeap());
  Serial.print("Config caricata: "); Serial.println(configCaricata ? "SI" : "NO");
  Serial.println();
}
