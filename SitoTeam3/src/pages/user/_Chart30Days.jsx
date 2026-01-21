export default function Chart30Days({ data }) {
  return (
    <div className="rounded-2xl border bg-white p-3">
      <div className="text-xs text-black/60 mb-2">Andamento ultimi 30 giorni</div>
      <div className="flex items-end gap-[2px] h-28">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-black/20"
            style={{ height: `${Math.max(4, v)}%` }}
            title={`${v}`}
          />
        ))}
      </div>
    </div>
  );
}
