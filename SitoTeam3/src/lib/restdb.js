const BASE_URL = import.meta.env.VITE_RESTDB_URL;
const API_KEY = import.meta.env.VITE_RESTDB_APIKEY;

function must(v, name) {
  if (!v) throw new Error(`Manca ${name} nel file .env`);
  return v;
}

export async function restdb(path, { method = "GET", body, query } = {}) {
  must(BASE_URL, "VITE_RESTDB_URL");
  must(API_KEY, "VITE_RESTDB_APIKEY");

  const url = new URL(`${BASE_URL}${path}`);

  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, typeof v === "string" ? v : JSON.stringify(v));
    }
  }

  const res = await fetch(url.toString(), {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-apikey": API_KEY,
      "cache-control": "no-cache",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) throw new Error(`RESTDB ${method} ${path} -> ${res.status}: ${text}`);
  return data;
}

export const api = {
  // ====== Letture base ======
  listApiari() {
    return restdb("/apiari", { query: { max: 200 } });
  },
  
  listArnie() {
    return restdb("/arnie", { query: { max: 200 } });
  },
  
  listTipiRilevazione() {
    return restdb("/tipirilevazione", { query: { max: 200 } });
  },

  // ====== Dati per arnia selezionata ======
  listSensoriArniaByArnia(arn_id) {
    return restdb("/sensoriarnia", {
      query: { q: { sea_arn_id: Number(arn_id) }, max: 200 },
    });
  },

  // ✅ CORRETTO - Rilevazioni per sensori specifici
  listRilevazioniForSeaIds(seaIds) {
    return restdb("/rilevazioni", {
      query: { 
        q: { ril_sea_id: { $in: seaIds } }, 
        max: 1000, 
        h: { $orderby: { _created: -1 } } 
      },
    });
  },

  // ✅ NUOVO - Tutte le rilevazioni (per gli storici)
  listRilevazioni(limit = 1000) {
    return restdb("/rilevazioni", {
      query: { 
        max: limit, 
        h: { $orderby: { _created: -1 } } 
      },
    });
  },

  // ====== Notifiche ======
  listNotifiche(max = 100) {
    return restdb("/notifiche", {
      query: { max, h: { $orderby: { _created: -1 } } },
    });
  },

  // ====== Scritture ======
  patchSensoreArnia(restdb_id, payload) {
    return restdb(`/sensoriarnia/${restdb_id}`, { method: "PATCH", body: payload });
  },

  createArnia(payload) {
    return restdb("/arnie", { method: "POST", body: payload });
  },
};