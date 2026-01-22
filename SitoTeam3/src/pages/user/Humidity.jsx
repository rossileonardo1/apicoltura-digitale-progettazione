import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import SensorChart from "./SensorCharts";

export default function Humidity() {
  const nav = useNavigate();
  const { sensorValues, thresholds } = useContext(AppContext);

  const value = sensorValues.hum;
  const th = thresholds.hum;
  
  // Genera dati realistici per 30 giorni
  const chartData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: `${i + 1}`,
      humidity: 40 + Math.random() * 40 + Math.sin(i / 4) * 8
    }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-8xl mb-4">💧</div>

        <div className="card-white rounded-2xl p-4">
          <div className="text-sm font-bold text-gray-900 mb-2">Rilevazione Attuale</div>
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {value}%
          </div>
          <div className="text-xs text-gray-600">
            Soglie: {th.min}% - {th.max}%
          </div>
        </div>
      </div>

      <SensorChart 
        data={chartData}
        dataKey="humidity"
        color="#3B82F6"
        unit="%"
        label="Andamento Umidità"
      />

      <button onClick={() => nav("/user/home")} className="btn-white w-full h-12 rounded-xl">
        ← Indietro
      </button>
    </div>
  );
}