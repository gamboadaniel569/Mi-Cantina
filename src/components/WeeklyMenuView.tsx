import { useState } from 'react';
import { 
  MenuItem, 
  FoodCategory, 
  SpecialDietTag 
} from '../types';
import { 
  Utensils, 
  Leaf, 
  ShieldCheck, 
  Sparkles, 
  Info,
  Check
} from 'lucide-react';
import { OFFICIAL_EXCHANGE_RATE_VES } from '../data/mockData';

interface WeeklyMenuViewProps {
  menuItems: MenuItem[];
  onOpenScanner?: () => void;
}

export function WeeklyMenuView({ menuItems, onOpenScanner }: WeeklyMenuViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'todos'>('todos');
  const [selectedTag, setSelectedTag] = useState<SpecialDietTag | 'todas'>('todas');
  const [selectedItemDetail, setSelectedItemDetail] = useState<MenuItem | null>(null);

  const filteredItems = menuItems.filter(item => {
    if (selectedCategory !== 'todos' && item.category !== selectedCategory) return false;
    if (selectedTag !== 'todas' && !item.dietTags.includes(selectedTag)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Category and Diet Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'todos', label: 'Todos los Platos' },
            { id: 'desayunos', label: 'Desayunos Criollos' },
            { id: 'almuerzos', label: 'Almuerzos' },
            { id: 'snacks', label: 'Snacks & Tequeños' },
            { id: 'bebidas', label: 'Bebidas' },
            { id: 'especial_saludable', label: 'Menú Especial' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Special Diet Quick Filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-stone-100 overflow-x-auto text-[11px]">
          <span className="text-stone-400 font-semibold whitespace-nowrap">Filtro Nutricional:</span>
          {[
            { id: 'todas', label: 'Todos' },
            { id: 'sin_gluten', label: '🌾 Sin Gluten' },
            { id: 'sin_harina', label: '🥗 Sin Harina' },
            { id: 'sin_azucar', label: '🌱 Sin Azúcar' },
            { id: 'alto_proteina', label: '💪 Alto en Proteína' }
          ].map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTag(tag.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedTag === tag.id
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                  : 'bg-stone-50 text-stone-500 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Product Image */}
              <div className="aspect-4/3 w-full overflow-hidden bg-stone-100 relative">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" 
                />
                {item.dietTags.length > 0 && (
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    {item.dietTags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold">
                        {tag.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    {item.category.replace('_', ' ')}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-900 block tabular-nums">
                      ${item.priceUSD.toFixed(2)} USD
                    </span>
                    <span className="text-[10px] text-stone-400 block tabular-nums">
                      ≈ {(item.priceUSD * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2)} Bs
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-stone-900 text-sm leading-snug">{item.name}</h3>
                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Ingredients & Allergens preview */}
                <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-100 space-y-1">
                  <div className="flex items-start gap-1">
                    <span className="font-semibold text-stone-700">Ingredientes:</span>
                    <span className="truncate">{item.ingredients.join(', ')}</span>
                  </div>
                  {item.allergens.length > 0 && (
                    <div className="flex items-start gap-1 text-red-700">
                      <span className="font-semibold">Alérgenos:</span>
                      <span className="truncate">{item.allergens.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={() => setSelectedItemDetail(item)}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Ver Ficha Nutricional</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Item Detail Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="aspect-16/9 w-full bg-stone-100 relative">
              <img 
                src={selectedItemDetail.imageUrl} 
                alt={selectedItemDetail.name} 
                className="w-full h-full object-cover" 
              />
              <button
                onClick={() => setSelectedItemDetail(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/80 text-white flex items-center justify-center hover:bg-stone-900"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    {selectedItemDetail.category}
                  </span>
                  <span className="text-base font-bold text-stone-900 tabular-nums">
                    ${selectedItemDetail.priceUSD.toFixed(2)} USD ({(selectedItemDetail.priceUSD * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2)} Bs)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-1 font-display">
                  {selectedItemDetail.name}
                </h3>
                <p className="text-stone-600 mt-1 leading-relaxed">
                  {selectedItemDetail.description}
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200">
                <p className="font-bold text-stone-800">Composición Nutricional e Ingredientes:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItemDetail.ingredients.map((ing, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white border border-stone-200 rounded text-stone-700 text-[11px]">
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {selectedItemDetail.allergens.length > 0 && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-900">
                  <p className="font-bold">⚠️ Alérgenos presentes:</p>
                  <p className="mt-0.5">{selectedItemDetail.allergens.join(', ')}</p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedItemDetail(null)}
                  className="px-4 py-2 bg-stone-900 text-white font-bold rounded-xl"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
