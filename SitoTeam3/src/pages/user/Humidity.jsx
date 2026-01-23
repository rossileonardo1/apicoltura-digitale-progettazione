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

export default function Humidity() {
  const nav = useNavigate();
  const { selectedHive, thresholds } = useContext(AppContext);

  // ✅ Usa i dati dalla selectedHive
  const humData = useMemo(() => {
    if (!selectedHive?.humHistory) return [];
    
    return selectedHive.humHistory.map((v) => ({
      time: new Date(v.timestamp).toLocaleTimeString("it-IT", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      umidita: v.value,
    }));
  }, [selectedHive]);

  // ✅ Valore corrente
  const currentHum = selectedHive?.humidity ?? 0;

  // ✅ Soglie
  const humMin = thresholds.humidity?.min ?? 40;
  const humMax = thresholds.humidity?.max ?? 70;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-8xl mb-4">💧</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Umidità</h1>
        <p className="text-sm text-gray-600">Monitoraggio umidità dell'arnia</p>
      </div>

      {/* Valore corrente */}
      <div className="card-white rounded-2xl p-6 text-center">
        <div className="text-sm text-gray-600 mb-2">Umidità Attuale</div>
        <div className="text-6xl font-bold text-gray-900 mb-2">
          {currentHum.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600">
          Range ottimale: {humMin}% - {humMax}%
        </div>
      </div>

      {/* Grafico */}
      <div className="card-white rounded-2xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Andamento Umidità
        </h2>
        {humData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={humData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                stroke="#666"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "2px solid #3b82f6",
                  borderRadius: "12px",
                }}
              />
              <ReferenceLine 
                y={humMax} 
                stroke="#ef4444" 
                strokeDasharray="5 5"
                label={{ value: `Max ${humMax}%`, fill: "#ef4444", fontSize: 12 }}
              />
              <ReferenceLine 
                y={humMin} 
                stroke="#f59e0b" 
                strokeDasharray="5 5"
                label={{ value: `Min ${humMin}%`, fill: "#f59e0b", fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="umidita"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", r: 4 }}
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
      {humData.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-sm text-gray-600">Massima</div>
            <div className="text-xl font-bold text-blue-600">
              {Math.max(...humData.map((d) => d.umidita)).toFixed(1)}%
            </div>
          </div>
          <div className="card-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm text-gray-600">Media</div>
            <div className="text-xl font-bold text-gray-900">
              {(
                humData.reduce((sum, d) => sum + d.umidita, 0) / humData.length
              ).toFixed(1)}
              %
            </div>
          </div>
          <div className="card-white rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">📉</div>
            <div className="text-sm text-gray-600">Minima</div>
            <div className="text-xl font-bold text-orange-600">
              {Math.min(...humData.map((d) => d.umidita)).toFixed(1)}%
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