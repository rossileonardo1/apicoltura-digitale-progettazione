# Protocollo di Installazione Hardware: Arnia Digitale

Il sistema prevede l'integrazione di sensori di precisione per il monitoraggio ponderale e termo-igrometrico all'interno di una struttura standard.

## 1. Schema di Cablaggio e Pinout (ESP32-CAM)

Per l'interfacciamento dei sensori viene utilizzato il microcontrollore **ESP32-CAM**. Poiché i GPIO sono condivisi con il lettore SD, la programmazione prevede l'uso esclusivo dei pin per i sensori, senza l'inserimento di schede di memoria.

| Componente | Pin Sensore | Pin ESP32-CAM | Note Tecniche |
| :--- | :--- | :--- | :--- |
| **Alimentazione** | VCC / GND | 5V / GND | Ingresso da regolatore stabilizzato |
| **SHT21 (Ambiente)** | SDA | GPIO 14 | Bus I2C (Dati) |
| **SHT21 (Ambiente)** | SCL | GPIO 15 | Bus I2C (Clock) |
| **DS18B20 (Sonda)** | DATI | GPIO 13 | Resistenza 4.7kΩ tra DATI e 3.3V |
| **HX711 (Bilancia)** | DT | GPIO 12 | Canale dati amplificatore peso |
| **HX711 (Bilancia)** | SCK | GPIO 2 | Canale clock amplificatore peso |

---

## 2. Installazione della Cella di Carico (Sistema Peso)

Il monitoraggio del peso avviene tramite una cella di carico montata a "sandwich" tra due basi rigide.

* **Posizionamento:** La cella è interposta tra due piani in legno multistrato fenolico (minimo 20mm) o piastre metalliche.
* **Fissaggio:** L'ancoraggio avviene tramite bulloni in acciaio **INOX**. È mandatorio inserire rondelle di spessore tra la cella e i piani per garantire un "gap" di 2-3mm, permettendo la deformazione elastica necessaria alla misurazione.
* **Protezione:** Il modulo **HX711** viene collocato in una custodia stagna adiacente alla cella. Viene utilizzato cavo quadripolare schermato per minimizzare i disturbi elettromagnetici.

---

## 3. Installazione dei Sensori Interni

### Sensore Termo-igrometrico (SHT21)
* **Ubicazione:** Parte superiore dell'arnia, fissato alla faccia inferiore del coprifavo.
* **Protezione Meccanica:** Il modulo deve essere racchiuso in una gabbia di rete metallica con maglia inferiore a **0.5mm**. Tale accorgimento impedisce alle api la deposizione di propoli sulla membrana sensibile, preservando la capacità di lettura dell'umidità.

