# 1) Errori/Alert COMUNI (cross‑sensor)

##Integrità del dato / validazione base (INPUT VALIDATION)
- **Dato nullo / mancante**
- **Dato numericamente non valido (NaN / infinito / formato errato)**
- **Dato negativo non ammesso (quando il dominio non lo consente)**
**Categoria suggerita unica:** `ERR_DATA_NULL`, `ERR_DATA_INVALID_NUMBER`, `ERR_DATA_NEGATIVE_NOT_ALLOWED`

---

##Range fisico/operativo del sensore (OUT OF RANGE “hard”)
- **Quando la misura è fuori dai limiti “plausibili” o supportati**
**Categoria unica:** `ERR_MEASURE_OUT_OF_RANGE`

---

##Sensore/Hardware non disponibile (SENSOR OFFLINE / NOT DETECTED)
- **Il dato non è affidabile perché il sensore non risponde o non è rilevabile**
**Categoria unica:** `ERR_SENSOR_NOT_READY`, `ERR_SENSOR_TIMEOUT`, `ERR_SENSOR_OFFLINE`

---

##Connettività e invio a Cloud/DB (NETWORK / DELIVERY)
- **Quando la misura è valida ma non può essere inviata**
**Categoria unica:** `ERR_NETWORK_OFFLINE`, `ERR_UPLOAD_FAILED`, `ERR_UPLOAD_RETRY_EXHAUSTED`

---

# 2) Errori/Alert SPECIFICI (da lasciare “individuali”)

## Sensore di Peso (PS) — specifici del dominio “ADC + taratura”
Questi sono davvero particolari del sensore di peso con ADC e calibrazione:

- **ERR-PS-2.03 Saturazione ADC**  
  (tipico di ADC/load cell: stuck a 0 o full-scale)
- **ERR-PS-2.06 Taratura non presente**
- **ERR-PS-2.07 Taratura non valida**
- (in parte anche **ERR-PS-2.08** è comune come “NaN”, ma la causa “conversione kg con taratura” è tipica del peso)

## Sensore Umidità — specifici del sensore (così come lo hai descritto)
- **3.5 “Il dato deve essere gestito con una variabile float”**  
  È più un vincolo implementativo/di interfaccia software (non fisico), ma nel tuo elenco è specifico dell’umidità.

## Temperatura — specifici del “processo”
Nel tuo elenco temperatura è soprattutto un **workflow** (acquisizione → storage → sync → soglie). Non hai errori “fisici” specifici tipo “conversione NTC fallita” o “CRC fail”. Quindi, come “specifico”, resta più che altro:
- La presenza di un **intervallo di campionamento fisso di 6 minuti (1.12)** come requisito di processo (non errore/alert, ma specificità del ciclo).

---

# 3) Output finale “pulito” (pronto da usare come catalogo comune)

## Catalogo comune (riusabile per tutti i sensori)
1. **Dato mancante/nullo**  
2. **Dato non valido (NaN/Inf/formato errato)**  
3. **Dato negativo non ammesso (se applicabile)**  
4. **Misura fuori range (plausibilità / limiti sensore)**  
5. **Sensore non rilevato / offline / non pronto**  
6. **Timeout acquisizione / lettura fallita**  
7. **Misura instabile / rumore / outlier / warm-up post wake**  
8. **Timestamp mancante / non valido**  
9. **Connettività assente / DB non raggiungibile**  
10. **Invio fallito + retry/store-and-forward**  
11. **Duplicazione misura (idempotenza)**  
12. **Alert soglia alta / soglia bassa**

## Specifici PS (solo peso)
- Saturazione ADC
- Taratura non presente
- Taratura non valida
- Conversione kg fallita per taratura

## Specifici Umidità (come da elenco)
- Vincolo “deve essere float” (se vuoi tenerlo come errore separato)

## Specifici Temperatura (come da elenco)
- Intervallo di campionamento 6 minuti (requisito di processo)

---

Se vuoi, nel prossimo messaggio posso:
- proporti una **tabella di mapping** (Temperatura/Umidità/Peso → Categoria comune → codice unificato),
- oppure uno **schema di enum unico** (es. `ERR_COMMON_xx`, `ALERT_COMMON_xx`, `ERR_PS_xx`), così riduci davvero spazio e duplicazione nel firmware.


