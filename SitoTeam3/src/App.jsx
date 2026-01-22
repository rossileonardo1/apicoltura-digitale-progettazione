import { createContext, useMemo, useState } from "react";
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
import Map from "./pages/user/Map";

import AdminAccess from "./pages/admin/Access";
import AdminHome from "./pages/admin/Home";
import AdminAddHive from "./pages/admin/AddHive";
import AdminHive from "./pages/admin/Hive";
import AdminThreshold from "./pages/admin/Threshold";

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
          title={isAdminRoute ? "AREA ADMIN" : ctx.selectedHive?.name ??  "Beehives"}
          subtitle={isAdminRoute ? "Gestione arnie e soglie" : ctx.selectedHive?.location ?? ""}
          onMenu={() => ctx.setMenuOpen(true)}
          onProfile={() => {}}
        >
          {isAdminRoute ? (
            <SideMenuAdmin open={ctx.menuOpen} onClose={() => ctx.setMenuOpen(false)} />
          ) : (
            <SideMenuUser open={ctx.menuOpen} onClose={() => ctx.setMenuOpen(false)} />
          )}

          {children}
        </AppShell>
      )}
    </AppContext.Consumer>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  // ✅ STATO PERSISTENTE con localStorage
  const [userAuthed, setUserAuthedState] = useState(() => {
    return localStorage.getItem("userAuthed") === "true";
  });
  
  const [adminAuthed, setAdminAuthedState] = useState(() => {
    return localStorage.getItem("adminAuthed") === "true";
  });

  // ✅ Funzioni wrapper che salvano in localStorage
  const setUserAuthed = (value) => {
    setUserAuthedState(value);
    localStorage.setItem("userAuthed", value. toString());
  };

  const setAdminAuthed = (value) => {
    setAdminAuthedState(value);
    localStorage.setItem("adminAuthed", value.toString());
  };

  // mostra/nasconde valori
  const [showValues, setShowValues] = useState(true);

  const sensorValues = useMemo(() => ({ temp: 34.2, hum: 58, weight: 12.7 }), []);

  const [selectedHiveId, setSelectedHiveId] = useState("A1");
  
  // ✅ Arnie con coordinate
  const [hives, setHives] = useState([
    { 
      id: "A1", 
      name: "Arnia Gialla", 
      location: "Perugia",
      lat: 43.1107,
      lng: 12.3908
    },
    { 
      id: "A2", 
      name: "Arnia Blu", 
      location:  "Gubbio",
      lat: 43.3528,
      lng: 12.5784
    },
  ]);

  const selectedHive = useMemo(
    () => hives.find((h) => h.id === selectedHiveId) ??  hives[0],
    [hives, selectedHiveId]
  );

  const [thresholds, setThresholds] = useState({
    temp: { min: 20, max: 40 },
    hum:  { min: 40, max: 80 },
    weight: { min: 5, max: 30 },
  });

  const notifications = useMemo(
    () => [
      { id: 1, date: "2026-01-21", text: "Tutto regolare." },
      { id: 2, date: "2026-01-20", text: "Umidità vicina alla soglia minima." },
      { id: 3, date: "2026-01-10", text: "Peso in aumento negli ultimi giorni." },
    ],
    []
  );

  // ✅ Aggiornato per supportare coordinate
  const addHive = ({ id, location, lat, lng }) => {
    const newHive = { 
      id, 
      name:  `Arnia ${id}`, 
      location,
      lat:  lat || 43.1107,  // Default: Perugia
      lng: lng || 12.3908
    };
    setHives((prev) => [newHive, ...prev]);
    setSelectedHiveId(id);
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

      sensorValues,
      notifications,

      hives,
      selectedHiveId,
      setSelectedHiveId,
      selectedHive,

      thresholds,
      setThresholds,
      addHive,
    }),
    [
      menuOpen,
      userAuthed,
      adminAuthed,
      showValues,
      sensorValues,
      notifications,
      hives,
      selectedHiveId,
      selectedHive,
      thresholds,
    ]
  );

  return (
    <AppContext.Provider value={ctxValue}>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/user/login" replace />} />

          {/* LOGIN sempre accessibile */}
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
            path="/user/map"
            element={
              <RequireUser userAuthed={userAuthed}>
                <Map />
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

          {/* ADMIN access sempre accessibile */}
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
    </AppContext. Provider>
  );
}