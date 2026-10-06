import { 
  User, 
  MenuItem, 
  NutritionalSurvey, 
  ConsumptionOrder, 
  PaymentReport 
} from '../types';

export const OFFICIAL_EXCHANGE_RATE_VES = 60.50; // Tasa oficial BCV Bs/USD

export const AUTHORIZED_ADMIN_EMAILS = [
  'cardenas.gamboa@gmail.com',
  'chagolopez@gmail.com'
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Daniel Cárdenas Gamboa',
    email: 'cardenas.gamboa@gmail.com',
    role: 'admin',
    phone: '+584121234567',
  },
  {
    id: 'user-admin-2',
    name: 'Santiago López (Chago)',
    email: 'chagolopez@gmail.com',
    role: 'admin',
    phone: '+584149876543',
  },
  {
    id: 'user-teacher-1',
    name: 'Prof. Carlos Mendoza',
    email: 'carlos.mendoza@colegio.edu.ve',
    role: 'teacher',
    phone: '+584245551234',
  },
  {
    id: 'user-parent-1',
    name: 'Mariana Gamboa (Mamá de Santiago)',
    email: 'mariana.gamboa@gmail.com',
    role: 'parent',
    phone: '+584127778899',
    studentBarcode: 'CANTINA-EST-101',
    studentGrade: '4to Grado "A"',
  },
  {
    id: 'user-student-1',
    name: 'Santiago González Gamboa',
    email: 'santiago.est@colegio.edu.ve',
    role: 'student',
    studentBarcode: 'CANTINA-EST-101',
    studentGrade: '4to Grado "A"',
  },
  {
    id: 'user-student-2',
    name: 'Valeria López Mendoza',
    email: 'valeria.est@colegio.edu.ve',
    role: 'student',
    studentBarcode: 'CANTINA-EST-102',
    studentGrade: '6to Grado "B"',
  },
  {
    id: 'user-student-3',
    name: 'Mateo Rivas Bolívar',
    email: 'mateo.est@colegio.edu.ve',
    role: 'student',
    studentBarcode: 'CANTINA-EST-103',
    studentGrade: '2do Grado "C"',
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-arepa-reina',
    name: 'Arepa Reina Pepiada Tradicional',
    description: 'Masa de maíz tostada rellena de ensalada de pollo desmechado, aguacate maduro y un toque ligero de mayonesa criolla.',
    category: 'desayunos',
    priceUSD: 3.50,
    available: true,
    imageUrl: '/src/assets/images/arepas_venezolanas_1791320862796.jpg',
    ingredients: ['Harina de maíz blanco', 'Pollo desmechado', 'Aguacate', 'Mayonesa', 'Sal'],
    allergens: ['Huevo (mayonesa)'],
    dietTags: ['sin_gluten'],
    isTeacherOption: false,
    calories: 420
  },
  {
    id: 'item-tequenos-racion',
    name: 'Ración de Tequeños Dorados (5 uds)',
    description: 'Palitos crujientes de masa de trigo artesanal rellenos de auténtico queso blanco semiduro llanero.',
    category: 'snacks',
    priceUSD: 3.00,
    available: true,
    imageUrl: '/src/assets/images/tequenos_crujientes_1791320873939.jpg',
    ingredients: ['Harina de trigo (Gluten)', 'Queso blanco pasteurizado', 'Mantequilla', 'Huevo', 'Sal', 'Aceite vegetal'],
    allergens: ['Gluten', 'Lácteos', 'Huevo'],
    dietTags: [],
    isTeacherOption: false,
    calories: 380
  },
  {
    id: 'item-pabellon-escolar',
    name: 'Pabellón Criollo Escolar Balanceado',
    description: 'Arroz blanco al vapor, caraotas negras guisadas, carne de res mechada en sofrito criollo y tajadas de plátano maduro horneadas.',
    category: 'almuerzos',
    priceUSD: 5.50,
    available: true,
    imageUrl: '/src/assets/images/pabellon_escolar_1791320882343.jpg',
    ingredients: ['Carne de res mechada', 'Caraotas negras', 'Arroz blanco', 'Plátano maduro', 'Cebolla', 'Pimentón', 'Ajo'],
    allergens: [],
    dietTags: ['sin_gluten', 'alto_proteina'],
    isTeacherOption: true,
    teacherOptionType: 'opcion_a',
    dayAvailable: 'lunes',
    calories: 590
  },
  {
    id: 'item-bowl-glutenfree',
    name: 'Bowl Proteico Vital (Sin Gluten / Sin Azúcar)',
    description: 'Pechuga de pollo a la plancha marinada con finas hierbas, quinoa real, cubos de aguacate, tomates cherry y mix verde fresco con vinagreta de limón.',
    category: 'especial_saludable',
    priceUSD: 6.00,
    available: true,
    imageUrl: '/src/assets/images/bowl_saludable_glutenfree_1791320891726.jpg',
    ingredients: ['Pechuga de pollo a la plancha', 'Quinoa', 'Aguacate', 'Tomates cherry', 'Lechuga romana', 'Aceite de oliva virgen extra', 'Limón'],
    allergens: [],
    dietTags: ['sin_gluten', 'sin_harina', 'sin_azucar', 'alto_proteina'],
    isTeacherOption: true,
    teacherOptionType: 'opcion_b',
    dayAvailable: 'lunes',
    calories: 430
  },
  {
    id: 'item-empanada-queso',
    name: 'Empanada Criolla de Queso Llanero',
    description: 'Masa de maíz precocida con toque dorado y crujiente rellena de queso blanco rallado.',
    category: 'desayunos',
    priceUSD: 2.00,
    available: true,
    imageUrl: '/src/assets/images/arepas_venezolanas_1791320862796.jpg',
    ingredients: ['Harina de maíz blanco', 'Queso blanco', 'Papelón (toque)', 'Sal', 'Aceite vegetal'],
    allergens: ['Lácteos'],
    dietTags: ['sin_gluten'],
    calories: 320
  },
  {
    id: 'item-prof-martes-a',
    name: 'Pasticho Casero Tradicional (Opción A Docente)',
    description: 'Láminas de pasta al dente con salsa boloñesa de carne magra, bechamel cremosa y queso parmesano gratinado.',
    category: 'almuerzos',
    priceUSD: 5.50,
    available: true,
    imageUrl: '/src/assets/images/pabellon_escolar_1791320882343.jpg',
    ingredients: ['Pasta de trigo', 'Carne molida de res', 'Tomate', 'Leche entera', 'Mantequilla', 'Queso parmesano', 'Queso mozzarella'],
    allergens: ['Gluten', 'Lácteos'],
    dietTags: [],
    isTeacherOption: true,
    teacherOptionType: 'opcion_a',
    dayAvailable: 'martes',
    calories: 640
  },
  {
    id: 'item-prof-martes-b',
    name: 'Filete de Pescado al Ajillo con Vegetales Salteados (Opción B)',
    description: 'Filete de merluza blanca al ajillo con calabacín, zanahorias baby y puré rústico de batata dulce.',
    category: 'especial_saludable',
    priceUSD: 6.20,
    available: true,
    imageUrl: '/src/assets/images/bowl_saludable_glutenfree_1791320891726.jpg',
    ingredients: ['Filete de merluza fresca', 'Ajo fresco', 'Calabacín', 'Zanahoria', 'Batata dulce', 'Aceite de oliva'],
    allergens: ['Pescado'],
    dietTags: ['sin_gluten', 'sin_harina', 'alto_proteina'],
    isTeacherOption: true,
    teacherOptionType: 'opcion_b',
    dayAvailable: 'martes',
    calories: 410
  },
  {
    id: 'item-prof-miercoles-a',
    name: 'Asado Negro Caraqueño con Arroz y Plátano (Opción A)',
    description: 'Carne tierna en reducción acaramelada de papelón criollo y especias dulces, con arroz aromático.',
    category: 'almuerzos',
    priceUSD: 5.80,
    available: true,
    imageUrl: '/src/assets/images/pabellon_escolar_1791320882343.jpg',
    ingredients: ['Muchacho redondo de res', 'Papelón', 'Cebolla', 'Ajo', 'Arroz', 'Plátano'],
    allergens: [],
    dietTags: ['sin_gluten'],
    isTeacherOption: true,
    teacherOptionType: 'opcion_a',
    dayAvailable: 'miercoles',
    calories: 610
  },
  {
    id: 'item-prof-miercoles-b',
    name: 'Pechuga a la Naranja con Brócoli y Quinoa (Opción B)',
    description: 'Suprema de pollo glaseada con zumo natural de naranja sin azúcar añadida, brócoli al vapor y quinoa perlada.',
    category: 'especial_saludable',
    priceUSD: 5.90,
    available: true,
    imageUrl: '/src/assets/images/bowl_saludable_glutenfree_1791320891726.jpg',
    ingredients: ['Pechuga de pollo', 'Zumo de naranja natural', 'Brócoli', 'Quinoa', 'Jengibre', 'Sal marina'],
    allergens: [],
    dietTags: ['sin_gluten', 'sin_harina', 'sin_azucar', 'alto_proteina'],
    isTeacherOption: true,
    teacherOptionType: 'opcion_b',
    dayAvailable: 'miercoles',
    calories: 430
  },
  {
    id: 'item-jugo-papelon',
    name: 'Papelón con Limón Frío (Vaso 12oz)',
    description: 'Bebida venezolana refrescante a base de papelón rallado y zumo de limón criollo recién exprimido.',
    category: 'bebidas',
    priceUSD: 1.50,
    available: true,
    imageUrl: '/src/assets/images/bowl_saludable_glutenfree_1791320891726.jpg',
    ingredients: ['Agua purificada', 'Papelón natural de caña', 'Zumo de limón criollo'],
    allergens: [],
    dietTags: ['sin_gluten'],
    calories: 140
  }
];

