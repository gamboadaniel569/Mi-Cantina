/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  ScanLine, 
  Sparkles, 
  HeartPulse, 
  UtensilsCrossed, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  FileCode,
  DollarSign,
  Coffee,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  UserRole, 
  MenuItem, 
  ConsumptionOrder, 
  PaymentReport,
  NutritionalSurvey 
} from './types';
import { CanteenService } from './services/canteenService';
import { Header } from './components/Header';
import { WeeklyMenuView } from './components/WeeklyMenuView';
import { TeacherEcommerceMenu } from './components/TeacherEcommerceMenu';
import { NutritionalSurveyView } from './components/NutritionalSurveyView';
import { StudentHistoryAndWhatsApp } from './components/StudentHistoryAndWhatsApp';
import { AdminPanel } from './components/AdminPanel';
import { BarcodeScannerModal } from './components/BarcodeScannerModal';
import { MasterPromptModal } from './components/MasterPromptModal';
import { ParentOnboardingModal } from './components/ParentOnboardingModal';
import { OFFICIAL_EXCHANGE_RATE_VES } from './data/mockData';

export default function App() {
  // Current user / role simulation state
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentEmail, setCurrentEmail] = useState<string>('cardenas.gamboa@gmail.com');
  const [activeTab, setActiveTab] = useState<'menu' | 'profesores' | 'nutricion' | 'cuenta' | 'admin'>('menu');

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isPromptDocOpen, setIsPromptDocOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Reactive data states from CanteenService
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<ConsumptionOrder[]>([]);
  const [payments, setPayments] = useState<PaymentReport[]>([]);

  const loadData = () => {
    setMenuItems(CanteenService.getMenuItems());
    setOrders(CanteenService.getOrders());
    setPayments(CanteenService.getPayments());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = (newRole: UserRole, newEmail: string) => {
    setCurrentRole(newRole);
    setCurrentEmail(newEmail);
    // Sensible default tab based on role
    if (newRole === 'admin') setActiveTab('admin');
    else if (newRole === 'teacher') setActiveTab('profesores');
    else if (newRole === 'parent' || newRole === 'student') setActiveTab('cuenta');
  };

  const handleOrderCreated = (newOrder: ConsumptionOrder) => {
    loadData();
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* Top Bar with Venezuelan Flag stripe */}
      <Header
        currentRole={currentRole}
        currentEmail={currentEmail}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenPromptDoc={() => setIsPromptDocOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Hero Canteen Billboard (shown on menu or home view) */}
        {activeTab === 'menu' && (
          <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-6 sm:p-8 border border-stone-800 shadow-xl">
            {/* Background Venezuelan aesthetic lighting */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-40 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider">
                  🇻🇪 Cantina Escolar
                </span>
                <span className="text-xs text-stone-300">
                  Tasa Oficial BCV: <strong>{OFFICIAL_EXCHANGE_RATE_VES} Bs / USD</strong>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white leading-tight">
                Alimentación escolar segura, criolla y balanceada
              </h1>

              <p className="text-stone-300 text-sm leading-relaxed">
                Sistema integral con control de alérgenos por código de barras de carnet, reporte de pagos en bolívares y dólares por WhatsApp, y selección anticipada gourmet para docentes.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="py-2.5 px-5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <ScanLine className="w-4 h-4" />
                  <span>Escanear Carnet del Alumno</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('profesores')}
                  className="py-2.5 px-4 bg-stone-800 hover:bg-stone-700 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                  <span>Menú Docentes (Opción A y B)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPromptDocOpen(true)}
                  className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-stone-200 font-medium text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <FileCode className="w-3.5 h-3.5 text-amber-300" />
                  <span>Prompt Maestro & Firestore</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Onboarding Callout for Parents */}
        {currentRole === 'parent' && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-bold text-stone-900">
                  Ficha Médica y Encuesta de Alimentación del Alumno
                </p>
                <p className="text-stone-600 text-[11px]">
                  Complete los datos básicos del representante, carnet del niño y la encuesta de alimentos permitidos.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOnboardingOpen(true)}
              className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Abrir Encuesta de Ingreso</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* View Tabs Switching */}
        {activeTab === 'menu' && (
          <WeeklyMenuView 
            menuItems={menuItems} 
            onOpenScanner={() => setIsScannerOpen(true)} 
          />
        )}

        {activeTab === 'profesores' && (
          <TeacherEcommerceMenu
            teacherId={currentRole === 'teacher' ? 'user-teacher-1' : 'user-teacher-1'}
            teacherName={currentRole === 'teacher' ? 'Prof. Carlos Mendoza' : 'Prof. Carlos Mendoza (Vista Docente)'}
            menuItems={menuItems}
          />
        )}

        {activeTab === 'nutricion' && (
          <NutritionalSurveyView
            currentStudentBarcode="CANTINA-EST-101"
            onSurveyUpdated={loadData}
          />
        )}

        {activeTab === 'cuenta' && (
          <StudentHistoryAndWhatsApp
            studentOrParentName="Mariana Gamboa"
            studentBarcode="CANTINA-EST-101"
            userPhone="+584127778899"
            orders={orders}
            payments={payments}
            onPaymentReported={loadData}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            currentAdminEmail={currentEmail}
            menuItems={menuItems}
            orders={orders}
            payments={payments}
            onOpenScanner={() => setIsScannerOpen(true)}
            onMenuUpdated={loadData}
            onPaymentsUpdated={loadData}
          />
        )}
      </main>

      {/* Parent Initial Onboarding Modal */}
      <ParentOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        parentEmail={currentEmail}
        onCompleted={loadData}
      />

      {/* Barcode Scanner Modal with live nutritional allergy check */}
      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        menuItems={menuItems}
        onOrderCreated={handleOrderCreated}
      />

      {/* Master Prompt & Architecture Blueprint Modal */}
      <MasterPromptModal
        isOpen={isPromptDocOpen}
        onClose={() => setIsPromptDocOpen(false)}
      />

      {/* Anti-slop clean footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 font-display">Mi Cantina Escolar</span>
            <span>·</span>
            <span>República Bolivariana de Venezuela</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <button 
              type="button" 
              onClick={() => setIsPromptDocOpen(true)} 
              className="hover:text-stone-900 underline font-medium"
            >
              Documento de Arquitectura y Prompt Maestro
            </button>
            <span>·</span>
            <span>Admins autorizados: cardenas.gamboa@gmail.com, chagolopez@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
