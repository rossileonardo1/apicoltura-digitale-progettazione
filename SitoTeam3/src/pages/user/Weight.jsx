import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import Chart30Days from "./_Chart30Days";

export default function Weight() {
  const nav = useNavigate();
  const { sensorValues, thresholds } = useContext(AppContext);

  const value = sensorValues.weight;
  const th = thresholds.weight;
  const data = Array.from({ length: 30 }, () => 20 + Math.floor(Math.random() * 80));

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-8xl mb-4">⚖️</div>

        <div className="card-white rounded-2xl p-4">
          <div className="text-sm font-bold text-gray-900 mb-2">Ora e Data</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            Peso: {value} KG
          </div>
          <div className="text-xs text-gray-600">
            Soglie: {th.min}KG - {th.max}KG
          </div>
        </div>
      </div>

      <Chart30Days data={data} />

      <button onClick={() => nav("/user/home")} className="btn-white w-full h-12 rounded-xl">
        ← Indietro
      </button>
    </div>
  );
}