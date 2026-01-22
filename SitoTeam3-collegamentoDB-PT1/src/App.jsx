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

  return (
    <AppContext.Consumer>
      {(ctx) => (
        <AppShell
          title={isAdminRoute ? "AREA ADMIN" : ctx.selectedHive?.name ?? "Beehives"}
          subtitle={isAdminRoute ? "Gestione arnie e soglie" : ctx.selectedHive?.location ?? ""}
          onMenu={() => ctx.setMenuOpen(true)}
          onProfile={() => {}}
        >
          {isAdminRoute ? (
            <SideMenuAdmin open={ctx.menuOpen} onClose={() => ctx.setMenuOpen(false)} />
          ) : (
            <SideMenuUser open={ctx.menuOpen} onClose={() => ctx.setMenuOpen(false)} />
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
  const [menuOpen, setMenuOpen] = useState(false);

  // auth
  const [userAuthed, setUserAuthed] = useState(false);
  const [adminAuthed, setAdminAuthed] = useState(false);

  // UI
  const [showValues, setShowValues] = useState(true);

  // stato fetch
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // DB raw
  const [apiari, setApiari] = useState([]);
  const [arnieRaw, setArnieRaw] = useState([]);
  const [tipi, setTipi] = useState([]);

  // selezione arnia (arn_id)
  const [selectedHiveId, setSelectedHiveId] = useState(null);

  // sensori per quella arnia
  const [sensoriArnia, setSensoriArnia] = useState([]);

  // ultime rilevazioni per sea_id
  const [lastBySeaId, setLastBySeaId] = useState({});

  // notifiche
  const [notifications, setNotifications] = useState([]);

  // ======== UI hives ========
  const hives = useMemo(() => {
    const apiMap = new Map(apiari.map((a) => [Number(a.api_id), a]));
    return arnieRaw.map((a) => {
      const apiario = apiMap.get(Number(a.arn_api_id));
      const loc = apiario?.api_nome || apiario?.api_luogo || `Apiario ${a.arn_api_id}`;
      return {
        id: String(a.arn_id),
        name: `Arnia ${a.arn_id}`,
        location: loc,
        _raw: a,
      };
    });
  }, [arnieRaw, apiari]);

  const selectedHive = useMemo(() => {
    if (!selectedHiveId) return hives[0];
    return hives.find((h) => h.id === String(selectedHiveId)) ?? hives[0];
  }, [hives, selectedHiveId]);

  // helper per trovare tip_id
  const getTipId = (want) => {
    const w = String(want).toLowerCase();
    const alt = w === "umidità" ? ["umidita"] : [];
    const found = tipi.find((t) => {
      const s = String(t.tip_tipologia).toLowerCase();
      return s === w || alt.includes(s);
    });
    return found?.tip_id ?? null;
  };

  // ======== thresholds da DB sensoriarnia ========
  const thresholds = useMemo(() => {
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

  // ======== valori attuali da DB rilevazioni ========
  const sensorValues = useMemo(() => {
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

  // ======== load iniziale (3 chiamate) ========
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

  // ======== load per arnia selezionata (2-3 chiamate) ========
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
        if (seaIds.length === 0) {
          setLastBySeaId({});
          return;
        }

        const ril = await api.listRilevazioniForSeaIds(seaIds);
        if (!alive) return;

        const rilList = Array.isArray(ril) ? ril : [];

        // prima per sea_id (già in ordine DESC)
        const map = {};
        for (const r of rilList) {
          const k = String(r.ril_sea_id);
          if (!map[k]) map[k] = r;
        }
        setLastBySeaId(map);

        const nots = await api.listNotifiche(100);
        if (!alive) return;
        setNotifications(Array.isArray(nots) ? nots : []);
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

  // ======== WRITE: aggiungi arnia (Admin) ========
  const addHive = async ({ id, location }) => {
    const arn_id = Number(id);
    if (!Number.isFinite(arn_id)) throw new Error("ID arnia non valido (deve essere numero)");

    // non sprechiamo fetch: prendiamo il primo apiario come default
    const defaultApiId = apiari?.[0]?.api_id ?? 0;

    const payload = {
      arn_id,
      arn_api_id: Number(defaultApiId),
      arn_dataInst: new Date().toISOString().slice(0, 10),
      arn_piena: false,
      arn_MacAddres: "00:00:00:00:00:00",
      // NOTE: "location" non esiste nel tuo schema arnie: lo ignoriamo (poi faremo scelta apiario vera)
    };

    await api.createArnia(payload);

    // ricarico arnie (1 chiamata)
    const arnieList = await api.listArnie();
    setArnieRaw(Array.isArray(arnieList) ? arnieList : []);
    setSelectedHiveId(String(arn_id));
  };

  // ======== WRITE: salva soglie (AdminThreshold) ========
  const saveThresholds = async (tipo, { min, max }) => {
    const tipWanted =
      tipo === "temp" ? "temperatura" : tipo === "hum" ? "umidità" : "peso";

    const tipId = getTipId(tipWanted);
    if (tipId == null) throw new Error("tipirilevazione non trovato per " + tipo);

    const sea = sensoriArnia.find((s) => Number(s.sea_tip_id) === Number(tipId));
    if (!sea) throw new Error("sensoriarnia non trovato (manca record per questa arnia)");

    if (!sea._id) throw new Error("Record RestDB _id mancante su sensoriarnia");

    await api.patchSensoreArnia(sea._id, { sea_min: Number(min), sea_max: Number(max) });

    // aggiorno local senza fetch extra
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

      thresholds,
      saveThresholds,

      sensorValues,
      notifications,

      addHive,

      loading,
      error,
    }),
    [
      menuOpen,
      userAuthed,
      adminAuthed,
      showValues,
      hives,
      selectedHiveId,
      selectedHive,
      thresholds,
      sensorValues,
      notifications,
      loading,
      error,
    ]
  );

  return (
    <AppContext.Provider value={ctxValue}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/user/login" replace />} />

          {/* sempre accessibile */}
          <Route path="/user/login" element={<Login />} />

          {/* USER protetto */}
          <Route
            path="/user/home"
            element={
              <RequireUser userAuthed={userAuthed}>
                <Home />
              </RequireUser>
            }
          />
          <Route
            path="/user/temp"
            element={
              <RequireUser userAuthed={userAuthed}>
                <Temperature />
              </RequireUser>
            }
          />
          <Route
            path="/user/hum"
            element={
              <RequireUser userAuthed={userAuthed}>
                <Humidity />
              </RequireUser>
            }
          />
          <Route
            path="/user/weight"
            element={
              <RequireUser userAuthed={userAuthed}>
                <Weight />
              </RequireUser>
            }
          />
          <Route
            path="/user/notif"
            element={
              <RequireUser userAuthed={userAuthed}>
                <Notifications />
              </RequireUser>
            }
          />

          {/* admin access sempre accessibile */}
          <Route path="/admin/access" element={<AdminAccess />} />

          {/* ADMIN protetto */}
          <Route
            path="/admin/home"
            element={
              <RequireAdmin adminAuthed={adminAuthed}>
                <AdminHome />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/addHive"
            element={
              <RequireAdmin adminAuthed={adminAuthed}>
                <AdminAddHive />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/hive"
            element={
              <RequireAdmin adminAuthed={adminAuthed}>
                <AdminHive />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/th-temp"
            element={
              <RequireAdmin adminAuthed={adminAuthed}>
                <AdminThreshold tipo="temp" titolo="Soglie Temperatura" unita="°C" />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/th-hum"
            element={
              <RequireAdmin adminAuthed={adminAuthed}>
                <AdminThreshold tipo="hum" titolo="Soglie Umidità" unita="%" />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/th-weight"
            element={
              <RequireAdmin adminAuthed={adminAuthed}>
                <AdminThreshold tipo="weight" titolo="Soglie Peso" unita="KG" />
              </RequireAdmin>
            }
          />

          <Route path="*" element={<Navigate to="/user/login" replace />} />
        </Routes>
      </AppLayout>
    </AppContext.Provider>
  );
}
