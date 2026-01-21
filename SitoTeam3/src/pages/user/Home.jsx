import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function Home() {
  const nav = useNavigate();
  const {
    hives,
    selectedHiveId,
    setSelectedHiveId,
    showValues,
    setShowValues,
    sensorValues,
  } = useContext(AppContext);

  const StatTile = ({ icon, label, value, unit, to }) => (
    <Card
      onClick={() => nav(to)}
      className="cursor-pointer border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl">{icon}</div>
          <div className="text-xs text-white/50">Apri →</div>
        </div>

        <div className="mt-3 text-xs text-white/70">{label}</div>

        <div className="mt-1 text-xl font-semibold">
          {showValues ? (
            <>
              {value}
              <span className="text-white/60 text-sm"> {unit}</span>
            </>
          ) : (
            <span className="text-white/50">—</span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-5">
      {/* Selezione arnia */}
      <div className="flex items-center gap-3">
        <div className="text-sm font-semibold">Arnia</div>

        <select
          className="h-10 w-full max-w-[320px] rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white
                     focus:border-white/20 outline-none"
          value={selectedHiveId}
          onChange={(e) => setSelectedHiveId(e.target.value)}
        >
          {hives.map((h) => (
            <option key={h.id} value={h.id} className="text-black">
              {h.name}
            </option>
          ))}
        </select>
      </div>

      {/* Toggle valori */}
      <Card className="border-white/10 bg-white/5 text-white">
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Mostra valori</div>
            <div className="text-xs text-white/60">
              Nasconde o mostra i valori numerici
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-white/60">
              {showValues ? "ON" : "OFF"}
            </span>
            <Switch checked={showValues} onCheckedChange={setShowValues} />
          </div>
        </CardContent>
      </Card>

      {/* Statistiche */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatTile icon="💧" label="Umidità" value={sensorValues.hum} unit="%" to="/user/hum" />
        <StatTile icon="🌡️" label="Temperatura" value={sensorValues.temp} unit="°C" to="/user/temp" />
        <StatTile icon="⚖️" label="Peso" value={sensorValues.weight} unit="kg" to="/user/weight" />
      </div>

      {/* Notifiche */}
      <Button
        variant="outline"
        className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
        onClick={() => nav("/user/notif")}
      >
        🛎️ Centro notifiche
      </Button>
    </div>
  );
}
