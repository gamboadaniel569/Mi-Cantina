import { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  HeartPulse, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Plus, 
  Trash2, 
  DollarSign, 
  Sparkles, 
  ScanLine, 
  IdCard,
  Check
} from 'lucide-react';
import { CanteenService } from '../services/canteenService';
import { OFFICIAL_EXCHANGE_RATE_VES } from '../data/mockData';

interface ParentOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentEmail: string;
  onCompleted: () => void;
}

export function ParentOnboardingModal({
  isOpen,
  onClose,
  parentEmail,
  onCompleted
}: ParentOnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Parent basic info
  const [parentName, setParentName] = useState('Mariana Gamboa');
  const [parentCedula, setParentCedula] = useState('V-18.452.109');
  const [parentPhone, setParentPhone] = useState('+584127778899');
  const [parentRelationship, setParentRelationship] = useState<'madre' | 'padre' | 'tutor'>('madre');

  // Step 2: Student basic info
  const [studentName, setStudentName] = useState('Santiago González Gamboa');
  const [studentGrade, setStudentGrade] = useState('4to Grado "A"');
  const [studentBarcode, setStudentBarcode] = useState('CANTINA-EST-101');

  // Step 3: Food and nutritional survey
  const [allergensList, setAllergensList] = useState<string[]>(['Gluten', 'Maní']);
  const [prohibitedList, setProhibitedList] = useState<string[]>([
    'Harina de trigo', 
    'Pan dulce', 
    'Refrescos azucarados', 
    'Chucherías'
  ]);
  const [newProhibited, setNewProhibited] = useState('');
  const [medicalConditions, setMedicalConditions] = useState<string[]>([
    'Celiaquía diagnosticada'
  ]);
  const [foodPreferences, setFoodPreferences] = useState<string[]>([
    'Arepa reina pepiada',
    'Jugos naturales de frutas',
    'Pollo a la plancha'
  ]);
  const [newPreference, setNewPreference] = useState('');
  const [canteenFrequency, setCanteenFrequency] = useState('2_3_dias');
  const [dailySpendingLimitUSD, setDailySpendingLimitUSD] = useState(5.00);
  const [parentNotes, setParentNotes] = useState(
    'Por favor solo vender alimentos de maíz certificados o preparaciones libres de gluten.'
  );
  const [emergencyContact, setEmergencyContact] = useState('Dra. Mariana Gamboa (Mamá) - 0412-7778899');

  if (!isOpen) return null;

  const ALLERGEN_OPTIONS = [
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

  const handleToggleAllergen = (item: string) => {
    if (allergensList.includes(item)) {
      setAllergensList(allergensList.filter(a => a !== item));
    } else {
      setAllergensList([...allergensList, item]);
    }
  };

  const handleAddProhibited = () => {
    if (newProhibited.trim() && !prohibitedList.includes(newProhibited.trim())) {
      setProhibitedList([...prohibitedList, newProhibited.trim()]);
      setNewProhibited('');
    }
  };

  const handleRemoveProhibited = (index: number) => {
    setProhibitedList(prohibitedList.filter((_, i) => i !== index));
  };

  const handleAddPreference = () => {
    if (newPreference.trim() && !foodPreferences.includes(newPreference.trim())) {
      setFoodPreferences([...foodPreferences, newPreference.trim()]);
      setNewPreference('');
    }
  };

  const handleRemovePreference = (index: number) => {
    setFoodPreferences(foodPreferences.filter((_, i) => i !== index));
  };

  const handleFinishOnboarding = () => {
    CanteenService.completeParentOnboarding({
      parentEmail,
      parentName,
      parentCedula,
      parentPhone,
      parentRelationship,
      studentName,
      studentGrade,
      studentBarcode: studentBarcode.trim().toUpperCase(),
      prohibitedIngredients: prohibitedList,
      allergens: allergensList,
      medicalConditions,
      foodPreferences,
      canteenFrequency,
      dailySpendingLimitUSD,
      parentNotes,
      emergencyContact
    });

    setStep(4); // Success step
    onCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header with tricolor banner */}
        <div className="w-full flex h-1.5" aria-hidden="true">
          <div className="flex-1 bg-amber-400" />
          <div className="flex-1 bg-blue-700" />
          <div className="flex-1 bg-red-600" />
        </div>

        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-display text-sm text-white">
                Bienvenido a Mi Cantina · Registro y Ficha Nutricional
              </h3>
              <p className="text-[11px] text-stone-400">
                Paso {step} de 3 · Configuración de seguridad alimentaria del alumno
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard progress steps bar */}
        {step <= 3 && (
          <div className="bg-stone-100 px-6 py-2.5 border-b border-stone-200 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-2 font-medium ${step >= 1 ? 'text-stone-900 font-bold' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-amber-500 text-stone-950 font-bold' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-600'}`}>
                1
              </span>
              <span>Representante</span>
            </div>
            <span className="text-stone-300">→</span>
            <div className={`flex items-center gap-2 font-medium ${step >= 2 ? 'text-stone-900 font-bold' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-amber-500 text-stone-950 font-bold' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-600'}`}>
                2
              </span>
              <span>Estudiante</span>
            </div>
            <span className="text-stone-300">→</span>
            <div className={`flex items-center gap-2 font-medium ${step >= 3 ? 'text-stone-900 font-bold' : 'text-stone-400'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 3 ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-300 text-stone-600'}`}>
                3
              </span>
              <span>Encuesta Nutricional</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* STEP 1: Representante */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200/70 rounded-xl space-y-1">
                <p className="font-bold text-amber-950">Datos de Contacto del Representante Legal</p>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Esta información se vinculará con las notificaciones de WhatsApp y la conciliación de reportes de Pago Móvil o Zelle.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Nombre Completo del Representante</label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="Ej: Mariana Gamboa"
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Cédula de Identidad</label>
                  <input
                    type="text"
                    required
                    value={parentCedula}
                    onChange={(e) => setParentCedula(e.target.value)}
                    placeholder="Ej: V-18.452.109"
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Teléfono WhatsApp Activo</label>
                  <input
                    type="text"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+58 412-1234567"
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono"
                  />
                  <span className="text-[10px] text-stone-400 block">
                    Aquí se enviará el detalle de consumo y datos de pago.
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Parentesco con el Alumno</label>
                  <select
                    value={parentRelationship}
                    onChange={(e) => setParentRelationship(e.target.value as any)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="madre">Madre</option>
                    <option value="padre">Padre</option>
                    <option value="tutor">Tutor / Representante Legal</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Correo Electrónico Registrado</label>
                <input
                  type="email"
                  disabled
                  value={parentEmail}
                  className="w-full p-2.5 border border-stone-200 bg-stone-50 rounded-xl text-stone-500 font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Alumno */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-sky-50 border border-sky-200/70 rounded-xl space-y-1">
                <p className="font-bold text-sky-950">Datos del Alumno y Asignación de Carnet</p>
                <p className="text-sky-800 text-[11px] leading-relaxed">
                  El código de barras permitirá a la cantina escanear el carnet escolar en segundos y verificar que los alimentos sean aptos.
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Nombre Completo del Alumno</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej: Santiago González Gamboa"
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Grado y Sección Escolar</label>
                  <input
                    type="text"
                    required
                    value={studentGrade}
                    onChange={(e) => setStudentGrade(e.target.value)}
                    placeholder='Ej: 4to Grado "A"'
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Código de Carnet Escolar</label>
                  <input
                    type="text"
                    required
                    value={studentBarcode}
                    onChange={(e) => setStudentBarcode(e.target.value)}
                    placeholder="Ej: CANTINA-EST-101"
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              {/* Carnet Preview Card */}
              <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <span className="text-[11px] font-bold text-amber-400 font-display">MI CANTINA · CARNET ESCOLAR</span>
                  <span className="text-[10px] text-stone-400">Año 2026-2027</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{studentName || 'Nombre del Alumno'}</p>
                    <p className="text-xs text-stone-400">{studentGrade || 'Grado'}</p>
                    <p className="text-[11px] text-stone-500 mt-1">Rep: {parentName} ({parentCedula})</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block p-1 bg-white rounded-md">
                      <ScanLine className="w-8 h-8 text-stone-900" />
                    </div>
                    <p className="font-mono text-[10px] text-amber-300 mt-1">{studentBarcode}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Encuesta Nutricional y Hábitos */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200/70 rounded-xl space-y-1">
                <p className="font-bold text-red-950">Encuesta Nutricional y Restricciones Médicas</p>
                <p className="text-red-800 text-[11px] leading-relaxed">
                  Defina las restricciones que bloquearán automáticamente la venta en caja si el plato contiene algún ingrediente no permitido.
                </p>
              </div>

              {/* Allergens selection */}
              <div className="space-y-2">
                <label className="font-bold text-stone-800 block">
                  1. Alérgenos e Intolerancias Diagnosticadas
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {ALLERGEN_OPTIONS.map((alg) => {
                    const active = allergensList.includes(alg);
                    return (
                      <button
                        key={alg}
                        type="button"
                        onClick={() => handleToggleAllergen(alg)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          active
                            ? 'bg-red-600 text-white shadow-2xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {active ? `✓ ${alg}` : `+ ${alg}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Prohibited items */}
              <div className="space-y-2">
                <label className="font-bold text-stone-800 block">
                  2. Alimentos Prohibidos Expresamente por los Padres
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newProhibited}
                    onChange={(e) => setNewProhibited(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddProhibited())}
                    placeholder="Ej: Fritos excesivos, Mayonesa, Refrescos..."
                    className="flex-1 p-2 border border-stone-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddProhibited}
                    className="px-3 py-2 bg-stone-900 text-white rounded-lg font-semibold"
                  >
                    Agregar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {prohibitedList.map((item, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-900 border border-red-200 rounded-md text-xs font-medium"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProhibited(i)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Food preferences */}
              <div className="space-y-2">
                <label className="font-bold text-stone-800 block">
                  3. Preferencias de Alimentación Saludable del Alumno
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPreference())}
                    placeholder="Ej: Arepas de maíz blanco, Frutas picadas..."
                    className="flex-1 p-2 border border-stone-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddPreference}
                    className="px-3 py-2 bg-emerald-700 text-white rounded-lg font-semibold"
                  >
                    Agregar
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {foodPreferences.map((pref, i) => (
                    <span 
                      key={i} 
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-xs font-medium"
                    >
                      <span>{pref}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePreference(i)}
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Spending limit and frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Límite Diario de Consumo ($ USD)</label>
                  <input
                    type="number"
                    step="0.50"
                    value={dailySpendingLimitUSD}
                    onChange={(e) => setDailySpendingLimitUSD(Number(e.target.value) || 0)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                  />
                  <span className="text-[10px] text-stone-400">
                    ≈ {(dailySpendingLimitUSD * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2)} Bs por día escolar
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Frecuencia Permitida en Cantina</label>
                  <select
                    value={canteenFrequency}
                    onChange={(e) => setCanteenFrequency(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="diario">Diario (Todos los días escolares)</option>
                    <option value="2_3_dias">2 a 3 días por semana</option>
                    <option value="solo_viernes">Solo viernes especiales</option>
                    <option value="ocasional">Solo consumos ocasionales autorizados</option>
                  </select>
                </div>
              </div>

              {/* Parent notes & Emergency */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Instrucciones Especiales para la Cantinera</label>
                <textarea
                  rows={2}
                  value={parentNotes}
                  onChange={(e) => setParentNotes(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Contacto de Emergencia Médica</label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Success confirmation */}
          {step === 4 && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-stone-900 font-display">
                ¡Registro y Ficha Nutricional Completados!
              </h4>
              <p className="text-stone-600 max-w-md mx-auto leading-relaxed">
                El carnet <strong>{studentBarcode}</strong> de <strong>{studentName}</strong> ha sido activado con éxito. Ahora la cantina escolar validará automáticamente los alimentos con las restricciones médicas indicadas.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 bg-stone-900 text-white font-bold rounded-xl shadow-xs hover:bg-stone-800 transition-colors"
              >
                Acceder a Mi Cuenta y Menú
              </button>
            </div>
          )}
        </div>

        {/* Footer controls */}
        {step <= 3 && (
          <div className="px-6 py-3.5 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((step - 1) as any)}
                className="px-3.5 py-2 bg-white border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-50 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Anterior</span>
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((step + 1) as any)}
                className="px-4 py-2 bg-stone-900 text-white rounded-xl font-bold hover:bg-stone-800 transition-colors flex items-center gap-1.5"
              >
                <span>Continuar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finalizar y Activar Carnet Escolar</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