┌──────┬─────────────────────────────────────┬──────────────────────────────────────┐
│  ID  │ CODICE                              │ DESCRIZIONE                          │
├──────┼─────────────────────────────────────┼──────────────────────────────────────┤
│ 9000 │ STATUS_OK                           │ Nessun errore                        │
│ 9001 │ STATUS_OK_WITH_WARNING              │ OK con warning                       │
├──────┼─────────────────────────────────────┼──────────────────────────────────────┤
│ 1001 │ ERR_DATA_NULL                       │ Dato nullo/mancante                  │
│ 1002 │ ERR_DATA_INVALID_NUMBER             │ NaN/Infinito                         │
│ 1003 │ ERR_DATA_NEGATIVE_NOT_ALLOWED       │ Negativo non ammesso                 │
│ 1004 │ ERR_DATA_FORMAT_INVALID             │ Formato errato                       │
│ 1101 │ ERR_MEASURE_OUT_OF_RANGE            │ Fuori range                          │
│ 1102 │ ERR_MEASURE_BELOW_MIN               │ Sotto minimo                         │
│ 1103 │ ERR_MEASURE_ABOVE_MAX               │ Sopra massimo                        │
│ 1201 │ ERR_SENSOR_NOT_READY                │ Sensore non pronto                   │
│ 1202 │ ERR_SENSOR_TIMEOUT                  │ Timeout sensore                      │
│ 1203 │ ERR_SENSOR_OFFLINE                  │ Sensore offline                      │
│ 1204 │ ERR_SENSOR_DISCONNECTED             │ Sensore scollegato                   │
│ 1301 │ ERR_MEASURE_UNSTABLE                │ Misura instabile                     │
│ 1302 │ ERR_MEASURE_NOISE                   │ Rumore eccessivo                     │
│ 1303 │ ERR_MEASURE_OUTLIER                 │ Outlier                              │
│ 1304 │ ERR_SENSOR_WARMUP                   │ Warm-up                              │
│ 1401 │ ERR_TIMESTAMP_INVALID               │ Timestamp non valido                 │
│ 1402 │ ERR_TIMESTAMP_FUTURE                │ Timestamp futuro                     │
│ 1403 │ ERR_TIMESTAMP_DUPLICATE             │ Timestamp duplicato                  │
│ 1501 │ ERR_NETWORK_OFFLINE                 │ Rete offline                         │
│ 1502 │ ERR_NETWORK_TIMEOUT                 │ Timeout rete                         │
│ 1503 │ ERR_DB_UNREACHABLE                  │ DB non raggiungibile                 │
│ 1504 │ ERR_UPLOAD_FAILED                   │ Upload fallito                       │
│ 1505 │ ERR_UPLOAD_RETRY_EXHAUSTED          │ Retry esauriti                       │
│ 1506 │ ERR_UPLOAD_DUPLICATE                │ Misura duplicata                     │
├──────┼─────────────────────────────────────┼──────────────────────────────────────┤
│ 2001 │ ALERT_THRESHOLD_LOW                 │ Sotto soglia                         │
│ 2002 │ ALERT_THRESHOLD_HIGH                │ Sopra soglia                         │
│ 2003 │ ALERT_THRESHOLD_CRITICAL_LOW        │ Critico basso                        │
│ 2004 │ ALERT_THRESHOLD_CRITICAL_HIGH       │ Critico alto                         │
│ 2101 │ ALERT_DATA_QUALITY_LOW              │ Qualità bassa                        │
│ 2102 │ ALERT_OUTLIER_DETECTED              │ Outlier                              │
│ 2103 │ ALERT_DRIFT_DETECTED                │ Deriva                               │
├──────┼─────────────────────────────────────┼──────────────────────────────────────┤
│ 3001 │ ERR_PS_ADC_SATURATION_LOW           │ ADC saturo basso                     │
│ 3002 │ ERR_PS_ADC_SATURATION_HIGH          │ ADC saturo alto                      │
│ 3003 │ ERR_PS_ADC_SATURATION               │ ADC saturo                           │
│ 3004 │ ERR_PS_ADC_READ_FAILED              │ Lettura ADC fallita                  │
│ 3101 │ ERR_PS_CALIBRATION_MISSING          │ Calibrazione mancante                │
│ 3102 │ ERR_PS_CALIBRATION_INVALID          │ Calibrazione non valida              │
│ 3103 │ ERR_PS_CALIBRATION_EXPIRED          │ Calibrazione scaduta                 │
│ 3104 │ ERR_PS_TARE_FAILED                  │ Tara fallita                         │
│ 3201 │ ERR_PS_CONVERSION_FAILED            │ Conversione kg fallita               │
│ 3202 │ ERR_PS_CONVERSION_OVERFLOW          │ Overflow                             │
│ 3203 │ ERR_PS_CONVERSION_UNDERFLOW         │ Underflow                            │
│ 3301 │ ERR_PS_LOADCELL_FAULT               │ Guasto load cell                     │
│ 3302 │ ERR_PS_LOADCELL_OVERLOAD            │ Sovraccarico                         │
├──────┼─────────────────────────────────────┼──────────────────────────────────────┤
│ 4001 │ ERR_HUM_SENSOR_FAULT                │ Errore hardware                      │
│ 4002 │ ERR_HUM_I2C_COMM_FAILED             │ I2C fallito                          │
│ 4003 │ ERR_HUM_CHECKSUM_ERROR              │ Checksum errato                      │
│ 4101 │ ERR_HUM_NOT_FLOAT                   │ Non float                            │
│ 4102 │ ERR_HUM_PRECISION_LOSS              │ Perdita precisione                   │
│ 4201 │ ALERT_HUM_CONDENSATION_RISK         │ Rischio condensa                     │
│ 4202 │ ALERT_HUM_TOO_DRY                   │ Troppo secca                         │
├──────┼─────────────────────────────────────┼──────────────────────────────────────┤
│ 5001 │ ERR_TEMP_SENSOR_DISCONNECTED        │ DS18B20 disconnesso                  │
│ 5002 │ ERR_TEMP_CRC_ERROR                  │ Errore CRC                           │
│ 5003 │ ERR_TEMP_ONEWIRE_FAILED             │ OneWire fallito                      │
│ 5101 │ ERR_TEMP_SAMPLING_INTERVAL          │ Intervallo non rispettato            │
│ 5102 │ ERR_TEMP_CONVERSION_TIMEOUT         │ Timeout conversione                  │
│ 5103 │ ERR_TEMP_RESOLUTION_ERROR           │ Errore risoluzione                   │
│ 5201 │ ERR_TEMP_STORAGE_FULL               │ Storage pieno                        │
│ 5202 │ ERR_TEMP_SYNC_FAILED                │ Sync fallita                         │
│ 5301 │ ALERT_TEMP_FREEZE_RISK              │ Rischio congelamento                 │
│ 5302 │ ALERT_TEMP_OVERHEAT                 │ Surriscaldamento                     │
└──────┴─────────────────────────────────────┴──────────────────────────────────────┘