export const INITIAL_NUTRITIONAL_SURVEYS: NutritionalSurvey[] = [
  {
    studentId: 'user-student-1',
    studentName: 'Santiago González Gamboa',
    barcode: 'CANTINA-EST-101',
    grade: '4to Grado "A"',
    prohibitedIngredients: ['Harina de trigo', 'Gluten', 'Pan', 'Tequeños regulares', 'Pasta de trigo', 'Maní'],
    allergens: ['Gluten', 'Maní'],
    medicalConditions: ['Celiaquía diagnosticada', 'Alergia severa a frutos secos'],
    parentNotes: 'Por favor NUNCA venderle tequeños de harina ni tortas con trigo. Si solicita comida rápida, ofrecerle únicamente arepa de maíz certificada o bowl sin gluten.',
    emergencyContact: 'Dra. Mariana Gamboa: +584127778899',
    updatedAt: '2026-09-15'
  },
  {
    studentId: 'user-student-2',
    studentName: 'Valeria López Mendoza',
    barcode: 'CANTINA-EST-102',
    grade: '6to Grado "B"',
    prohibitedIngredients: ['Leche entera', 'Queso amarillo', 'Queso blanco', 'Azúcar refinada', 'Refrescos', 'Bebidas azucaradas'],
    allergens: ['Lácteos'],
    medicalConditions: ['Intolerancia severa a la lactosa', 'Prediabetes pediátrica (Control estricto de glucosa)'],
    parentNotes: 'Valeria solo puede consumir agua o jugos 100% naturales sin azúcar. Cero quesos o salsas bechamel.',
    emergencyContact: 'Ing. Carlos Mendoza: +584245551234',
    updatedAt: '2026-09-20'
  },
  {
    studentId: 'user-student-3',
    studentName: 'Mateo Rivas Bolívar',
    barcode: 'CANTINA-EST-103',
    grade: '2do Grado "C"',
    prohibitedIngredients: ['Mariscos', 'Pescado'],
    allergens: ['Pescado', 'Mariscos'],
    medicalConditions: ['Alergia a productos marinos'],
    parentNotes: 'Alergia cutánea al cazón o pescado frito.',
    emergencyContact: 'Sra. Beatriz Bolívar: +584163332211',
    updatedAt: '2026-10-01'
  }
];

