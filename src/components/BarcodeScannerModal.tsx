import { useState } from 'react';
import { 
  ScanLine, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck, 
  PlusCircle, 
  Phone
} from 'lucide-react';
import { MenuItem, ConsumptionOrder } from '../types';
import { CanteenService, NutritionalCheckResult } from '../services/canteenService';
import { OFFICIAL_EXCHANGE_RATE_VES } from '../data/mockData';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  onOrderCreated: (order: ConsumptionOrder) => void;
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  menuItems,
  onOrderCreated
}: BarcodeScannerModalProps) {
  const [barcodeInput, setBarcodeInput] = useState('CANTINA-EST-101');
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>(
    menuItems.find(m => m.id === 'item-tequenos-racion')?.id || menuItems[0]?.id || ''
  );
  const [validationResult, setValidationResult] = useState<NutritionalCheckResult | null>(null);
  const [saleRecorded, setSaleRecorded] = useState(false);

  if (!isOpen) return null;

  const selectedItem = menuItems.find(m => m.id === selectedMenuItemId) || menuItems[0];

  const handleValidate = () => {
    if (!selectedItem || !barcodeInput.trim()) return;
    setSaleRecorded(false);
    const result = CanteenService.validateNutritionalSafety(barcodeInput, selectedItem);
    setValidationResult(result);
  };

  const handleConfirmSale = () => {
    if (!validationResult || !validationResult.student || !selectedItem) return;

    const newOrder: ConsumptionOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      studentOrUserId: validationResult.student.id,
      userName: validationResult.student.name,
      userRole: 'student',
      userEmail: validationResult.student.email,
      userPhone: validationResult.student.phone || '+584121234567',
      barcode: barcodeInput.trim().toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Hoy',
      items: [
        {
          menuItemId: selectedItem.id,
          name: selectedItem.name,
          quantity: 1,
          unitPriceUSD: selectedItem.priceUSD
        }
      ],
      totalUSD: selectedItem.priceUSD,
      totalVES: Number((selectedItem.priceUSD * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2)),
      paymentStatus: 'pendiente',
      nutritionalValidationStatus: validationResult.allowed ? 'aprobado' : 'alerta_ignorada',
      whatsappSent: false,
      createdAt: new Date().toISOString()
    };

    CanteenService.createOrder(newOrder);
    onOrderCreated(newOrder);
    setSaleRecorded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Escáner de Carnet Escolar y Validación Nutricional
              </h3>
              <p className="text-xs text-stone-400">
                Cruce relacional instantáneo con ficha médica y encuesta de alérgenos
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick preset selector & Barcode input */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
              1. Carnet del Alumno (Código de Barras)
            </label>

            {/* Simulated preset carnets for quick testing */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setBarcodeInput('CANTINA-EST-101');
                  setValidationResult(null);
                  setSaleRecorded(false);
                }}
                className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                  barcodeInput === 'CANTINA-EST-101'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-stone-900'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-600'
                }`}
              >
                <div className="font-semibold text-stone-900">Santiago González</div>
                <div className="text-[11px] text-amber-700">Celiaquía / Sin Gluten</div>
                <div className="font-mono text-[10px] text-stone-400 mt-1">CANTINA-EST-101</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBarcodeInput('CANTINA-EST-102');
                  setValidationResult(null);
                  setSaleRecorded(false);
                }}
                className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                  barcodeInput === 'CANTINA-EST-102'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-stone-900'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-600'
                }`}
              >
                <div className="font-semibold text-stone-900">Valeria López</div>
                <div className="text-[11px] text-sky-700">Intolerancia Lactosa / Azúcar</div>
                <div className="font-mono text-[10px] text-stone-400 mt-1">CANTINA-EST-102</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setBarcodeInput('CANTINA-EST-103');
                  setValidationResult(null);
                  setSaleRecorded(false);
                }}
                className={`p-2.5 text-left rounded-xl border text-xs transition-all ${
                  barcodeInput === 'CANTINA-EST-103'
                    ? 'border-amber-500 bg-amber-50/70 ring-1 ring-amber-500 text-stone-900'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-600'
                }`}
              >
                <div className="font-semibold text-stone-900">Mateo Rivas</div>
                <div className="text-[11px] text-emerald-700">Alergia a Mariscos</div>
                <div className="font-mono text-[10px] text-stone-400 mt-1">CANTINA-EST-103</div>
              </button>
            </div>

            {/* Visual barcode view */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => {
                    setBarcodeInput(e.target.value);
                    setValidationResult(null);
                    setSaleRecorded(false);
                  }}
                  placeholder="Escanee o escriba el código..."
                  className="w-full pl-9 pr-3 py-2 text-sm font-mono border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <ScanLine className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Dish selection */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500">
              2. Plato o Alimento Seleccionado para la Venta
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {menuItems.slice(0, 6).map((item) => {
                const isSelected = item.id === selectedMenuItemId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedMenuItemId(item.id);
                      setValidationResult(null);
                      setSaleRecorded(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-stone-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {item.allergens.length > 0 ? `Alérgenos: ${item.allergens.join(', ')}` : 'Sin alérgenos comunes'}
                      </p>
                      <p className="text-xs font-semibold text-amber-700 mt-1 tabular-nums">
                        ${item.priceUSD.toFixed(2)} USD
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Validation CTA */}
          <div>
            <button
              type="button"
              onClick={handleValidate}
              className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Ejecutar Cruce de Seguridad Nutricional</span>
            </button>
          </div>

          {/* Real-time validation result banner */}
          {validationResult && (
            <div className={`p-4 rounded-xl border transition-all ${
              validationResult.allowed
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}>
              <div className="flex items-start gap-3">
                {validationResult.allowed ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                )}

                <div className="space-y-2 flex-1">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        validationResult.allowed ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                      }`}>
                        {validationResult.allowed ? 'Venta Autorizada' : 'Venta Bloqueada por Alergia / Dieta'}
                      </span>
                      {validationResult.student && (
                        <span className="text-xs text-stone-600 font-medium">
                          Alumno: {validationResult.student.name} ({validationResult.student.studentGrade})
                        </span>
                      )}
                    </div>

                    <p className="text-xs mt-1.5 font-medium leading-relaxed">
                      {validationResult.conflictReason || validationResult.recommendation}
                    </p>
                  </div>

                  {/* Conflicting ingredients callout */}
                  {!validationResult.allowed && validationResult.conflictingElements.length > 0 && (
                    <div className="p-2.5 bg-red-100/70 rounded-lg text-xs border border-red-200">
                      <p className="font-semibold text-red-900 mb-1">
                        Componentes prohibidos detectados en este plato:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {validationResult.conflictingElements.map((el, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-sm bg-red-600 text-white font-medium text-[11px]">
                            ✕ {el}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Survey notes */}
                  {validationResult.survey && (
                    <div className="text-xs text-stone-700 bg-white/80 p-2.5 rounded-lg border border-stone-200/60 space-y-1">
                      <p className="font-semibold text-stone-900">
                        📋 Observación de los Padres en Ficha Médica:
                      </p>
                      <p className="italic text-stone-600">{validationResult.survey.parentNotes}</p>
                      <div className="flex items-center gap-1.5 text-stone-500 pt-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span>Contacto de emergencia: {validationResult.survey.emergencyContact}</span>
                      </div>
                    </div>
                  )}

                  {/* Confirm or proceed */}
                  <div className="pt-2 flex items-center justify-between gap-3">
                    {validationResult.allowed ? (
                      <button
                        type="button"
                        disabled={saleRecorded}
                        onClick={handleConfirmSale}
                        className="py-2 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>{saleRecorded ? 'Consumo Registrado Exitosamente' : 'Confirmar Venta y Cargar a Cuenta'}</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            // Find safe alternative
                            const safe = menuItems.find(m => m.dietTags.includes('sin_gluten') && m.id !== selectedMenuItemId);
                            if (safe) setSelectedMenuItemId(safe.id);
                          }}
                          className="py-1.5 px-3 bg-white border border-red-300 text-red-800 hover:bg-red-100 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Sugerir Plato Alternativo Seguro
                        </button>
                        <button
                          type="button"
                          disabled={saleRecorded}
                          onClick={handleConfirmSale}
                          className="py-1.5 px-3 bg-stone-700 hover:bg-stone-800 text-stone-200 text-xs font-medium rounded-lg transition-colors"
                        >
                          Anular Bloqueo (Solo Supervisor)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Identificador de carnets activo (Mi Cantina v2.4)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-stone-300 text-stone-700 font-medium rounded-lg hover:bg-stone-50 transition-colors"
          >
            Cerrar Escáner
          </button>
        </div>
      </div>
    </div>
  );
}
