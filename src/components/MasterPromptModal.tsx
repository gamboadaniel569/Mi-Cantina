import { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  X, 
  Database, 
  ShieldCheck, 
  Layers, 
  Code2 
} from 'lucide-react';

interface MasterPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MasterPromptModal({ isOpen, onClose }: MasterPromptModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'prompt' | 'firestore' | 'rules' | 'fewshot'>('prompt');

  if (!isOpen) return null;

  const MASTER_PROMPT_TEXT = `# PROMPT DE INGENIERÍA MAESTRO Y REPRODUCIBLE
# APLICACIÓN: "MI CANTINA" (VENEZUELA) - ARQUITECTURA FULL-STACK

## 1. CONTEXTO OPERATIVO Y ALCANCE DEL SISTEMA
Desarrolla una aplicación full-stack web y móvil llamada "Mi Cantina", con identidad visual centrada en el tricolor de la bandera de Venezuela y tipografía gastronómica de alta legibilidad. La solución digitaliza la operación de una cantina escolar venezolana mediante cuatro pilares:
1. Autenticación con Firebase Auth y control de acceso estricto (RBAC).
2. Control nutricional preventivo y cruce instantáneo con escáner de código de barras del carnet escolar.
3. Gestión de consumos escolares, conciliación bancaria y despacho automático de notificaciones por WhatsApp.
4. E-commerce gastronómico anticipado con doble menú (Opción A Tradicional vs Opción B Saludable/Gourmet) para el cuerpo docente.

---

## MÓDULO A: ARQUITECTURA DE BASE DE DATOS Y ESQUEMA FIRESTORE

### 1. Colección \`users\`
- \`id\` (string, UID de Firebase Auth): Identificador único del usuario.
- \`email\` (string): Correo electrónico del usuario.
- \`name\` (string): Nombre y apellido del usuario / representante.
- \`role\` (string): "admin" | "teacher" | "parent" | "student".
- \`phone\` (string): Teléfono WhatsApp activo (+58412...).
- \`cedula\` (string, opcional): Cédula de identidad venezolana (ej: "V-18.452.109").
- \`relationship\` (string, opcional): "madre" | "padre" | "tutor".
- \`studentBarcode\` (string, opcional): Código de barras único del carnet escolar (ej: "CANTINA-EST-101").
- \`studentName\` (string, opcional): Nombre del alumno representado.
- \`studentGrade\` (string, opcional): Grado y sección escolar (ej: "4to Grado A").
- \`onboardingCompleted\` (boolean): Indica si el representante completó el registro inicial.
- \`createdAt\` (timestamp).

### 2. Colección \`menu_items\`
- \`id\` (string): ID del ítem.
- \`name\` (string): Nombre del plato (ej: "Arepa Reina Pepiada", "Pabellón Criollo", "Tequeños").
- \`description\` (string): Descripción gastronómica y textura.
- \`category\` (string): "desayunos" | "almuerzos" | "snacks" | "bebidas" | "especial_saludable".
- \`priceUSD\` (number): Precio en dólares estadounidenses.
- \`available\` (boolean): Disponibilidad en cantina.
- \`imageUrl\` (string): URL pública de la fotografía del plato en Storage.
- \`ingredients\` (array de strings): Lista completa de ingredientes para validación de alergias.
- \`allergens\` (array de strings): ["Gluten", "Lácteos", "Huevo", "Maní", "Mariscos"].
- \`dietTags\` (array de strings): ["sin_gluten", "sin_harina", "sin_azucar", "alto_proteina"].
- \`isTeacherOption\` (boolean): Indicador si pertenece al menú docente.
- \`teacherOptionType\` (string, opcional): "opcion_a" | "opcion_b".
- \`dayAvailable\` (string, opcional): "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "todos".

### 3. Colección \`nutritional_surveys\`
- Document ID: Igual al UID del estudiante o referenciado por su código de carnet.
- \`studentId\` (string): Referencia al usuario estudiante.
- \`studentName\` (string): Nombre del alumno.
- \`barcode\` (string): Código de barras del carnet escolar indexado para búsqueda ultrarrápida.
- \`grade\` (string): Grado y sección escolar.
- \`parentName\` (string): Nombre del representante que responde la encuesta.
- \`parentCedula\` (string): Cédula de identidad venezolana.
- \`parentPhone\` (string): Teléfono WhatsApp para notificaciones.
- \`parentRelationship\` (string): Parentesco ("madre", "padre", "tutor").
- \`prohibitedIngredients\` (array de strings): Ingredientes expresamente prohibidos por los padres.
- \`allergens\` (array de strings): Alérgenos médicos diagnosticados.
- \`medicalConditions\` (array de strings): Diagnósticos (celiaquía, diabetes, etc.).
- \`foodPreferences\` (array de strings): Preferencias alimentarias y meriendas favoritas del alumno.
- \`canteenFrequency\` (string): Frecuencia permitida ("diario", "2_3_dias", "solo_viernes", "ocasional").
- \`dailySpendingLimitUSD\` (number): Límite diario de gasto escolar en USD (convertible a Bs).
- \`parentNotes\` (string): Instrucciones libres del representante para la cantinera.
- \`emergencyContact\` (string): Nombre y teléfono para emergencias médicas.
- \`onboardingCompleted\` (boolean): Estado del onboarding de ingreso.
- \`updatedAt\` (timestamp).

### 4. Colección \`orders\`
- \`id\` (string): Identificador de la orden (ej: "ORD-2026-001").
- \`studentOrUserId\` (string): UID del alumno o docente.
- \`userName\` (string): Nombre del consumidor.
- \`barcode\` (string, opcional): Código del carnet escaneado al momento de la venta.
- \`date\` (string): Fecha del consumo en formato YYYY-MM-DD.
- \`items\` (array de objetos):
  - \`menuItemId\` (string)
  - \`name\` (string)
  - \`quantity\` (number)
  - \`unitPriceUSD\` (number)
- \`totalUSD\` (number): Total en dólares.
- \`totalVES\` (number): Total convertido en bolívares según tasa oficial BCV.
- \`paymentStatus\` (string): "pendiente" | "reportado" | "confirmado".
- \`nutritionalValidationStatus\` (string): "aprobado" | "alerta_ignorada" | "sin_restriccion".
- \`whatsappSent\` (boolean): Bandera de despacho del detalle de la orden.
- \`createdAt\` (timestamp).

### 5. Colección \`payments\`
- \`id\` (string): ID del comprobante (ej: "PAY-2026-881").
- \`orderId\` (string, opcional): Referencia a la orden cancelada.
- \`userId\` (string): UID del padre o docente que reporta el pago.
- \`amountUSD\` (number): Monto transferido equivalente en USD.
- \`amountVES\` (number): Monto exacto transferido en Bolívares.
- \`paymentMethod\` (string): "pago_movil" | "zelle" | "transferencia_bancaria" | "efectivo_usd".
- \`referenceNumber\` (string): Número de confirmación o últimos dígitos de referencia.
- \`issuingBank\` (string): Banco emisor (ej: "Banesco Banco Universal", "Banco Mercantil").
- \`paymentDate\` (string): Fecha de la transacción bancaria.
- \`proofImageUrl\` (string, opcional): URL del capture del comprobante en Firebase Storage.
- \`status\` (string): "reportado" | "confirmado" | "rechazado".
- \`adminNotes\` (string, opcional): Observaciones de la conciliación bancaria.
- \`createdAt\` (timestamp).

---

## MÓDULO B: CONFIGURACIÓN DE SEGURIDAD Y REGLAS FIREBASE

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función auxiliar para administradores estrictos
    function isSuperAdmin() {
      return request.auth != null && 
        (request.auth.token.email == "cardenas.gamboa@gmail.com" || 
         request.auth.token.email == "chagolopez@gmail.com");
    }

    function isAuthenticated() {
      return request.auth != null;
    }

    // Colección users: cada usuario lee su propio perfil, superadmins administran todos
    match /users/{userId} {
      allow read: if isAuthenticated() && (request.auth.uid == userId || isSuperAdmin());
      allow write: if isSuperAdmin();
    }

    // Colección menu_items: lectura pública para usuarios autenticados, CRUD exclusivo de admin
    match /menu_items/{itemId} {
      allow read: if isAuthenticated();
      allow write: if isSuperAdmin();
    }

    // Colección nutritional_surveys: padres escriben la de sus hijos, admins leen todas para el escáner
    match /nutritional_surveys/{surveyId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && (request.auth.uid == surveyId || isSuperAdmin());
    }

    // Colección orders: usuario ve sus consumos, solo admin crea mediante el escáner y concilia
    match /orders/{orderId} {
      allow read: if isAuthenticated() && (resource.data.studentOrUserId == request.auth.uid || isSuperAdmin());
      allow create, update, delete: if isSuperAdmin();
    }

    // Colección payments: usuarios reportan comprobantes de sus consumos, admins aprueban
    match /payments/{paymentId} {
      allow read: if isAuthenticated() && (resource.data.userId == request.auth.uid || isSuperAdmin());
      allow create: if isAuthenticated();
      allow update, delete: if isSuperAdmin();
    }
  }
}
\`\`\`

---

## MÓDULO C: ESPECIFICACIÓN DE VISTAS Y COMPONENTES FRONTEND (UI/UX)
1. **Identidad Visual**: Tricolor venezolano en la barra superior (amarillo, azul con arco de 8 estrellas, rojo) con tipografía editorial Display para encabezados y sans-serif balanceada para métricas tabulares.
2. **Flujo de Onboarding Inicial para Padres (Primera Entrada tras Login)**:
   - **Paso 1: Datos Básicos del Representante**: Nombre, cédula de identidad venezolana (V-/E-), WhatsApp activo para notificaciones y parentesco (madre, padre, tutor).
   - **Paso 2: Datos del Estudiante y Carnet**: Nombre completo del alumno, grado y sección, código de carnet escolar único y vista previa de carnet digital con código de barras.
   - **Paso 3: Ficha Nutricional y Encuesta de Hábitos Alimenticios**:
     - Alérgenos e intolerancias diagnosticadas (Gluten, Lácteos, Maní, etc.).
     - Alimentos expresamente prohibidos por los padres (chucherías, refrescos, fritos, salsas).
     - Preferencias de alimentación saludable (arepas, frutas frescas, jugos naturales).
     - Límite diario de gasto escolar en USD / Bs y frecuencia permitida en cantina.
     - Instrucciones especiales para la cantinera y contacto de emergencia médica.
3. **Vista de Usuario (Padres y Alumnos)**: 
   - Balance global ($ USD y Bs al cambio BCV).
   - Tabla de consumo diario con desglose de ítems, precios y estatus de pago.
   - Botón directo de despacho por WhatsApp con enlace oficial pre-formateado.
   - Modal de Reporte de Pago con selector de banco venezolano (Banesco, Mercantil, BDV), número de referencia y adjunto de comprobante.
   - Formulario de Encuesta Nutricional con alérgenos médicos y alimentos expresamente prohibidos.
4. **Módulo Docente (E-Commerce Gastronómico Anticipado)**:
   - Selector interactivo de Lunes a Viernes.
   - Doble menú por día: Opción A (Criolla Tradicional) vs Opción B (Saludable/Gourmet sin gluten/azúcar).
   - Carrito semanal con confirmación anticipada para planificación de cocina.
4. **Vista de Administrador (Superadmin)**:
   - Acceso restringido a \`cardenas.gamboa@gmail.com\` y \`chagolopez@gmail.com\`.
   - Conciliación de comprobantes de pago (Aprobar / Rechazar).
   - Despacho de facturación por WhatsApp.
   - CRUD de platos con fotos, costos, ingredientes para cruce médico.
   - Escáner de código de barras con cruce preventivo en tiempo real.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold font-display text-sm text-white">
                Prompt de Ingeniería Maestro y Especificación Técnica
              </h3>
              <p className="text-[11px] text-stone-400">
                Arquitectura de base de datos Firestore, Security Rules y Frontend para "Mi Cantina"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado al portapapeles' : 'Copiar Prompt'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 font-mono text-xs text-stone-800 bg-stone-50 leading-relaxed select-text">
          <pre className="whitespace-pre-wrap font-sans bg-white p-5 rounded-xl border border-stone-200 shadow-2xs overflow-x-auto">
            {MASTER_PROMPT_TEXT}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Entregable Arquitectónico: Módulo A, B, C y Few-Shot Pattern</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 transition-colors"
          >
            Cerrar Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