export const INITIAL_ORDERS: ConsumptionOrder[] = [
  {
    id: 'ORD-2026-001',
    studentOrUserId: 'user-student-1',
    userName: 'Santiago González Gamboa',
    userRole: 'student',
    userEmail: 'mariana.gamboa@gmail.com',
    userPhone: '+584127778899',
    barcode: 'CANTINA-EST-101',
    date: '2026-10-05',
    dayOfWeek: 'Lunes',
    items: [
      {
        menuItemId: 'item-arepa-reina',
        name: 'Arepa Reina Pepiada Tradicional',
        quantity: 1,
        unitPriceUSD: 3.50,
      },
      {
        menuItemId: 'item-jugo-papelon',
        name: 'Papelón con Limón Frío (Vaso 12oz)',
        quantity: 1,
        unitPriceUSD: 1.50
      }
    ],
    totalUSD: 5.00,
    totalVES: 302.50,
    paymentStatus: 'reportado',
    nutritionalValidationStatus: 'aprobado',
    whatsappSent: true,
    createdAt: '2026-10-05T10:15:00Z'
  },
  {
    id: 'ORD-2026-002',
    studentOrUserId: 'user-student-2',
    userName: 'Valeria López Mendoza',
    userRole: 'student',
    userEmail: 'carlos.mendoza@colegio.edu.ve',
    userPhone: '+584245551234',
    barcode: 'CANTINA-EST-102',
    date: '2026-10-06',
    dayOfWeek: 'Martes',
    items: [
      {
        menuItemId: 'item-bowl-glutenfree',
        name: 'Bowl Proteico Vital (Sin Gluten / Sin Azúcar)',
        quantity: 1,
        unitPriceUSD: 6.00
      }
    ],
    totalUSD: 6.00,
    totalVES: 363.00,
    paymentStatus: 'pendiente',
    nutritionalValidationStatus: 'aprobado',
    whatsappSent: false,
    createdAt: '2026-10-06T12:00:00Z'
  },
  {
    id: 'ORD-2026-003',
    studentOrUserId: 'user-teacher-1',
    userName: 'Prof. Carlos Mendoza',
    userRole: 'teacher',
    userEmail: 'carlos.mendoza@colegio.edu.ve',
    userPhone: '+584245551234',
    date: '2026-10-06',
    dayOfWeek: 'Martes',
    items: [
      {
        menuItemId: 'item-prof-martes-b',
        name: 'Filete de Pescado al Ajillo (Opción B)',
        quantity: 1,
        unitPriceUSD: 6.20,
        specialInstructions: 'Poco ajo, por favor.'
      }
    ],
    totalUSD: 6.20,
    totalVES: 375.10,
    paymentStatus: 'confirmado',
    nutritionalValidationStatus: 'sin_restriccion',
    whatsappSent: true,
    createdAt: '2026-10-06T08:30:00Z'
  }
];

