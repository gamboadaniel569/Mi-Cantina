export type UserRole = 'admin' | 'teacher' | 'parent' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  cedula?: string; // V- o E-
  relationship?: 'madre' | 'padre' | 'tutor';
  studentBarcode?: string; // Código de carnet si es alumno o hijo asignado
  studentName?: string;
  studentGrade?: string;
  avatarUrl?: string;
  onboardingCompleted?: boolean;
}

export type FoodCategory = 
  | 'desayunos' 
  | 'almuerzos' 
  | 'snacks' 
  | 'bebidas' 
  | 'especial_saludable';

export type SpecialDietTag = 
  | 'sin_gluten' 
  | 'sin_harina' 
  | 'sin_azucar' 
  | 'vegetariano' 
  | 'sin_lactosa' 
  | 'alto_proteina';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: FoodCategory;
  priceUSD: number;
  available: boolean;
  imageUrl: string;
  ingredients: string[];
  allergens: string[];
  dietTags: SpecialDietTag[];
  isTeacherOption?: boolean;
  teacherOptionType?: 'opcion_a' | 'opcion_b'; // Opción Tradicional vs Saludable/Gourmet
  dayAvailable?: 'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'todos';
  calories?: number;
}

export interface NutritionalSurvey {
  studentId: string;
  studentName: string;
  barcode: string;
  grade: string;
  parentName?: string;
  parentCedula?: string;
  parentPhone?: string;
  parentRelationship?: 'madre' | 'padre' | 'tutor' | string;
  prohibitedIngredients: string[];
  allergens: string[];
  medicalConditions: string[];
  foodPreferences?: string[];
  dailySpendingLimitUSD?: number;
  canteenFrequency?: string; // 'diario' | '2_3_dias' | 'solo_viernes' | 'ocasional'
  parentNotes: string;
  emergencyContact: string;
  onboardingCompleted?: boolean;
  updatedAt: string;
}

export type PaymentStatus = 'pendiente' | 'reportado' | 'confirmado' | 'rechazado';

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPriceUSD: number;
  specialInstructions?: string;
}

export interface ConsumptionOrder {
  id: string;
  studentOrUserId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  userPhone: string;
  barcode?: string;
  date: string;
  dayOfWeek?: string;
  items: OrderItem[];
  totalUSD: number;
  totalVES: number;
  paymentStatus: PaymentStatus;
  nutritionalValidationStatus?: 'aprobado' | 'alerta_ignorada' | 'sin_restriccion';
  whatsappSent: boolean;
  createdAt: string;
}

export type PaymentMethod = 'pago_movil' | 'zelle' | 'transferencia_bancaria' | 'efectivo_usd';

export interface PaymentReport {
  id: string;
  orderId?: string;
  userId: string;
  userName: string;
  userPhone: string;
  amountUSD: number;
  amountVES: number;
  paymentMethod: PaymentMethod;
  referenceNumber: string;
  issuingBank: string;
  paymentDate: string;
  proofImageUrl?: string;
  status: PaymentStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface TeacherWeeklySelection {
  teacherId: string;
  weekStartDate: string;
  selections: {
    [day: string]: {
      menuItemId: string;
      dishName: string;
      optionType: 'opcion_a' | 'opcion_b';
      priceUSD: number;
      specialNotes?: string;
    };
  };
  totalUSD: number;
  confirmed: boolean;
}
