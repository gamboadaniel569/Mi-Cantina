import { useState } from 'react';
import { 
  HeartPulse, 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Check, 
  User, 
  FileText, 
  Phone 
} from 'lucide-react';
import { NutritionalSurvey } from '../types';
import { CanteenService } from '../services/canteenService';

interface NutritionalSurveyViewProps {
  currentStudentBarcode: string;
  onSurveyUpdated?: () => void;
}

export function NutritionalSurveyView({
  currentStudentBarcode,
  onSurveyUpdated
}: NutritionalSurveyViewProps) {
  const surveys = CanteenService.getSurveys();
  const [selectedBarcode, setSelectedBarcode] = useState(currentStudentBarcode || 'CANTINA-EST-101');
  
  const currentSurvey = surveys.find(s => s.barcode === selectedBarcode) || surveys[0];

  const [prohibitedList, setProhibitedList] = useState<string[]>(currentSurvey?.prohibitedIngredients || []);
  const [allergensList, setAllergensList] = useState<string[]>(currentSurvey?.allergens || []);
  const [conditionsList, setConditionsList] = useState<string[]>(currentSurvey?.medicalConditions || []);
  const [preferencesList, setPreferencesList] = useState<string[]>(currentSurvey?.foodPreferences || ['Arepa reina pepiada', 'Jugos naturales']);
  const [spendingLimit, setSpendingLimit] = useState<number>(currentSurvey?.dailySpendingLimitUSD || 5.00);
  const [canteenFreq, setCanteenFreq] = useState<string>(currentSurvey?.canteenFrequency || '2_3_dias');
  const [newPref, setNewPref] = useState('');
  const [parentNotes, setParentNotes] = useState(currentSurvey?.parentNotes || '');
  const [emergencyContact, setEmergencyContact] = useState(currentSurvey?.emergencyContact || '');
  const [newProhibited, setNewProhibited] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state when selected barcode changes
  const handleSelectStudent = (barcode: string) => {
    setSelectedBarcode(barcode);
    const surv = surveys.find(s => s.barcode === barcode);
    if (surv) {
      setProhibitedList(surv.prohibitedIngredients);
      setAllergensList(surv.allergens);
      setConditionsList(surv.medicalConditions);
      setPreferencesList(surv.foodPreferences || ['Arepa reina pepiada', 'Jugos naturales']);
      setSpendingLimit(surv.dailySpendingLimitUSD || 5.00);
      setCanteenFreq(surv.canteenFrequency || '2_3_dias');
      setParentNotes(surv.parentNotes);
      setEmergencyContact(surv.emergencyContact);
    }
    setSavedSuccess(false);
  };

  const handleAddProhibited = () => {
    if (!newProhibited.trim()) return;
    if (!prohibitedList.includes(newProhibited.trim())) {
      setProhibitedList([...prohibitedList, newProhibited.trim()]);
    }
    setNewProhibited('');
  };

  const handleRemoveProhibited = (index: number) => {
    setProhibitedList(prohibitedList.filter((_, i) => i !== index));
  };

  const handleAddPreference = () => {
    if (!newPref.trim()) return;
    if (!preferencesList.includes(newPref.trim())) {
      setPreferencesList([...preferencesList, newPref.trim()]);
    }
    setNewPref('');
  };

  const handleRemovePreference = (index: number) => {
    setPreferencesList(preferencesList.filter((_, i) => i !== index));
  };

  const handleToggleAllergen = (allergen: string) => {
    if (allergensList.includes(allergen)) {
      setAllergensList(allergensList.filter(a => a !== allergen));
    } else {
      setAllergensList([...allergensList, allergen]);
    }
  };

  const handleSave = () => {
    if (!currentSurvey) return;
    const updated: NutritionalSurvey = {
      ...currentSurvey,
      prohibitedIngredients: prohibitedList,
      allergens: allergensList,
      medicalConditions: conditionsList,
      foodPreferences: preferencesList,
      dailySpendingLimitUSD: spendingLimit,
      canteenFrequency: canteenFreq,
      parentNotes,
      emergencyContact,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    CanteenService.saveSurvey(updated);
    setSavedSuccess(true);
    if (onSurveyUpdated) onSurveyUpdated();
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const COMMON_ALLERGENS = [
    'Gluten', 
    'Lácteos', 
    'Huevo', 
    'Maní', 
    'Frutos Secos', 
    'Mariscos', 
    'Pescado', 
    'Soya',
    'Azúcar refinada'
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-display">
              Encuesta Nutricional y Control de Alérgenos
            </h2>
            <p className="text-xs text-stone-500">
              Ficha médica preventiva para el cruce automático en caja y cantina
            </p>
          </div>
        </div>

        {/* Student Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-stone-600">Alumno:</label>
          <select
            value={selectedBarcode}
            onChange={(e) => handleSelectStudent(e.target.value)}
            className="text-xs font-semibold py-1.5 px-3 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            {surveys.map(s => (
              <option key={s.barcode} value={s.barcode}>
                {s.studentName} ({s.grade})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-6">
        {/* Student Summary Banner */}
        <div className="p-4 bg-stone-50 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-stone-500" />
            <span className="font-bold text-stone-900">{currentSurvey?.studentName}</span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-600">{currentSurvey?.grade}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Carnet:</span>
            <code className="bg-stone-200 px-2 py-0.5 rounded text-[11px] font-mono text-stone-800">
              {currentSurvey?.barcode}
            </code>
          </div>
        </div>

        {/* Section 1: Alérgenos Diagnosticados */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            1. Alérgenos e Intolerancias Diagnosticadas
          </label>
          <p className="text-xs text-stone-500">
            Haga clic para activar o desactivar alérgenos que deben bloquear la venta automáticamente:
          </p>
          <div className="flex flex-wrap gap-2">
            {COMMON_ALLERGENS.map(allergen => {
              const active = allergensList.includes(allergen);
              return (
                <button
                  key={allergen}
                  type="button"
                  onClick={() => handleToggleAllergen(allergen)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    active
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {active ? `✓ ${allergen}` : `+ ${allergen}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Alimentos Prohibidos Expresamente */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
            2. Ingredientes y Alimentos Expresamente Prohibidos por los Padres
          </label>
          <p className="text-xs text-stone-500">
            El escáner de la cantina verificará cada ingrediente del menú escolar contra esta lista:
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newProhibited}
              onChange={(e) => setNewProhibited(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProhibited())}
              placeholder="Ej: Harina de trigo, Refrescos, Mayonesa..."
              className="flex-1 py-2 px-3 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="button"
              onClick={handleAddProhibited}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Añadir</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {prohibitedList.map((item, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-900 border border-red-200 rounded-md text-xs font-medium"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveProhibited(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Preferencias y Límite de Gasto */}
        <div className="space-y-4 pt-2 border-t border-stone-100">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              3. Preferencias de Alimentación Saludable del Alumno
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newPref}
                onChange={(e) => setNewPref(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPreference())}
                placeholder="Ej: Arepa reina pepiada, Frutas picadas..."
                className="flex-1 py-2 px-3 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddPreference}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-semibold rounded-lg hover:bg-emerald-800 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {preferencesList.map((pref, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-xs font-medium"
                >
                  <span>{pref}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePreference(idx)}
                    className="text-emerald-600 hover:text-emerald-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Límite Diario de Consumo ($ USD)
              </label>
              <input
                type="number"
                step="0.50"
                value={spendingLimit}
                onChange={(e) => setSpendingLimit(Number(e.target.value) || 0)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-lg font-bold"
              />
              <span className="text-[11px] text-stone-400">
                Tope máximo permitido para consumos diarios por alumno.
              </span>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Frecuencia Semanal en Cantina
              </label>
              <select
                value={canteenFreq}
                onChange={(e) => setCanteenFreq(e.target.value)}
                className="w-full p-2.5 text-xs border border-stone-300 rounded-lg bg-white"
              >
                <option value="diario">Diario (Todos los días escolares)</option>
                <option value="2_3_dias">2 a 3 días por semana</option>
                <option value="solo_viernes">Solo viernes especiales</option>
                <option value="ocasional">Solo consumos ocasionales autorizados</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Observaciones de los Padres y Contacto de Emergencia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Instrucciones Específicas de los Padres
            </label>
            <textarea
              rows={3}
              value={parentNotes}
              onChange={(e) => setParentNotes(e.target.value)}
              placeholder="Instrucciones para la cantinera o nutricionista..."
              className="w-full p-2.5 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              Contacto de Emergencia Médica
            </label>
            <input
              type="text"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="Nombre y teléfono del médico o representante..."
              className="w-full p-2.5 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            />
            <p className="text-[11px] text-stone-500">
              En caso de reacción alérgica o duda en caja de cantina.
            </p>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
          <div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Encuesta guardada. El escáner de carnet ya tiene las nuevas reglas activas.</span>
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="py-2.5 px-6 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Guardar Encuesta Nutricional</span>
          </button>
        </div>
      </div>
    </div>
  );
}
