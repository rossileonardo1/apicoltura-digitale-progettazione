import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function Temperature() {
  const nav = useNavigate();
  const { selectedHive, thresholds } = useContext(AppContext);

  // ✅ Usa i dati dalla selectedHive
  const tempData = useMemo(() => {
    if (!selectedHive?.tempHistory) return [];
    
    return selectedHive.tempHistory.map((v) => ({
      time: new Date(v.timestamp).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperatura: v.value,
    }));
  }, [selectedHive]);

  // ✅ Valore corrente
  const currentTemp = selectedHive?.temperature ?? 0;

  // ✅ Soglie
  const tempMin = thresholds.temperature?.min ?? 15;
  const tempMax = thresholds.temperature?.max ?? 35;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-8xl mb-4">🌡️</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Temperatura</h1>
        <p className="text-sm text-gray-600">Monitoraggio termico dell'arnia</p>
      </div>

      {/* Valore corrente */}
      <div className="card-white rounded-2xl p-6 text-center">
        <div className="text-sm text-gray-600 mb-2">Temperatura Attuale</div>
        <div className="text-6xl font-bold text-gray-900 mb-2">
          {currentTemp.toFixed(1)}°C
        </div>
        <div className="text-sm text-gray-600">
          Range ottimale: {tempMin}°C - {tempMax}°C
        </div>
      </div>

      {/* Grafico */}
      <div className="card-white rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Andamento Temperatura
        </h2>
        {tempData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={tempData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                domain={[0, 50]}
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #fbbf24",
                  borderRadius: "12px",
                }}
              />
              <ReferenceLine 
                y={tempMax} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                label={{ value: `Max ${tempMax}°C`, fill: "#ef4444", fontSize: 12 }}
              />
              <ReferenceLine 
                y={tempMin} 
                stroke="#3b82f6" 
                strokeDasharray="5 5"
                label={{ value: `Min ${tempMin}°C`, fill: "#3b82f6", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="temperatura"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: "#f59e0b", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Nessun dato disponibile per l'arnia selezionata
          </div>
        )}
      </div>

      {/* Statistiche */}
      {tempData.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-sm text-gray-600">Massima</div>
            <div className="text-xl font-bold text-red-600">
              {Math.max(...tempData.map((d) => d.temperatura)).toFixed(1)}°C
            </div>
          </div>
          <div className="card-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm text-gray-600">Media</div>
            <div className="text-xl font-bold text-gray-900">
              {(
                tempData.reduce((sum, d) => sum + d.temperatura, 0) /
                tempData.length
              ).toFixed(1)}
              °C
            </div>
          </div>
          <div className="card-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📉</div>
            <div className="text-sm text-gray-600">Minima</div>
            <div className="text-xl font-bold text-blue-600">
              {Math.min(...tempData.map((d) => d.temperatura)).toFixed(1)}°C
            </div>
          </div>
        </div>
      )}

      {/* Pulsante indietro */}
      <button
        onClick={() => nav("/user/home")}
        className="w-full btn-white h-12 rounded-xl font-semibold"
      >
        ← Indietro
      </button>
    </div>
  );
}