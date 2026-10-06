export function VenezuelaFlagBar() {
  return (
    <div className="w-full flex h-1.5 shadow-xs" aria-hidden="true">
      <div className="flex-1 bg-amber-400" />
      <div className="flex-1 bg-blue-700 relative flex items-center justify-center">
        {/* Subtle 8-star pattern marker */}
        <span className="absolute -top-1 text-[8px] text-white tracking-widest opacity-80 select-none">
          ★ ★ ★ ★ ★ ★ ★ ★
        </span>
      </div>
      <div className="flex-1 bg-red-600" />
    </div>
  );
}

export function VenezuelanEmblem() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-900 text-xs font-medium">
      <span className="flex h-2.5 w-3.5 rounded-xs overflow-hidden shadow-xs border border-stone-300">
        <span className="w-full h-1/3 bg-amber-400 block" />
        <span className="w-full h-1/3 bg-blue-700 block" />
        <span className="w-full h-1/3 bg-red-600 block" />
      </span>
      <span>Identidad Escolar Venezolana</span>
    </div>
  );
}
