import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { AppContext } from "../../App";

// Fix icone Leaflet
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map() {
  const nav = useNavigate();
  const context = useContext(AppContext);

  // ✅ PROTEZIONE:  Gestisci il caso in cui il context sia null
  if (!context) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <div className="text-xl font-bold text-gray-900">Caricamento...</div>
        </div>
      </div>
    );
  }

  const { hives } = context;

  // ✅ PROTEZIONE:  Se non ci sono arnie
  if (!hives || hives.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-8xl mb-4">🗺️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Mappa delle Arnie</h2>
          <p className="text-sm text-gray-600">Nessuna arnia disponibile</p>
        </div>
        <button onClick={() => nav("/user/home")} className="btn-white w-full h-12 rounded-xl">
          ← Indietro
        </button>
      </div>
    );
  }

  // Centro della mappa (media delle coordinate o prima arnia)
  const centerLat = hives[0]?.lat || 43.1107;
  const centerLng = hives[0]?.lng || 12.3908;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🗺️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mappa delle Arnie</h2>
        <p className="text-sm text-gray-600">Visualizza la posizione di tutte le arnie</p>
      </div>

      <div className="card-white rounded-2xl p-4">
        <div className="h-[400px] rounded-xl overflow-hidden">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={10}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {hives.map((hive) => {
              // ✅ Controlla che lat/lng siano validi
              if (!hive.lat || !hive.lng || isNaN(hive.lat) || isNaN(hive.lng)) {
                return null;
              }

              return (
                <Marker key={hive.id} position={[hive.lat, hive.lng]}>
                  <Popup>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">🐝 {hive.name}</div>
                      <div className="text-sm text-gray-600">{hive.location}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {hive.apiarioNome || "Apiario sconosciuto"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {hive.lat.toFixed(4)}, {hive.lng.toFixed(4)}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      <div className="card-white rounded-2xl p-4">
        <div className="text-sm font-bold text-gray-900 mb-3">Elenco Arnie</div>
        <div className="space-y-2">
          {hives.map((hive) => (
            <div
              key={hive.id}
              className="rounded-xl border border-amber-200 bg-amber-50 p-3"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    🐝 {hive.name}
                  </div>
                  <div className="text-xs text-gray-600">{hive.location}</div>
                  <div className="text-xs text-gray-500">{hive.apiarioNome}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {hive.lat && hive.lng ? (
                    <>
                      {hive.lat.toFixed(4)}, {hive.lng.toFixed(4)}
                    </>
                  ) : (
                    <span className="text-red-500">Coordinate mancanti</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => nav("/user/home")} className="btn-white w-full h-12 rounded-xl">
        ← Indietro
      </button>
    </div>
  );
}