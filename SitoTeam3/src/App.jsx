import { createContext, useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import AppShell from "./components/layout/AppShell";
import SideMenuUser from "./components/menus/SideMenuUser";
import SideMenuAdmin from "./components/menus/SideMenuAdmin";

import Login from "./pages/user/Login";
import Home from "./pages/user/Home";
import Temperature from "./pages/user/Temperature";
import Humidity from "./pages/user/Humidity";
import Weight from "./pages/user/Weight";
import Notifications from "./pages/user/Notifications";
//import Map from "./pages/user/Map";

import AdminAccess from "./pages/admin/Access";
import AdminHome from "./pages/admin/Home";
import AdminAddHive from "./pages/admin/AddHive";
import AdminHive from "./pages/admin/Hive";
import AdminThreshold from "./pages/admin/Threshold";

import { api } from "./lib/restdb";

export const AppContext = createContext(null);

function RequireUser({ userAuthed, children }) {
  if (!userAuthed) return <Navigate to="/user/login" replace />;
  return children;
}

function RequireAdmin({ adminAuthed, children }) {
  if (!adminAuthed) return <Navigate to="/admin/access" replace />;
  return children;
}

function AppLayout({ children }) {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginPage = pathname === "/user/login" || pathname === "/admin/access";

  return (
    <AppContext.Consumer>
      {(ctx) => (
        <AppShell onMenu={() => ctx.setMenuOpen(true)} showMenuButton={!isLoginPage}>
          {!isLoginPage && (
            <>
              {isAdminRoute ? (
                <SideMenuAdmin open={ctx.menuOpen} onClose={() => ctx.setMenuOpen(false)} />
              ) : (
                <SideMenuUser open={ctx.menuOpen} onClose={() => ctx.setMenuOpen(false)} />
              )}
            </>
          )}

          {ctx.error ? (
            <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {ctx.error}
            </div>
          ) : null}

          {ctx.loading ? (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
              Caricamento...
            </div>
          ) : null}

          {children}
        </AppShell>
      )}
    </AppContext.Consumer>
  );
}

export default function App() {
  // ✅ STATI
  const [menuOpen, setMenuOpen] = useState(false);
  const [userAuthed, setUserAuthedState] = useState(false);
  const [adminAuthed, setAdminAuthedState] = useState(false);
  const [showValues, setShowValues] = useState(true);
  
  // ✅ STATO DATABASE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiari, setApiari] = useState([]);
  const [arnieRaw, setArnieRaw] = useState([]);
  const [tipi, setTipi] = useState([]);
  const [rilevazioni, setRilevazioni] = useState([]);
  const [sensoriArnia, setSensoriArnia] = useState([]);
  const [lastBySeaId, setLastBySeaId] = useState({});
  const [notifications, setNotifications] = useState([]);
  
  // ✅ SELEZIONE
  const [selectedHiveId, setSelectedHiveId] = useState(null);
  const [selectedApiarioId, setSelectedApiarioId] = useState(null);

  // ✅ Funzioni wrapper per localStorage
  const setUserAuthed = (value) => {
    setUserAuthedState(value);
    localStorage.setItem("userAuthed", value.toString());
  };

  const setAdminAuthed = (value) => {
    setAdminAuthedState(value);
    localStorage.setItem("adminAuthed", value.toString());
  };

  // ✅ HIVES con coordinate dal database
  const hives = useMemo(() => {
    const apiMap = new Map(apiari.map((a) => [Number(a.api_id), a]));
    
    return arnieRaw.map((a) => {
      const apiario = apiMap.get(Number(a.arn_api_id));
      const loc = apiario?.api_nome || apiario?.api_luogo || `Apiario ${a.arn_api_id}`;
      const lat = apiario?.api_lat ? parseFloat(apiario.api_lat) : 43.1107;
      const lng = apiario?.api_lon ? parseFloat(apiario.api_lon) : 12.3908;
      
      return {
        id: String(a.arn_id),
        name: `Arnia ${a.arn_id}`,
        location: loc,
        lat: lat,
        lng: lng,
        apiarioId: a.arn_api_id,
        apiarioNome: apiario?.api_nome || "Sconosciuto",
        _raw: a,
      };
    });
  }, [arnieRaw, apiari]);

const selectedHive = useMemo(() => {
  if (!selectedHiveId) return null;
  const hive = hives.find((h) => h.id === selectedHiveId);
  if (!hive) return null;

  // ✅ TROVA il tip_id per Peso dalla tabella tipirilevazione
  const getTipId = (want) => {
    const w = String(want).toLowerCase();
    const alt = w === "umidità" ? ["umidita"] : [];
    const found = tipi.find((t) => {
      const s = String(t.tip_tipologia).toLowerCase();
      return s === w || alt.includes(s);
    });
    return found?.tip_id ?? null;
  };

  const tipTemp = getTipId("temperatura");  // 12
  const tipHum = getTipId("umidità");       // 10
  const tipPeso = getTipId("peso");         // 11

  // ✅ TROVA i sea_id dei sensori per questa arnia
  const seaTemp = sensoriArnia.find(s => Number(s.sea_arn_id) === Number(selectedHiveId) && Number(s.sea_tip_id) === Number(tipTemp));
  const seaHum = sensoriArnia.find(s => Number(s.sea_arn_id) === Number(selectedHiveId) && Number(s.sea_tip_id) === Number(tipHum));
  const seaWeight = sensoriArnia.find(s => Number(s.sea_arn_id) === Number(selectedHiveId) && Number(s.sea_tip_id) === Number(tipPeso));

  // ✅ Temperatura
  const tempHistory = rilevazioni
    .filter((r) => {
      if (seaTemp) {
        return Number(r.ril_sea_id) === Number(seaTemp.sea_id);
      }
      return false;
    })
    .sort((a, b) => new Date(a.ril_dataOra || a._created) - new Date(b.ril_dataOra || b._created))
    .map((r) => ({
      timestamp: r.ril_dataOra || r._created,
      value: parseFloat(r.ril_dato || r.ril_valore) || 0,
    }));

  // ✅ Umidità
  const humHistory = rilevazioni
    .filter((r) => {
      if (seaHum) {
        return Number(r.ril_sea_id) === Number(seaHum.sea_id);
      }
      return false;
    })
    .sort((a, b) => new Date(a.ril_dataOra || a._created) - new Date(b.ril_dataOra || b._created))
    .map((r) => ({
      timestamp: r.ril_dataOra || r._created,
      value: parseFloat(r.ril_dato || r.ril_valore) || 0,
    }));

  // ✅ Peso
  const weightHistory = rilevazioni
    .filter((r) => {
      if (seaWeight) {
        return Number(r.ril_sea_id) === Number(seaWeight.sea_id);
      }
      return false;
    })
    .sort((a, b) => new Date(a.ril_dataOra || a._created) - new Date(b.ril_dataOra || b._created))
    .map((r) => ({
      timestamp: r.ril_dataOra || r._created,
      value: parseFloat(r.ril_dato || r.ril_valore) || 0,
    }));

  console.log("📊 Storici caricati per arnia", selectedHiveId, {
    seaTemp: seaTemp?.sea_id,
    seaHum: seaHum?.sea_id,
    seaWeight: seaWeight?.sea_id,
    tempHistory: tempHistory.length,
    humHistory: humHistory.length,
    weightHistory: weightHistory.length,
  });

  // ✅ FALLBACK: Se non ci sono dati storici, usa l'ultimo valore da lastBySeaId
  if (tempHistory.length === 0 && seaTemp) {
    const lastTemp = lastBySeaId[String(seaTemp.sea_id)];
    if (lastTemp && lastTemp.ril_dato) {
      tempHistory.push({
        timestamp: lastTemp.ril_dataOra || lastTemp._created || new Date().toISOString(),
        value: parseFloat(lastTemp.ril_dato) || 0,
      });
    }
  }

  if (humHistory.length === 0 && seaHum) {
    const lastHum = lastBySeaId[String(seaHum.sea_id)];
    if (lastHum && lastHum.ril_dato) {
      humHistory.push({
        timestamp: lastHum.ril_dataOra || lastHum._created || new Date().toISOString(),
        value: parseFloat(lastHum.ril_dato) || 0,
      });
    }
  }

  if (weightHistory.length === 0 && seaWeight) {
    const lastWeight = lastBySeaId[String(seaWeight.sea_id)];
    if (lastWeight && lastWeight.ril_dato) {
      weightHistory.push({
        timestamp: lastWeight.ril_dataOra || lastWeight._created || new Date().toISOString(),
        value: parseFloat(lastWeight.ril_dato) || 0,
      });
    }
  }

  console.log("✅ Storici FINALI con fallback:", {
    tempHistory: tempHistory.length,
    humHistory: humHistory.length,
    weightHistory: weightHistory.length,
  });

  return {
    ...hive,
    temperature: tempHistory.length > 0 ? tempHistory[tempHistory.length - 1].value : 0,
    humidity: humHistory.length > 0 ? humHistory[humHistory.length - 1].value : 0,
    weight: weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].value : 0,
    tempHistory,
    humHistory,
    weightHistory,
  };
}, [selectedHiveId, hives, rilevazioni, sensoriArnia, lastBySeaId, tipi]);

  // ✅ THRESHOLDS da DB
  const thresholds = useMemo(() => {
    const getTipId = (want) => {
      const w = String(want).toLowerCase();
      const alt = w === "umidità" ? ["umidita"] : [];
      const found = tipi.find((t) => {
        const s = String(t.tip_tipologia).toLowerCase();
        return s === w || alt.includes(s);
      });
      return found?.tip_id ?? null;
    };

    const tipTemp = getTipId("temperatura");
    const tipHum = getTipId("umidità");
    const tipPeso = getTipId("peso");

    const byTipId = new Map(sensoriArnia.map((s) => [Number(s.sea_tip_id), s]));
    const def = (min, max) => ({ min, max });

    const sTemp = tipTemp != null ? byTipId.get(Number(tipTemp)) : null;
    const sHum = tipHum != null ? byTipId.get(Number(tipHum)) : null;
    const sPeso = tipPeso != null ? byTipId.get(Number(tipPeso)) : null;

    return {
      temp: sTemp ? def(Number(sTemp.sea_min), Number(sTemp.sea_max)) : def(20, 40),
      hum: sHum ? def(Number(sHum.sea_min), Number(sHum.sea_max)) : def(40, 80),
      weight: sPeso ? def(Number(sPeso.sea_min), Number(sPeso.sea_max)) : def(5, 30),
    };
  }, [sensoriArnia, tipi]);

  // ✅ VALORI SENSORI da DB
  const sensorValues = useMemo(() => {
    const getTipId = (want) => {
      const w = String(want).toLowerCase();
      const alt = w === "umidità" ? ["umidita"] : [];
      const found = tipi.find((t) => {
        const s = String(t.tip_tipologia).toLowerCase();
        return s === w || alt.includes(s);
      });
      return found?.tip_id ?? null;
    };

    const tipTemp = getTipId("temperatura");
    const tipHum = getTipId("umidità");
    const tipPeso = getTipId("peso");

    const pick = (tipId) => {
      if (tipId == null) return null;
      const sea = sensoriArnia.find((s) => Number(s.sea_tip_id) === Number(tipId));
      if (!sea) return null;
      const last = lastBySeaId[String(sea.sea_id)];
      return last ? Number(last.ril_dato) : null;
    };

    return {
      temp: pick(tipTemp) ?? 0,
      hum: pick(tipHum) ?? 0,
      weight: pick(tipPeso) ?? 0,
    };
  }, [sensoriArnia, lastBySeaId, tipi]);

  // ✅ LOAD INIZIALE
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setError("");
        setLoading(true);

        const [apiariList, arnieList, tipiList] = await Promise.all([
          api.listApiari(),
          api.listArnie(),
          api.listTipiRilevazione(),
        ]);

        if (!alive) return;

        setApiari(Array.isArray(apiariList) ? apiariList : []);
        setArnieRaw(Array.isArray(arnieList) ? arnieList : []);
        setTipi(Array.isArray(tipiList) ? tipiList : []);

        const first = Array.isArray(arnieList) && arnieList.length ? String(arnieList[0].arn_id) : null;
        setSelectedHiveId(first);
      } catch (e) {
        if (!alive) return;
        setError(e.message || "Errore caricamento DB");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

// ✅ LOAD PER ARNIA SELEZIONATA
useEffect(() => {
  if (!selectedHiveId) return;
  let alive = true;

  (async () => {
    try {
      setError("");
      setLoading(true);

      const sens = await api.listSensoriArniaByArnia(selectedHiveId);
      if (!alive) return;

      const sensList = Array.isArray(sens) ? sens : [];
      setSensoriArnia(sensList);

      const seaIds = sensList.map((s) => Number(s.sea_id)).filter((n) => Number.isFinite(n));
      
      // ✅ CREA UNA MAPPA sea_id → arn_id
      const seaIdToArnId = new Map(sensList.map(s => [Number(s.sea_id), Number(s.sea_arn_id)]));
      
      if (seaIds.length === 0) {
        setLastBySeaId({});
        setRilevazioni([]);
        setNotifications([]);
        setLoading(false);
        return;
      }

      const ril = await api.listRilevazioniForSeaIds(seaIds);
      if (!alive) return;

      const rilList = Array.isArray(ril) ? ril : [];

      const map = {};
      for (const r of rilList) {
        const k = String(r.ril_sea_id);
        if (!map[k]) map[k] = r;
      }
      setLastBySeaId(map);

      // ✅ CARICA TUTTE LE RILEVAZIONI PER GLI STORICI
      console.log("🔄 Caricamento rilevazioni...");
      const allRil = await api.listRilevazioni(1000);
      console.log("📦 Rilevazioni ricevute:", allRil);
      console.log("📊 Numero rilevazioni:", allRil?.length || 0);

      if (!alive) return;

      // ✅ AGGIUNGI ril_arn_id VIRTUALMENTE usando sea_id
      const rilevazioniArray = (Array.isArray(allRil) ? allRil : []).map(r => {
        // Se ril_arn_id già esiste, usalo
        if (r.ril_arn_id) return r;
        
        // Altrimenti, ricavalo da ril_sea_id
        const arnId = seaIdToArnId.get(Number(r.ril_sea_id));
        return {
          ...r,
          ril_arn_id: arnId || null  // ✅ AGGIUNGI ril_arn_id
        };
      });
      
      setRilevazioni(rilevazioniArray);

      console.log("✅ Rilevazioni salvate nello stato:", rilevazioniArray.length);

      if (selectedHiveId) {
        const rilArnia = rilevazioniArray.filter(r => String(r.ril_arn_id) === selectedHiveId);
        console.log(`🐝 Rilevazioni per arnia ${selectedHiveId}:`, rilArnia.length);
        console.log("📋 Dettaglio rilevazioni arnia:", rilArnia);
      }

      // ✅ CARICA NOTIFICHE
      const nots = await api.listNotifiche(100);
      if (!alive) return;

      const notificationsFormatted = Array.isArray(nots) ? nots.map((n, index) => {
        return {
          id: n._id || index,
          date: n._created 
            ? new Date(n._created).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0],
          text: n.not_dex || n.not_titolo || 'Notifica',
          arniaId: n.not_arn_id || selectedHiveId,
          rawData: n,
        };
      }) : [];

      setNotifications(notificationsFormatted);

    } catch (e) {
      if (!alive) return;
      setError(e.message || "Errore caricamento dati arnia");
    } finally {
      if (!alive) return;
      setLoading(false);
    }
  })();

  return () => {
    alive = false;
  };
}, [selectedHiveId]);

  // ✅ AGGIUNGI ARNIA
  const addHive = async ({ id, apiarioId }) => {
    const arn_id = Number(id);
    const api_id = Number(apiarioId);

    if (!Number.isFinite(arn_id) || arn_id <= 0) {
      throw new Error("ID arnia non valido (deve essere un numero positivo)");
    }

    if (!Number.isFinite(api_id) || api_id <= 0) {
      throw new Error("ID apiario non valido");
    }

    const apiarioEsiste = apiari.find((a) => Number(a.api_id) === api_id);
    if (!apiarioEsiste) {
      throw new Error(`Apiario ${api_id} non trovato`);
    }

    const arniaEsiste = arnieRaw.find((a) => Number(a.arn_id) === arn_id);
    if (arniaEsiste) {
      throw new Error(`Arnia ${arn_id} esiste già!`);
    }

    const payload = {
      arn_id: arn_id,
      arn_api_id: api_id,
      arn_dataInst: new Date().toISOString().slice(0, 10),
      arn_piena: false,
      arn_MacAddres: "00:00:00:00:00:00",
    };

    await api.createArnia(payload);

    const arnieList = await api.listArnie();
    setArnieRaw(Array.isArray(arnieList) ? arnieList : []);
    setSelectedHiveId(String(arn_id));
  };

  // ✅ SALVA SOGLIE
  const saveThresholds = async (tipo, { min, max }) => {
    const getTipId = (want) => {
      const w = String(want).toLowerCase();
      const alt = w === "umidità" ? ["umidita"] : [];
      const found = tipi.find((t) => {
        const s = String(t.tip_tipologia).toLowerCase();
        return s === w || alt.includes(s);
      });
      return found?.tip_id ?? null;
    };

    const tipWanted = tipo === "temp" ? "temperatura" : tipo === "hum" ? "umidità" : "peso";
    const tipId = getTipId(tipWanted);
    if (tipId == null) throw new Error("tipirilevazione non trovato per " + tipo);

    const sea = sensoriArnia.find((s) => Number(s.sea_tip_id) === Number(tipId));
    if (!sea) throw new Error("sensoriarnia non trovato");
    if (!sea._id) throw new Error("Record RestDB _id mancante");

    await api.patchSensoreArnia(sea._id, { sea_min: Number(min), sea_max: Number(max) });

    setSensoriArnia((prev) =>
      prev.map((x) => (x._id === sea._id ? { ...x, sea_min: Number(min), sea_max: Number(max) } : x))
    );
  };

  const ctxValue = useMemo(
  () => ({
    menuOpen,
    setMenuOpen,
    userAuthed,
    setUserAuthed,
    adminAuthed,
    setAdminAuthed,
    showValues,
    setShowValues,
    hives,
    selectedHiveId: selectedHiveId ?? (hives[0]?.id ?? ""),
    setSelectedHiveId,
    selectedHive,
    apiari,
    selectedApiarioId,
    setSelectedApiarioId,
    thresholds,
    saveThresholds,
    sensorValues,  // ✅ DEVE ESSERCI QUESTA RIGA
    notifications,
    addHive,
    loading,
    error,
  }),
);
  return (
    <AppContext.Provider value={ctxValue}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/user/login" replace />} />
          <Route path="/user/login" element={<Login />} />
          <Route path="/user/home" element={<RequireUser userAuthed={userAuthed}><Home /></RequireUser>} />
          {/* <Route path="/user/map" element={<RequireUser userAuthed={userAuthed}><Map /></RequireUser>} /> */}
          <Route path="/user/temp" element={<RequireUser userAuthed={userAuthed}><Temperature /></RequireUser>} />
          <Route path="/user/hum" element={<RequireUser userAuthed={userAuthed}><Humidity /></RequireUser>} />
          <Route path="/user/weight" element={<RequireUser userAuthed={userAuthed}><Weight /></RequireUser>} />
          <Route path="/user/notif" element={<RequireUser userAuthed={userAuthed}><Notifications /></RequireUser>} />
          <Route path="/admin/access" element={<AdminAccess />} />
          <Route path="/admin/home" element={<RequireAdmin adminAuthed={adminAuthed}><AdminHome /></RequireAdmin>} />
          <Route path="/admin/addHive" element={<RequireAdmin adminAuthed={adminAuthed}><AdminAddHive /></RequireAdmin>} />
          <Route path="/admin/hive" element={<RequireAdmin adminAuthed={adminAuthed}><AdminHive /></RequireAdmin>} />
          <Route path="/admin/th-temp" element={<RequireAdmin adminAuthed={adminAuthed}><AdminThreshold tipo="temp" titolo="Soglie Temperatura" unita="°C" /></RequireAdmin>} />
          <Route path="/admin/th-hum" element={<RequireAdmin adminAuthed={adminAuthed}><AdminThreshold tipo="hum" titolo="Soglie Umidità" unita="%" /></RequireAdmin>} />
          <Route path="/admin/th-weight" element={<RequireAdmin adminAuthed={adminAuthed}><AdminThreshold tipo="weight" titolo="Soglie Peso" unita="KG" /></RequireAdmin>} />
          <Route path="*" element={<Navigate to="/user/login" replace />} />
        </Routes>
      </AppLayout>
    </AppContext.Provider>
  );
}