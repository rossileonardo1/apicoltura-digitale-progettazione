import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import Chart30Days from "./_Chart30Days";

export default function Temperature() {
  const nav = useNavigate();
  const { sensorValues, thresholds } = useContext(AppContext);

  const value = sensorValues.temp;
  const th = thresholds.temp;
  const data = Array.from({ length: 30 }, () => 20 + Math.floor(Math.random() * 80));

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-6xl">🌡️</div>

        <div className="mt-2 rounded-2xl border bg-white/55 p-3">
          <div className="text-sm font-semibold">Ora e Data</div>
          <div className="text-sm">
            Temperatura: <b>{value}°C</b>
          </div>
          <div className="text-[11px] text-black/60">
            Soglie: {th.min}°C - {th.max}°C
          </div>
        </div>
      </div>

      <Chart30Days data={data} />

      <button onClick={() => nav("/user/home")} className="w-full rounded-2xl border bg-white/70 py-3">
        Indietro
      </button>
    </div>
  );
}
