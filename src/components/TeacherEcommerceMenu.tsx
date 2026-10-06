import { useState } from 'react';
import { 
  Calendar, 
  Check, 
  UtensilsCrossed, 
  Leaf, 
  ShoppingBag, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';
import { MenuItem, TeacherWeeklySelection } from '../types';
import { CanteenService } from '../services/canteenService';
import { OFFICIAL_EXCHANGE_RATE_VES } from '../data/mockData';

interface TeacherEcommerceMenuProps {
  teacherId: string;
  teacherName: string;
  menuItems: MenuItem[];
}

const DAYS_OF_WEEK = [
  { key: 'lunes', label: 'Lunes', dateStr: '12 Octubre' },
  { key: 'martes', label: 'Martes', dateStr: '13 Octubre' },
  { key: 'miercoles', label: 'Miércoles', dateStr: '14 Octubre' },
  { key: 'jueves', label: 'Jueves', dateStr: '15 Octubre' },
  { key: 'viernes', label: 'Viernes', dateStr: '16 Octubre' },
];

export function TeacherEcommerceMenu({
  teacherId,
  teacherName,
  menuItems
}: TeacherEcommerceMenuProps) {
  const [selectedDay, setSelectedDay] = useState<'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes'>('lunes');
  
  // Load existing selections or empty
  const [selections, setSelections] = useState<TeacherWeeklySelection['selections']>(() => {
    const existing = CanteenService.getTeacherSelections(teacherId);
    return existing ? existing.selections : {};
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [specialNoteInput, setSpecialNoteInput] = useState('');

  // Filter teacher dishes for the day
  const dayItems = menuItems.filter(item => 
    item.isTeacherOption && (item.dayAvailable === selectedDay || item.dayAvailable === 'todos')
  );

  const optionA = dayItems.find(i => i.teacherOptionType === 'opcion_a') || 
    menuItems.find(i => i.category === 'almuerzos');
  const optionB = dayItems.find(i => i.teacherOptionType === 'opcion_b') || 
    menuItems.find(i => i.category === 'especial_saludable');

  const handleSelectOption = (item: MenuItem, type: 'opcion_a' | 'opcion_b') => {
    setOrderConfirmed(false);
    setSelections(prev => ({
      ...prev,
      [selectedDay]: {
        menuItemId: item.id,
        dishName: item.name,
        optionType: type,
        priceUSD: item.priceUSD,
        specialNotes: specialNoteInput || undefined
      }
    }));
  };

  const handleRemoveSelection = (dayKey: string) => {
    setOrderConfirmed(false);
    setSelections(prev => {
      const copy = { ...prev };
      delete copy[dayKey];
      return copy;
    });
  };

  const totalUSD = Object.values(selections).reduce((acc, curr) => acc + curr.priceUSD, 0);
  const totalVES = totalUSD * OFFICIAL_EXCHANGE_RATE_VES;

  const handleConfirmWeeklyOrder = () => {
    const weeklyOrder: TeacherWeeklySelection = {
      teacherId,
      weekStartDate: '2026-10-12',
      selections,
      totalUSD,
      confirmed: true
    };
    CanteenService.saveTeacherSelections(weeklyOrder);
    setOrderConfirmed(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 bg-stone-900 rounded-2xl text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Experiencia Exclusiva para Docentes</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">
            Selección Anticipada de Menú Semanal
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Estimado(a) <strong>{teacherName}</strong>: Seleccione con antelación sus almuerzos para cada día de la semana. Disfrute de nuestra dualidad gastronómica: <strong>Opción A (Criolla Tradicional)</strong> y <strong>Opción B (Ligera y Saludable)</strong>.
          </p>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDay === day.key;
          const hasChosen = !!selections[day.key];

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDay(day.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-xs'
                  : 'bg-white text-stone-600 hover:text-stone-950 border border-stone-200 hover:border-stone-300'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{day.label}</span>
              {hasChosen && (
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-stone-900' : 'bg-emerald-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Dual Menu Display for the selected day */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 columns: Options A & B */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 font-display">
              Menú para el día {DAYS_OF_WEEK.find(d => d.key === selectedDay)?.label} ({DAYS_OF_WEEK.find(d => d.key === selectedDay)?.dateStr})
            </h3>
            <span className="text-xs text-stone-500">
              Escoja 1 opción para este día
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* OPCIÓN A */}
            {optionA && (
              <div className={`rounded-2xl border p-5 flex flex-col justify-between transition-all bg-white ${
                selections[selectedDay]?.optionType === 'opcion_a'
                  ? 'border-amber-500 ring-2 ring-amber-500/30 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 shadow-xs'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[11px] font-bold uppercase tracking-wide">
                      Opción A · Tradicional
                    </span>
                    <span className="text-xs font-bold text-amber-700 tabular-nums">
                      ${optionA.priceUSD.toFixed(2)} USD
                    </span>
                  </div>

                  <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-100">
                    <img 
                      src={optionA.imageUrl} 
                      alt={optionA.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 text-sm leading-snug">{optionA.name}</h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {optionA.description}
                    </p>
                  </div>

                  <div className="text-[11px] text-stone-500 space-y-1">
                    <p className="font-medium text-stone-700">Ingredientes:</p>
                    <p className="italic">{optionA.ingredients.join(', ')}</p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => handleSelectOption(optionA, 'opcion_a')}
                    className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                      selections[selectedDay]?.optionType === 'opcion_a'
                        ? 'bg-amber-500 text-stone-950'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    {selections[selectedDay]?.optionType === 'opcion_a' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Opción A Seleccionada</span>
                      </>
                    ) : (
                      <>
                        <UtensilsCrossed className="w-3.5 h-3.5" />
                        <span>Elegir Opción A</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* OPCIÓN B */}
            {optionB && (
              <div className={`rounded-2xl border p-5 flex flex-col justify-between transition-all bg-white ${
                selections[selectedDay]?.optionType === 'opcion_b'
                  ? 'border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                  : 'border-stone-200 hover:border-stone-300 shadow-xs'
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wide">
                      Opción B · Saludable / Gourmet
                    </span>
                    <span className="text-xs font-bold text-emerald-700 tabular-nums">
                      ${optionB.priceUSD.toFixed(2)} USD
                    </span>
                  </div>

                  <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-100">
                    <img 
                      src={optionB.imageUrl} 
                      alt={optionB.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-stone-900 text-sm leading-snug">{optionB.name}</h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {optionB.description}
                    </p>
                  </div>

                  <div className="text-[11px] text-stone-500 space-y-1">
                    <p className="font-medium text-stone-700">Etiquetas dietéticas:</p>
                    <div className="flex flex-wrap gap-1">
                      {optionB.dietTags.map(tag => (
                        <span key={tag} className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-xs text-[10px] font-medium">
                          {tag.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => handleSelectOption(optionB, 'opcion_b')}
                    className={`w-full py-2.5 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
                      selections[selectedDay]?.optionType === 'opcion_b'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    {selections[selectedDay]?.optionType === 'opcion_b' ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Opción B Seleccionada</span>
                      </>
                    ) : (
                      <>
                        <Leaf className="w-3.5 h-3.5" />
                        <span>Elegir Opción B</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Weekly Order Basket & Confirmation */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-5 h-fit">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-200">
            <ShoppingBag className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-stone-900 font-display">
              Resumen de Pedido Semanal
            </h3>
          </div>

          <div className="space-y-2.5">
            {DAYS_OF_WEEK.map((day) => {
              const item = selections[day.key];
              return (
                <div 
                  key={day.key} 
                  className={`p-3 rounded-xl border text-xs transition-all ${
                    item 
                      ? 'bg-white border-stone-200 shadow-2xs' 
                      : 'bg-stone-100/60 border-dashed border-stone-200 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="capitalize text-stone-800">{day.label}</span>
                    {item ? (
                      <span className="text-amber-800 tabular-nums font-bold">
                        ${item.priceUSD.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-stone-400 font-normal">Sin elegir</span>
                    )}
                  </div>

                  {item && (
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-stone-600 text-[11px] truncate max-w-[170px]">
                        {item.dishName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSelection(day.key)}
                        className="text-[10px] text-red-500 hover:text-red-700 underline"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pricing summary */}
          <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Total Dólares:</span>
              <span className="font-bold text-stone-900 tabular-nums">${totalUSD.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Total Bolívares (BCV):</span>
              <span className="font-bold text-amber-800 tabular-nums">{totalVES.toFixed(2)} Bs</span>
            </div>
            <p className="text-[10px] text-stone-400">
              Tasa oficial: {OFFICIAL_EXCHANGE_RATE_VES} Bs / USD
            </p>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            disabled={Object.keys(selections).length === 0}
            onClick={handleConfirmWeeklyOrder}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Confirmar Pedido de la Semana</span>
          </button>

          {orderConfirmed && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>¡Pedido programado exitosamente! El chef recibirá la orden de la semana.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
