export default function Chart30Days({ data }) {
  return (
    <div className="card-white rounded-2xl p-4">
      <div className="text-xs text-gray-600 font-semibold mb-3">Andamento ultimi 30 giorni</div>
      <div className="flex items-end gap-[2px] h-28">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-gradient-to-t from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-amber-400 transition-all cursor-pointer"
            style={{ height: `${Math.max(4, v)}%` }}
            title={`Giorno ${i + 1}: ${v}%`}
          />
        ))}
      </div>
    </div>
  );
}