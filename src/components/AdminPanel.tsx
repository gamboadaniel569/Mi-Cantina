import { useState } from 'react';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Send, 
  ScanLine, 
  DollarSign, 
  CreditCard, 
  Utensils, 
  Layers, 
  AlertTriangle,
  Lock,
  Check,
  X
} from 'lucide-react';
import { 
  MenuItem, 
  ConsumptionOrder, 
  PaymentReport, 
  FoodCategory, 
  SpecialDietTag 
} from '../types';
import { CanteenService } from '../services/canteenService';
import { 
  OFFICIAL_EXCHANGE_RATE_VES, 
  AUTHORIZED_ADMIN_EMAILS 
} from '../data/mockData';

interface AdminPanelProps {
  currentAdminEmail: string;
  menuItems: MenuItem[];
  orders: ConsumptionOrder[];
  payments: PaymentReport[];
  onOpenScanner: () => void;
  onMenuUpdated: () => void;
  onPaymentsUpdated: () => void;
}

export function AdminPanel({
  currentAdminEmail,
  menuItems,
  orders,
  payments,
  onOpenScanner,
  onMenuUpdated,
  onPaymentsUpdated
}: AdminPanelProps) {
  const isAuthorized = AUTHORIZED_ADMIN_EMAILS.includes(currentAdminEmail.trim().toLowerCase());

  // Sub-tabs in admin panel
  const [activeTab, setActiveTab] = useState<'consumos' | 'pagos' | 'menu_crud'>('consumos');
  
  // Menu Item Modal state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);

  // Form states for menu item
  const [itemName, setItemName] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemCategory, setItemCategory] = useState<FoodCategory>('almuerzos');
  const [itemPriceUSD, setItemPriceUSD] = useState('4.50');
  const [itemImageUrl, setItemImageUrl] = useState('/src/assets/images/arepas_venezolanas_1791320862796.jpg');
  const [itemIngredients, setItemIngredients] = useState('');
  const [itemAllergens, setItemAllergens] = useState('');
  const [itemDietTags, setItemDietTags] = useState<SpecialDietTag[]>([]);
  const [isTeacherOption, setIsTeacherOption] = useState(false);
  const [teacherOptionType, setTeacherOptionType] = useState<'opcion_a' | 'opcion_b'>('opcion_a');
  const [dayAvailable, setDayAvailable] = useState<'lunes' | 'martes' | 'miercoles' | 'jueves' | 'viernes' | 'todos'>('todos');

  // Metrics
  const totalRevenueUSD = orders
    .filter(o => o.paymentStatus === 'confirmado')
    .reduce((sum, o) => sum + o.totalUSD, 0);

  const pendingDebtUSD = orders
    .filter(o => o.paymentStatus === 'pendiente')
    .reduce((sum, o) => sum + o.totalUSD, 0);

  const reportedPendingVerification = payments.filter(p => p.status === 'reportado').length;

  // Unauthorized view
  if (!isAuthorized) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl border border-red-200 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold font-display text-stone-900">
          Acceso Restringido a Administradores Autorizados
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
          El usuario activo (<strong>{currentAdminEmail}</strong>) no se encuentra en la lista estricta de administradores del sistema escolar.
        </p>
        <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-700 max-w-sm mx-auto border border-stone-200">
          <p className="font-semibold text-stone-900 mb-1">Correos Autorizados en Firebase Rules:</p>
          <ul className="space-y-0.5 text-stone-600">
            {AUTHORIZED_ADMIN_EMAILS.map(e => (
              <li key={e} className="font-mono text-[11px]">• {e}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // Edit / Add modal handlers
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setItemName('');
    setItemDesc('');
    setItemCategory('almuerzos');
    setItemPriceUSD('4.00');
    setItemImageUrl('/src/assets/images/arepas_venezolanas_1791320862796.jpg');
    setItemIngredients('Carne, Harina de maíz, Queso');
    setItemAllergens('');
    setItemDietTags([]);
    setIsTeacherOption(false);
    setTeacherOptionType('opcion_a');
    setDayAvailable('todos');
    setIsItemModalOpen(true);
  };

  const handleOpenEditModal = (item: MenuItem) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDesc(item.description);
    setItemCategory(item.category);
    setItemPriceUSD(item.priceUSD.toString());
    setItemImageUrl(item.imageUrl);
    setItemIngredients(item.ingredients.join(', '));
    setItemAllergens(item.allergens.join(', '));
    setItemDietTags(item.dietTags);
    setIsTeacherOption(!!item.isTeacherOption);
    setTeacherOptionType(item.teacherOptionType || 'opcion_a');
    setDayAvailable(item.dayAvailable || 'todos');
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const ingredientsArr = itemIngredients.split(',').map(s => s.trim()).filter(Boolean);
    const allergensArr = itemAllergens.split(',').map(s => s.trim()).filter(Boolean);

    const saved: MenuItem = {
      id: editingItem ? editingItem.id : `item-${Date.now()}`,
      name: itemName,
      description: itemDesc,
      category: itemCategory,
      priceUSD: Number(itemPriceUSD) || 0,
      available: true,
      imageUrl: itemImageUrl,
      ingredients: ingredientsArr,
      allergens: allergensArr,
      dietTags: itemDietTags,
      isTeacherOption,
      teacherOptionType: isTeacherOption ? teacherOptionType : undefined,
      dayAvailable: isTeacherOption ? dayAvailable : 'todos'
    };

    CanteenService.saveMenuItem(saved);
    setIsItemModalOpen(false);
    onMenuUpdated();
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('¿Seguro que desea eliminar este ítem del menú de la cantina?')) {
      CanteenService.deleteMenuItem(id);
      onMenuUpdated();
    }
  };

  const handleConfirmPayment = (payId: string) => {
    CanteenService.updatePaymentStatus(payId, 'confirmado', 'Verificado y conciliado por administración');
    onPaymentsUpdated();
  };

  const handleRejectPayment = (payId: string) => {
    CanteenService.updatePaymentStatus(payId, 'rechazado', 'No coincide con la cuenta bancaria');
    onPaymentsUpdated();
  };

  const handleSendWhatsAppOrder = (order: ConsumptionOrder) => {
    const message = CanteenService.generateWhatsAppMessage(order);
    const link = CanteenService.getWhatsAppLink(order.userPhone, message);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Scanner Launch CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-stone-900 text-white rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-lg font-bold font-display">
              Panel Gerencial de Administración
            </h2>
          </div>
          <p className="text-xs text-stone-400">
            Sesión activa: <strong className="text-amber-400">{currentAdminEmail}</strong> (Super Administrador)
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenScanner}
          className="py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          <ScanLine className="w-4 h-4" />
          <span>Abrir Escáner de Carnets</span>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">Recaudación Confirmada</p>
          <p className="text-2xl font-bold font-display text-emerald-700 mt-1 tabular-nums">
            ${totalRevenueUSD.toFixed(2)} USD
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5 tabular-nums">
            ≈ {(totalRevenueUSD * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2)} Bs
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">Cuentas por Cobrar (Deuda)</p>
          <p className="text-2xl font-bold font-display text-amber-700 mt-1 tabular-nums">
            ${pendingDebtUSD.toFixed(2)} USD
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5 tabular-nums">
            ≈ {(pendingDebtUSD * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2)} Bs
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-2xs">
          <p className="text-[11px] font-bold uppercase text-stone-500 tracking-wider">Comprobantes por Conciliar</p>
          <p className="text-2xl font-bold font-display text-sky-700 mt-1 tabular-nums">
            {reportedPendingVerification} comprobantes
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            Reportados por Pago Móvil y Zelle
          </p>
        </div>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('consumos')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'consumos'
              ? 'bg-stone-900 text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          Control de Consumos & WhatsApp
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pagos')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'pagos'
              ? 'bg-stone-900 text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          <span>Conciliación de Pagos</span>
          {reportedPendingVerification > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('menu_crud')}
          className={`py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'menu_crud'
              ? 'bg-stone-900 text-white shadow-2xs'
              : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-200'
          }`}
        >
          Gestión de Menús (CRUD)
        </button>
      </div>

      {/* TAB 1: Consumos & WhatsApp */}
      {activeTab === 'consumos' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Todos los Consumos Escolares y Despacho WhatsApp
            </h3>
            <span className="text-xs text-stone-500">{orders.length} órdenes registradas</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Orden / Fecha</th>
                  <th className="py-3 px-4">Alumno / Docente</th>
                  <th className="py-3 px-4">Detalle Ítems</th>
                  <th className="py-3 px-4 text-right">Total ($)</th>
                  <th className="py-3 px-4 text-center">Estatus</th>
                  <th className="py-3 px-4 text-right">Canal WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/60">
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-stone-900">#{o.id}</span>
                      <span className="block text-[11px] text-stone-400">{o.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-900">{o.userName}</p>
                      <p className="text-[11px] text-stone-500">{o.userPhone}</p>
                    </td>
                    <td className="py-3 px-4">
                      {o.items.map((it, idx) => (
                        <div key={idx} className="text-stone-700">
                          {it.quantity}x {it.name}
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-stone-900 tabular-nums whitespace-nowrap">
                      ${o.totalUSD.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.paymentStatus === 'confirmado' ? 'bg-emerald-100 text-emerald-800' :
                        o.paymentStatus === 'reportado' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleSendWhatsAppOrder(o)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Enviar a Padres</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Pagos & Conciliación */}
      {activeTab === 'pagos' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs space-y-4 p-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Reportes de Pago Recibidos de Padres y Docentes
            </h3>
          </div>

          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{p.userName}</span>
                    <span className="text-stone-400">·</span>
                    <span className="font-semibold text-stone-700 capitalize">{p.paymentMethod.replace('_', ' ')}</span>
                    <span className="text-stone-400">·</span>
                    <span className="font-mono text-stone-600">{p.issuingBank}</span>
                  </div>
                  <p className="text-stone-500">
                    Ref: <strong className="font-mono text-stone-800">{p.referenceNumber}</strong> · Fecha: {p.paymentDate}
                  </p>
                  {p.adminNotes && (
                    <p className="text-[11px] text-amber-800 italic">Nota: {p.adminNotes}</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-base font-bold text-stone-900 tabular-nums">${p.amountUSD.toFixed(2)} USD</p>
                    <p className="text-[11px] text-stone-500 tabular-nums">{p.amountVES.toFixed(2)} Bs</p>
                  </div>

                  {p.status === 'reportado' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleConfirmPayment(p.id)}
                        className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Aprobar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRejectPayment(p.id)}
                        className="py-1.5 px-3 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Rechazar</span>
                      </button>
                    </div>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                      p.status === 'confirmado' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {p.status === 'confirmado' ? 'Conciliado en Banco' : 'Rechazado'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CRUD de Menús */}
      {activeTab === 'menu_crud' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Catálogo de Menú Escolar y Precios
            </h3>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="py-2 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Nuevo Plato</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {menuItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-100">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs font-bold text-amber-800 tabular-nums">
                      ${item.priceUSD.toFixed(2)} USD
                    </span>
                  </div>

                  <h4 className="font-bold text-stone-900 text-sm">{item.name}</h4>
                  <p className="text-xs text-stone-600 line-clamp-2">{item.description}</p>

                  <div className="text-[11px] text-stone-500 space-y-0.5">
                    <p className="font-medium text-stone-700">Ingredientes:</p>
                    <p className="italic truncate">{item.ingredients.join(', ')}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {item.isTeacherOption ? `Docente (${item.teacherOptionType})` : 'Estudiante'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-lg"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CRUD Modal */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm font-display">
                {editingItem ? 'Editar Plato del Menú' : 'Crear Nuevo Plato'}
              </h3>
              <button 
                onClick={() => setIsItemModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Nombre del Plato</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Ej: Arepa de Carne Mechada"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-stone-700">Descripción detallada</label>
                <textarea
                  rows={2}
                  required
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  placeholder="Ingredientes principales y preparación..."
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Categoría</label>
                  <select
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value as any)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    <option value="desayunos">Desayunos Criollos</option>
                    <option value="almuerzos">Almuerzos</option>
                    <option value="snacks">Snacks & Tequeños</option>
                    <option value="bebidas">Bebidas & Jugos</option>
                    <option value="especial_saludable">Menú Especial Saludable</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Precio en Dólares ($)</label>
                  <input
                    type="number"
                    step="0.10"
                    required
                    value={itemPriceUSD}
                    onChange={(e) => setItemPriceUSD(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                  />
                  <span className="text-[10px] text-stone-400">
                    ≈ {(Number(itemPriceUSD || 0) * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2)} Bs
                  </span>
                </div>
              </div>

              {/* Photo selector from generated assets */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700">Fotografía del Plato</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { name: 'Arepas', path: '/src/assets/images/arepas_venezolanas_1791320862796.jpg' },
                    { name: 'Tequeños', path: '/src/assets/images/tequenos_crujientes_1791320873939.jpg' },
                    { name: 'Pabellón', path: '/src/assets/images/pabellon_escolar_1791320882343.jpg' },
                    { name: 'Bowl Saludable', path: '/src/assets/images/bowl_saludable_glutenfree_1791320891726.jpg' },
                  ].map((img) => (
                    <button
                      key={img.path}
                      type="button"
                      onClick={() => setItemImageUrl(img.path)}
                      className={`p-1 rounded-xl border transition-all text-center ${
                        itemImageUrl === img.path ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-stone-200'
                      }`}
                    >
                      <img src={img.path} alt={img.name} className="w-full h-12 object-cover rounded-lg" />
                      <span className="text-[10px] block mt-0.5 truncate">{img.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ingredients & Allergens */}
              <div className="space-y-2">
                <label className="font-bold text-stone-700">
                  Ingredientes (Separados por coma - Cruce con encuesta médica)
                </label>
                <input
                  type="text"
                  required
                  value={itemIngredients}
                  onChange={(e) => setItemIngredients(e.target.value)}
                  placeholder="Ej: Harina de maíz, Carne de res mechada, Aguacate"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-stone-700">
                  Alérgenos Notificados
                </label>
                <input
                  type="text"
                  value={itemAllergens}
                  onChange={(e) => setItemAllergens(e.target.value)}
                  placeholder="Ej: Gluten, Lácteos, Maní"
                  className="w-full p-2 border border-stone-300 rounded-lg"
                />
              </div>

              {/* Teacher option toggle */}
              <div className="p-3 bg-stone-50 rounded-xl space-y-2 border border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTeacherOption}
                    onChange={(e) => setIsTeacherOption(e.target.checked)}
                    className="rounded text-amber-500"
                  />
                  <span className="font-bold text-stone-800">
                    Incluir en el Menú Especial para Profesores
                  </span>
                </label>

                {isTeacherOption && (
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block">Opción Docente</label>
                      <select
                        value={teacherOptionType}
                        onChange={(e) => setTeacherOptionType(e.target.value as any)}
                        className="w-full p-1.5 border border-stone-300 rounded-lg bg-white"
                      >
                        <option value="opcion_a">Opción A (Tradicional)</option>
                        <option value="opcion_b">Opción B (Saludable/Gourmet)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block">Día de la Semana</label>
                      <select
                        value={dayAvailable}
                        onChange={(e) => setDayAvailable(e.target.value as any)}
                        className="w-full p-1.5 border border-stone-300 rounded-lg bg-white"
                      >
                        <option value="todos">Todos los días</option>
                        <option value="lunes">Lunes</option>
                        <option value="martes">Martes</option>
                        <option value="miercoles">Miércoles</option>
                        <option value="jueves">Jueves</option>
                        <option value="viernes">Viernes</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl"
                >
                  {editingItem ? 'Guardar Cambios' : 'Crear Plato'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
