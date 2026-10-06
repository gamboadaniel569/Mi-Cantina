import { useState } from 'react';
import { 
  Receipt, 
  Send, 
  CreditCard, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  UploadCloud,
  FileCheck,
  Check
} from 'lucide-react';
import { ConsumptionOrder, PaymentReport, PaymentMethod } from '../types';
import { CanteenService } from '../services/canteenService';
import { OFFICIAL_EXCHANGE_RATE_VES, VENEZUELAN_BANKS } from '../data/mockData';

interface StudentHistoryAndWhatsAppProps {
  studentOrParentName: string;
  studentBarcode?: string;
  userPhone: string;
  orders: ConsumptionOrder[];
  payments: PaymentReport[];
  onPaymentReported: () => void;
}

export function StudentHistoryAndWhatsApp({
  studentOrParentName,
  studentBarcode,
  userPhone,
  orders,
  payments,
  onPaymentReported
}: StudentHistoryAndWhatsAppProps) {
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<ConsumptionOrder | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState(false);

  // Form states
  const [method, setMethod] = useState<PaymentMethod>('pago_movil');
  const [reference, setReference] = useState('');
  const [issuingBank, setIssuingBank] = useState('Banesco Banco Universal');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [customAmountUSD, setCustomAmountUSD] = useState('');
  const [voucherSimulated, setVoucherSimulated] = useState(false);

  // Filter orders for this student
  const filteredOrders = studentBarcode 
    ? orders.filter(o => o.barcode === studentBarcode || o.userName.includes(studentOrParentName.split(' ')[0]))
    : orders;

  const totalConsumedUSD = filteredOrders.reduce((sum, o) => sum + o.totalUSD, 0);
  const pendingOrders = filteredOrders.filter(o => o.paymentStatus === 'pendiente');
  const pendingUSD = pendingOrders.reduce((sum, o) => sum + o.totalUSD, 0);
  const pendingVES = pendingUSD * OFFICIAL_EXCHANGE_RATE_VES;

  const handleOpenPaymentModal = (order?: ConsumptionOrder) => {
    setSelectedOrderForPayment(order || null);
    setCustomAmountUSD(order ? order.totalUSD.toString() : pendingUSD.toString());
    setReference('');
    setVoucherSimulated(false);
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amountUSD = Number(customAmountUSD) || (selectedOrderForPayment ? selectedOrderForPayment.totalUSD : pendingUSD);
    const amountVES = Number((amountUSD * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2));

    const newPayment: PaymentReport = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      orderId: selectedOrderForPayment?.id,
      userId: studentBarcode || 'user-parent-1',
      userName: studentOrParentName,
      userPhone: userPhone || '+584121234567',
      amountUSD,
      amountVES,
      paymentMethod: method,
      referenceNumber: reference || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      issuingBank,
      paymentDate,
      proofImageUrl: voucherSimulated ? '/src/assets/images/arepas_venezolanas_1791320862796.jpg' : undefined,
      status: 'reportado',
      createdAt: new Date().toISOString()
    };

    CanteenService.reportPayment(newPayment);
    setShowPaymentModal(false);
    setPaymentSuccessMsg(true);
    onPaymentReported();
    setTimeout(() => setPaymentSuccessMsg(false), 5000);
  };

  const handleSendWhatsAppOrder = (order: ConsumptionOrder) => {
    const message = CanteenService.generateWhatsAppMessage(order);
    const link = CanteenService.getWhatsAppLink(order.userPhone || userPhone, message);
    window.open(link, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Consumo del Período
          </p>
          <p className="text-2xl font-bold font-display text-stone-900 tabular-nums">
            ${totalConsumedUSD.toFixed(2)} USD
          </p>
          <p className="text-xs text-stone-500 tabular-nums">
            ≈ {(totalConsumedUSD * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2)} Bs
          </p>
        </div>

        <div className="p-5 bg-amber-50/70 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
          <p className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
            Saldo Pendiente por Pagar
          </p>
          <p className="text-2xl font-bold font-display text-amber-950 tabular-nums">
            ${pendingUSD.toFixed(2)} USD
          </p>
          <p className="text-xs text-amber-800 tabular-nums">
            ≈ {pendingVES.toFixed(2)} Bs (Tasa {OFFICIAL_EXCHANGE_RATE_VES} Bs/$)
          </p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Acción Rápida de Pago
            </p>
            <p className="text-xs text-stone-600 mt-1">
              Reporte de comprobante de Pago Móvil o Zelle
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenPaymentModal()}
            className="w-full mt-3 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Reportar Pago de Saldo</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {paymentSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">¡Pago reportado con éxito!</p>
            <p className="text-emerald-700">
              El comprobante fue enviado a la administración para su conciliación con los registros bancarios.
            </p>
          </div>
        </div>
      )}

      {/* Consumption Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-stone-600" />
            <h3 className="text-sm font-bold text-stone-900 font-display">
              Historial de Consumo Escolar
            </h3>
          </div>
          <span className="text-xs text-stone-500">
            {filteredOrders.length} consumos registrados
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Platos & Bebidas</th>
                <th className="py-3 px-4 text-right">Monto (USD)</th>
                <th className="py-3 px-4 text-right">Monto (Bs)</th>
                <th className="py-3 px-4 text-center">Estatus</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    No hay consumos registrados para este alumno.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-stone-900 whitespace-nowrap">
                      {order.date}
                      <span className="block text-[11px] text-stone-400 font-normal">
                        #{order.id}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5">
                        {order.items.map((item, i) => (
                          <div key={i} className="text-stone-700">
                            <span className="font-semibold">{item.quantity}x</span> {item.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-stone-900 tabular-nums">
                      ${order.totalUSD.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-stone-600 tabular-nums">
                      {order.totalVES.toFixed(2)} Bs
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                        order.paymentStatus === 'confirmado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.paymentStatus === 'reportado'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus === 'confirmado' && 'Confirmado'}
                        {order.paymentStatus === 'reportado' && 'Reportado'}
                        {order.paymentStatus === 'pendiente' && 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp send button */}
                        <button
                          type="button"
                          onClick={() => handleSendWhatsAppOrder(order)}
                          title="Enviar resumen y datos de pago por WhatsApp"
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span className="text-[11px] hidden sm:inline">WhatsApp</span>
                        </button>

                        {/* Report payment button */}
                        {order.paymentStatus === 'pendiente' && (
                          <button
                            type="button"
                            onClick={() => handleOpenPaymentModal(order)}
                            className="py-1 px-2.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-lg text-[11px] transition-colors"
                          >
                            Pagar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reported Payments History */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Comprobantes y Pagos Reportados Recientemente
        </h4>
        <div className="divide-y divide-stone-100 text-xs">
          {payments.map(pay => (
            <div key={pay.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 capitalize">
                    {pay.paymentMethod.replace('_', ' ')}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-600">{pay.issuingBank}</span>
                  <span className="text-stone-400">·</span>
                  <span className="font-mono text-stone-500">{pay.referenceNumber}</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Fecha: {pay.paymentDate} {pay.adminNotes ? `— ${pay.adminNotes}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="font-bold text-stone-900 block tabular-nums">
                    ${pay.amountUSD.toFixed(2)} USD
                  </span>
                  <span className="text-[11px] text-stone-500 block tabular-nums">
                    {pay.amountVES.toFixed(2)} Bs
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  pay.status === 'confirmado' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-sky-100 text-sky-800'
                }`}>
                  {pay.status === 'confirmado' ? 'Aprobado' : 'En Verificación'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for reporting payments */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold font-display text-sm">
                  Reportar Pago de Consumo Escolar
                </h3>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4 text-xs">
              {/* Method */}
              <div className="space-y-1.5">
                <label className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                  1. Forma de Pago
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'pago_movil', label: 'Pago Móvil (Bs)' },
                    { id: 'zelle', label: 'Zelle (USD)' },
                    { id: 'transferencia_bancaria', label: 'Transferencia (Bs)' },
                    { id: 'efectivo_usd', label: 'Efectivo en Caja' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMethod(m.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        method === m.id
                          ? 'border-amber-500 bg-amber-50 font-bold text-stone-900'
                          : 'border-stone-200 bg-white text-stone-600'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank & Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Banco Emisor</label>
                  <select
                    value={issuingBank}
                    onChange={(e) => setIssuingBank(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-white"
                  >
                    {VENEZUELAN_BANKS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Número de Referencia</label>
                  <input
                    type="text"
                    required
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Últimos 6 dígitos o código"
                    className="w-full p-2 border border-stone-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Monto en Dólares ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={customAmountUSD}
                    onChange={(e) => setCustomAmountUSD(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg font-bold"
                  />
                  <span className="text-[10px] text-stone-400 block">
                    Equivalente: {(Number(customAmountUSD || 0) * OFFICIAL_EXCHANGE_RATE_VES).toFixed(2)} Bs
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700">Día de Pago</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full p-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Voucher upload simulator */}
              <div className="space-y-1">
                <label className="font-bold text-stone-700">Comprobante de Pago (Captura)</label>
                <div 
                  onClick={() => setVoucherSimulated(!voucherSimulated)}
                  className={`p-3 border-2 border-dashed rounded-xl cursor-pointer text-center transition-all ${
                    voucherSimulated 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800' 
                      : 'border-stone-300 hover:border-stone-400 text-stone-500'
                  }`}
                >
                  {voucherSimulated ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileCheck className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold">Comprobante capturado (voucher_pago.png)</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <UploadCloud className="w-5 h-5 text-stone-400" />
                      <span>Haga clic para adjuntar comprobante bancario</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Enviar Reporte</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
