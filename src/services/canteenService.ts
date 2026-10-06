import { 
  MenuItem, 
  NutritionalSurvey, 
  ConsumptionOrder, 
  PaymentReport, 
  User, 
  TeacherWeeklySelection 
} from '../types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_NUTRITIONAL_SURVEYS, 
  INITIAL_ORDERS, 
  INITIAL_PAYMENT_REPORTS, 
  INITIAL_USERS,
  OFFICIAL_EXCHANGE_RATE_VES,
  AUTHORIZED_ADMIN_EMAILS
} from '../data/mockData';

const STORAGE_KEYS = {
  MENU: 'micantina_menu_items',
  SURVEYS: 'micantina_surveys',
  ORDERS: 'micantina_orders',
  PAYMENTS: 'micantina_payments',
  USERS: 'micantina_users',
  TEACHER_ORDERS: 'micantina_teacher_orders'
};

export interface NutritionalCheckResult {
  allowed: boolean;
  student: User | null;
  survey?: NutritionalSurvey;
  conflictReason?: string;
  conflictingElements: string[];
  safeIngredients: string[];
  recommendation?: string;
}

export class CanteenService {
  // --- USERS & AUTH ---
  static getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_USERS;
    }
  }

  static isAuthorizedAdmin(email: string): boolean {
    return AUTHORIZED_ADMIN_EMAILS.includes(email.trim().toLowerCase());
  }

  static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email.trim().toLowerCase() === email.trim().toLowerCase());
  }

  static saveUser(user: User): void {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static completeParentOnboarding(params: {
    parentEmail: string;
    parentName: string;
    parentCedula: string;
    parentPhone: string;
    parentRelationship: 'madre' | 'padre' | 'tutor';
    studentName: string;
    studentGrade: string;
    studentBarcode: string;
    prohibitedIngredients: string[];
    allergens: string[];
    medicalConditions: string[];
    foodPreferences: string[];
    canteenFrequency: string;
    dailySpendingLimitUSD: number;
    parentNotes: string;
    emergencyContact: string;
  }): { parent: User; student: User; survey: NutritionalSurvey } {
    const users = this.getUsers();
    let parent = users.find(u => u.email.toLowerCase() === params.parentEmail.toLowerCase());
    
    if (parent) {
      parent.name = params.parentName;
      parent.cedula = params.parentCedula;
      parent.phone = params.parentPhone;
      parent.relationship = params.parentRelationship;
      parent.studentBarcode = params.studentBarcode;
      parent.studentName = params.studentName;
      parent.studentGrade = params.studentGrade;
      parent.onboardingCompleted = true;
    } else {
      parent = {
        id: `user-parent-${Date.now()}`,
        email: params.parentEmail,
        name: params.parentName,
        role: 'parent',
        phone: params.parentPhone,
        cedula: params.parentCedula,
        relationship: params.parentRelationship,
        studentBarcode: params.studentBarcode,
        studentName: params.studentName,
        studentGrade: params.studentGrade,
        onboardingCompleted: true
      };
      users.push(parent);
    }

    // Ensure student record exists
    let student = users.find(u => u.studentBarcode === params.studentBarcode);
    if (!student) {
      student = {
        id: `user-student-${Date.now()}`,
        email: `${params.studentName.toLowerCase().replace(/\s+/g, '.')}@colegio.edu.ve`,
        name: params.studentName,
        role: 'student',
        studentBarcode: params.studentBarcode,
        studentGrade: params.studentGrade,
        phone: params.parentPhone
      };
      users.push(student);
    } else {
      student.name = params.studentName;
      student.studentGrade = params.studentGrade;
    }

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Create / Update survey
    const newSurvey: NutritionalSurvey = {
      studentId: student.id,
      studentName: params.studentName,
      barcode: params.studentBarcode,
      grade: params.studentGrade,
      parentName: params.parentName,
      parentCedula: params.parentCedula,
      parentPhone: params.parentPhone,
      parentRelationship: params.parentRelationship,
      prohibitedIngredients: params.prohibitedIngredients,
      allergens: params.allergens,
      medicalConditions: params.medicalConditions,
      foodPreferences: params.foodPreferences,
      canteenFrequency: params.canteenFrequency,
      dailySpendingLimitUSD: params.dailySpendingLimitUSD,
      parentNotes: params.parentNotes,
      emergencyContact: params.emergencyContact,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    this.saveSurvey(newSurvey);

    return { parent, student, survey: newSurvey };
  }

  // --- MENU CRUD ---
  static getMenuItems(): MenuItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU_ITEMS));
      return INITIAL_MENU_ITEMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MENU_ITEMS;
    }
  }

  static saveMenuItem(item: MenuItem): void {
    const items = this.getMenuItems();
    const existingIndex = items.findIndex(i => i.id === item.id);
    if (existingIndex >= 0) {
      items[existingIndex] = item;
    } else {
      items.unshift(item);
    }
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
  }

  static deleteMenuItem(id: string): void {
    const items = this.getMenuItems().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
  }

  // --- NUTRITIONAL SURVEYS ---
  static getSurveys(): NutritionalSurvey[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SURVEYS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(INITIAL_NUTRITIONAL_SURVEYS));
      return INITIAL_NUTRITIONAL_SURVEYS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_NUTRITIONAL_SURVEYS;
    }
  }

  static getSurveyByStudentBarcode(barcode: string): NutritionalSurvey | undefined {
    const surveys = this.getSurveys();
    return surveys.find(s => s.barcode.trim().toUpperCase() === barcode.trim().toUpperCase());
  }

  static saveSurvey(survey: NutritionalSurvey): void {
    const surveys = this.getSurveys();
    const index = surveys.findIndex(s => s.barcode === survey.barcode);
    if (index >= 0) {
      surveys[index] = survey;
    } else {
      surveys.push(survey);
    }
    localStorage.setItem(STORAGE_KEYS.SURVEYS, JSON.stringify(surveys));
  }

  // --- BARCODE SCAN & NUTRITIONAL VALIDATION ENGINE ---
  static validateNutritionalSafety(barcode: string, menuItem: MenuItem): NutritionalCheckResult {
    const cleanBarcode = barcode.trim().toUpperCase();
    const users = this.getUsers();
    const student = users.find(u => u.studentBarcode?.trim().toUpperCase() === cleanBarcode) || null;

    if (!student) {
      return {
        allowed: false,
        student: null,
        conflictingElements: [],
        safeIngredients: [],
        conflictReason: `No se encontró ningún estudiante registrado con el código de carnet: "${cleanBarcode}". Verifique el carnet escolar.`
      };
    }

    const survey = this.getSurveyByStudentBarcode(cleanBarcode);
    if (!survey) {
      return {
        allowed: true,
        student,
        conflictingElements: [],
        safeIngredients: menuItem.ingredients,
        recommendation: 'El estudiante no posee restricciones registradas en su ficha médica. Venta autorizada estándar.'
      };
    }

    // 1. Cross-check against prohibited ingredients
    const prohibitedMatches: string[] = [];
    const itemIngredientsLower = menuItem.ingredients.map(i => i.toLowerCase());
    const itemAllergensLower = menuItem.allergens.map(a => a.toLowerCase());

    for (const prohibited of survey.prohibitedIngredients) {
      const pLow = prohibited.toLowerCase().trim();
      // Check ingredient containment
      const directIng = itemIngredientsLower.some(ing => ing.includes(pLow) || pLow.includes(ing));
      const directAllergen = itemAllergensLower.some(alg => alg.includes(pLow) || pLow.includes(alg));
      
      // Special rule: If prohibited mentions "gluten" or "trigo", check if the dish contains gluten
      if ((pLow.includes('gluten') || pLow.includes('trigo') || pLow.includes('harina de trigo')) && 
          !menuItem.dietTags.includes('sin_gluten') && 
          (itemIngredientsLower.some(i => i.includes('trigo') || i.includes('gluten') || i.includes('pasta')) || 
           itemAllergensLower.some(a => a.includes('gluten')))) {
        if (!prohibitedMatches.includes(prohibited)) prohibitedMatches.push(prohibited);
      } else if (directIng || directAllergen) {
        if (!prohibitedMatches.includes(prohibited)) prohibitedMatches.push(prohibited);
      }
    }

    // 2. Cross-check against medical allergens
    for (const allergen of survey.allergens) {
      const aLow = allergen.toLowerCase().trim();
      const matchInItem = itemAllergensLower.some(itemAlg => itemAlg.includes(aLow) || aLow.includes(itemAlg));
      const matchInIng = itemIngredientsLower.some(ing => ing.includes(aLow) || aLow.includes(ing));
      
      if (matchInItem || matchInIng) {
        if (!prohibitedMatches.includes(allergen)) prohibitedMatches.push(allergen);
      }
    }

    if (prohibitedMatches.length > 0) {
      return {
        allowed: false,
        student,
        survey,
        conflictingElements: prohibitedMatches,
        safeIngredients: menuItem.ingredients.filter(ing => 
          !prohibitedMatches.some(p => ing.toLowerCase().includes(p.toLowerCase()))
        ),
        conflictReason: `⚠️ ALERTA NUTRICIONAL BLOQUEANTE: El estudiante tiene expresamente prohibido consumir: [${prohibitedMatches.join(', ')}]. Este plato contiene componentes no aptos.`
      };
    }

    return {
      allowed: true,
      student,
      survey,
      conflictingElements: [],
      safeIngredients: menuItem.ingredients,
      recommendation: `✅ Plato seguro. Cumple al 100% las indicaciones de la encuesta nutricional del alumno (${student.name}).`
    };
  }

  // --- ORDERS ---
  static getOrders(): ConsumptionOrder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  static createOrder(order: ConsumptionOrder): void {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }

  static updateOrderStatus(orderId: string, status: ConsumptionOrder['paymentStatus']): void {
    const orders = this.getOrders();
    const target = orders.find(o => o.id === orderId);
    if (target) {
      target.paymentStatus = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  }

  // --- PAYMENTS ---
  static getPayments(): PaymentReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENT_REPORTS));
      return INITIAL_PAYMENT_REPORTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PAYMENT_REPORTS;
    }
  }

  static reportPayment(report: PaymentReport): void {
    const payments = this.getPayments();
    payments.unshift(report);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

    // Also update referenced order if available
    if (report.orderId) {
      this.updateOrderStatus(report.orderId, 'reportado');
    }
  }

  static updatePaymentStatus(paymentId: string, status: PaymentReport['status'], adminNotes?: string): void {
    const payments = this.getPayments();
    const target = payments.find(p => p.id === paymentId);
    if (target) {
      target.status = status;
      if (adminNotes) target.adminNotes = adminNotes;
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

      if (target.orderId && status === 'confirmado') {
        this.updateOrderStatus(target.orderId, 'confirmado');
      }
    }
  }

  // --- TEACHER PRE-ORDER SELECTIONS ---
  static getTeacherSelections(teacherId: string): TeacherWeeklySelection | null {
    const raw = localStorage.getItem(`${STORAGE_KEYS.TEACHER_ORDERS}_${teacherId}`);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static saveTeacherSelections(selection: TeacherWeeklySelection): void {
    localStorage.setItem(`${STORAGE_KEYS.TEACHER_ORDERS}_${selection.teacherId}`, JSON.stringify(selection));
  }

  // --- WHATSAPP MESSAGE FORMATTER ---
  static generateWhatsAppMessage(order: ConsumptionOrder): string {
    const itemsList = order.items
      .map(i => `• ${i.quantity}x ${i.name} - $${(i.unitPriceUSD * i.quantity).toFixed(2)}`)
      .join('\n');

    const totalBs = (order.totalUSD * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2);

    return `🇻🇪 *MI CANTINA ESCOLAR* - Detalle de Consumo 🇻🇪\n\n` +
      `Estimado representante de *${order.userName}*:\n` +
      `Compartimos el resumen de consumo escolar para su revisión y conciliación:\n\n` +
      `📋 *Orden:* #${order.id}\n` +
      `📅 *Fecha:* ${order.date} (${order.dayOfWeek || 'Semana escolar'})\n\n` +
      `🍴 *Detalle del Consumo:*\n${itemsList}\n\n` +
      `💵 *Total en Dólares:* $${order.totalUSD.toFixed(2)} USD\n` +
      `🇻🇪 *Total en Bolívares:* ${totalBs} Bs (Tasa BCV: ${OFFICIAL_EXCHANGE_RATE_VES} Bs/$)\n\n` +
      `💳 *Datos para Reporte de Pago Móvil / Transferencia:*\n` +
      `• Banco: Banesco Banco Universal (0134)\n` +
      `• Teléfono: 0412-1234567\n` +
      `• RIF: J-40192837-1\n` +
      `• Titular: Mi Cantina Escolar C.A.\n\n` +
      `Por favor reporte su pago adjuntando el comprobante y número de referencia en la aplicación o respondiendo a este mensaje.\n¡Gracias por su confianza!`;
  }

  static getWhatsAppLink(phone: string, message: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  }
}