export const INITIAL_PAYMENT_REPORTS: PaymentReport[] = [
  {
    id: 'PAY-2026-881',
    orderId: 'ORD-2026-001',
    userId: 'user-parent-1',
    userName: 'Mariana Gamboa',
    userPhone: '+584127778899',
    amountUSD: 5.00,
    amountVES: 302.50,
    paymentMethod: 'pago_movil',
    referenceNumber: '0412-892147',
    issuingBank: 'Banesco Banco Universal',
    paymentDate: '2026-10-05',
    status: 'reportado',
    adminNotes: 'Pago móvil recibido por 302,50 Bs en cuenta Banesco.',
    createdAt: '2026-10-05T14:30:00Z'
  },
  {
    id: 'PAY-2026-880',
    orderId: 'ORD-2026-003',
    userId: 'user-teacher-1',
    userName: 'Prof. Carlos Mendoza',
    userPhone: '+584245551234',
    amountUSD: 6.20,
    amountVES: 375.10,
    paymentMethod: 'zelle',
    referenceNumber: 'ZLL-9921045',
    issuingBank: 'Chase (Zelle)',
    paymentDate: '2026-10-06',
    status: 'confirmado',
    adminNotes: 'Confirmado por administración en cuenta Zelle institucional.',
    createdAt: '2026-10-06T09:00:00Z'
  }
];

export const VENEZUELAN_BANKS = [
  'Banesco Banco Universal',
  'Banco Mercantil',
  'Banco de Venezuela (BDV)',
  'BBVA Banco Provincial',
  'Banco Nacional de Crédito (BNC)',
  'Bancaribe',
  'Banco Exterior',
  'Zelle (USD)',
  'Efectivo en Caja (USD / Bs)'
];