### Sonda di Temperatura (DS18B20)
* **Ubicazione:** Inserimento tra i telaini centrali del nido.
* **Installazione:** Il cavo della sonda attraversa il coprifavo mediante un foro da **6mm**, successivamente sigillato con silicone atossico. La punta in acciaio deve trovarsi in corrispondenza del glomere (core dell'alveare).

---

## 4. Alloggiamento Elettronica e Cablaggi

* **Contenitori:** L'ESP32-CAM e i moduli di regolazione sono ospitati in custodie con grado di protezione **IP67** fissate esternamente.
* **Gestione Cavi:** Tutti i passaggi di cavi tra l'interno e l'esterno dell'arnia sono gestiti tramite pressacavi stagni o fori sigillati. I cavi interni sono fissati alle pareti con fascette in plastica per non interferire con le operazioni dell'apicoltore.
* **Trattamento Anti-Corrosione:** Data la presenza di vapori organici (acido ossalico/formico), è prescritta l'applicazione di vernice protettiva isolante su tutti i contatti elettrici e le saldature esposte.

---

## 5. Specifiche dei Componenti Meccanici

* **Viteria:** Esclusivamente acciaio **INOX 304 o 316**.
* **Sigillanti:** Silicone acetico atossico o mastice per uso alimentare.
* **Cavi:** Tipologia schermata per il segnale della bilancia; cavi twistati per il bus I2C (SHT21) se la lunghezza supera i 50cm.

---

## Note Tecniche Obbligatorie per il Cablaggio

### 1. Resistenze di Pull-up
* **Sensore DS18B20:** È necessario inserire una resistenza da $4.7k \Omega$ tra il pin DATI (GPIO 13) e il pin 3.3V. Senza questa resistenza, il bus 1-Wire non trasmetterà i dati correttamente.
* **Sensore SHT21:** In caso di componenti nudi (senza breakout board), inserire due resistenze da $4.7k \Omega$ tra SDA/SCL e il 3.3V.

### 2. Alimentazione Differenziata
* L'ESP32-CAM deve ricevere **5V stabili** sul pin dedicato (VCC/5V) tramite lo Step-Down collegato alle batterie a 12V.
* L'HX711 può essere alimentato a 5V per maggiore precisione, ma i segnali logici (DT/SCK) devono essere compatibili con i 3.3V dell'ESP32. In caso di dubbi, alimentarlo a 3.3V.

### 3. Gestione GPIO Critici
* **GPIO 2:** Collegato al LED interno, influisce sul boot mode. Assicurarsi che l'HX711 non forzi questo pin a livello basso durante l'avvio.
* **GPIO 12:** Durante il boot, questo pin non deve essere "High" (alto).

---

## Schema del Circuito di Alimentazione (Hardware Team)

* **Ingresso:** Batteria 12V (Caricata dal pannello solare).
* **Conversione:** Convertitore DC-DC Step-Down tarato a **5.1V**.
* **Distribuzione:**
    * **5V** diretti al pin 5V dell'ESP32 e al VCC dell'HX711.
    * **GND comune** a tutti i componenti.
    * **3.3V** prelevati dal pin di uscita dell'ESP32 per alimentare SHT21 e DS18B20.

---

## Tabella Acquisti Hardware - Arnia Digitale

| Elemento da comprare | Modello Specifico / Note Tecniche | Quantità | Costo Unit. (stima) | Costo Tot. (stima) | Link d'acquisto (Esempio) |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Convertitore Step-Down** | MP1584EN (Mini DC-DC 12V to 5V) | 2 pz | € 2,50 | € 5,00 | [Amazon](https://www.amazon.it/s?k=MP1584EN) |
| **Resistenze Pull-up** | Set Resistenze 4.7k Ohm 1/4W | 1 kit | € 6,00 | € 6,00 | [Amazon](https://www.amazon.it/s?k=resistenze+4.7k+ohm) |
| **PCB Millefori** | Piastra Prototipazione 5x7 cm | 3 pz | € 2,00 | € 6,00 | [Amazon](https://www.amazon.it/s?k=pcb+millefori) |
| **Condensatore** | Elettrolitico 100uF 25V | 5 pz | € 0,50 | € 2,50 | [Amazon](https://www.amazon.it/s?k=condensatore+100uf+25v) |
| **Bulloni Bilancia** | Bulloni INOX M6x30mm con dadi/rondelle | 1 set (4) | € 5,00 | € 5,00 | [Amazon](https://www.amazon.it/s?k=bulloni+m6+inox) |
| **Viti Scatole/Supporti** | Viti Legno INOX 3.5x16mm | 1 conf. | € 8,00 | € 8,00 | [Amazon](https://www.amazon.it/s?k=viti+legno+inox+3.5x16) |
| **Piani Bilancia** | Multistrato Fenolico (20mm spessore) | 2 tagli | € 15,00 | € 30,00 | [Brico / Legnameria] |
| **Fascette** | Fascette Nylon Nere resistenti UV | 1 conf. | € 5,00 | € 5,00 | [Amazon](https://www.amazon.it/s?k=fascette+nere+uv) |
| **Silicone** | Silicone Acetico Atossico Trasparente | 1 tubo | € 7,00 | € 7,00 | [Amazon](https://www.amazon.it/s?k=silicone+atossico) |
| **Vernice Protettiva** | Spray Conformal Coating (Isolante PCB) | 1 flacone| € 12,00 | € 12,00 | [Amazon](https://www.amazon.it/s?k=conformal+coating+spray) |
| **Rete Protezione** | Retina Acciaio Inox maglia <0.5mm | 1 mq/fgl | € 10,00 | € 10,00 | [Amazon](https://www.amazon.it/s?k=rete+acciaio+inox+maglia+fine) |
| **Cavo Schermato** | Cavo 4 poli schermato (tipo allarme) | 5 metri | € 1,20/m | € 6,00 | [Amazon](https://www.amazon.it/s?k=cavo+4+poli+schermato) |
| **Cavo Alimentazione** | Cavo Bipolare Rosso/Nero 1.5mmq | 5 metri | € 1,00/m | € 5,00 | [Amazon](https://www.amazon.it/s?k=cavo+bipolare+rosso+nero) |
| **Guaina Termo** | Kit Guaine Termorestringenti vari diametri | 1 conf. | € 9,00 | € 9,00 | [Amazon](https://www.amazon.it/s?k=guaina+termorestringente) |
| **Pressacavi Stagni** | Pressacavi IP68 PG7 | 5 pz | € 1,50 | € 7,50 | [Amazon](https://www.amazon.it/s?k=pressacavi+pg7) |
| **TOTALE STIMATO** | | | | **€ 124,00** | |

---

## Cablaggio e Lunghezze Stimate

| Collegamento | Tipo di Cavo | Lunghezza Stimata |
| :--- | :--- | :--- |
| Cella di carico → HX711 | Quadripolare schermato | 0.5 - 1 metro |
| SHT21 → ESP32 | Quadripolare (o twistato) | 1.5 - 2 metri |
| DS18B20 → ESP32 | Tripolare (integrato) | 1 metro |
| Batteria/Pannello → Centralina | Bipolare (1.5mmq) | 2 - 3 metri |
| Ponteggi interni | Jumper o filo rigido | 30 cm |

**Riepilogo cavi da acquistare:**
* Cavo schermato 4 poli: **5 metri**.
* Cavo elettrico bipolare (rosso/nero): **5 metri**.
* Guaina termorestringente: **1 metro**.
