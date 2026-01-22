import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import SensorChart from "./SensorCharts";

export default function Weight() {
  const nav = useNavigate();
  const { sensorValues, thresholds } = useContext(AppContext);

  const value = sensorValues.weight;
  const th = thresholds.weight;
  
  // Genera dati realistici per 30 giorni
  const chartData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: `${i + 1}`,
      weight: 10 + Math.random() * 15 + Math.sin(i / 5) * 3
    }));
  }, []);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-8xl mb-4">⚖️</div>

        <div className="card-white rounded-2xl p-4">
          <div className="text-sm font-bold text-gray-900 mb-2">Rilevazione Attuale</div>
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {value} KG
          </div>
          <div className="text-xs text-gray-600">
            Soglie: {th.min}KG - {th.max}KG
          </div>
        </div>
      </div>

      <SensorChart 
        data={chartData}
        dataKey="weight"
        color="#10B981"
        unit="kg"
        label="Andamento Peso"
      />

      <button onClick={() => nav("/user/home")} className="btn-white w-full h-12 rounded-xl">
        ← Indietro
      </button>
    </div>
  );
}