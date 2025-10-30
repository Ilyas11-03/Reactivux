"use client"
import type { Order, OrderElement, SubElementOrder } from "./core/model"
import { X, Printer } from "lucide-react"

interface DetailsCommandsProps {
  order: Order | null
  onClose: () => void
}

export default function DetailsCommands({ order, onClose }: DetailsCommandsProps) {
  if (!order) return null

  const formatAmount = (amount: number) => `${amount.toFixed(2)} €`
  const formatDate = (iso: string) => new Date(iso).toLocaleString()
  const elements = Array.isArray(order.elements_order) ? order.elements_order : []
  const itemsCount = elements.reduce((sum, el) => sum + (el.quantity || 0), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-aos="fade-in">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5" data-aos="zoom-in">
        {/* Fixed Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 flex-shrink-0">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 tracking-tight">Commande #{order.id}</h3>
            <p className="mt-1 text-sm text-gray-500">Créée le {formatDate(order.created_at)}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
              order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' :
              order.status === 'preparing' ? 'bg-amber-50 text-amber-700 ring-amber-200' :
              order.status === 'accepted' ? 'bg-indigo-50 text-indigo-700 ring-indigo-200' :
              order.status === 'cancelled' ? 'bg-rose-50 text-rose-700 ring-rose-200' :
              'bg-gray-50 text-gray-700 ring-gray-200'
            }`}>{order.status}</span>
            <span className="hidden sm:inline-flex items-center rounded-full bg-pink-50 px-2.5 py-1 text-xs font-semibold text-pink-700 ring-1 ring-inset ring-pink-200">{order.type}</span>
            <span className="hidden sm:inline-flex items-center rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-200">{order.order_by}</span>
            <button
              onClick={onClose}
              aria-label="Fermer"
              title="Fermer"
              className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/60"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Client</h4>
              <p className="mt-1 text-sm text-gray-900">{order.customer?.name ?? order.borne_cust_name ?? "-"}</p>
              {order.customer?.email && (
                <p className="text-xs text-gray-500">{order.customer.email}</p>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Montant total</h4>
              <p className="mt-1 text-sm font-medium text-gray-900">{formatAmount(order.total_amount)}</p>
              {typeof order.fees === 'number' && (
                <p className="text-xs text-gray-500">Frais: {formatAmount(order.fees)}</p>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Origine</h4>
              <p className="mt-1 text-sm">
                <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 ring-1 ring-inset ring-green-200">
                  {order.order_by}
                </span>
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Type</h4>
              <p className="mt-1 text-sm">
                <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-1 text-xs font-semibold text-pink-800 ring-1 ring-inset ring-pink-200">
                  {order.type}
                </span>
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Planifiée</h4>
              <p className="mt-1 text-sm text-gray-900">{order.planified === 1 ? "Oui" : "Non"}</p>
              {order.planified_at && (
                <p className="text-xs text-gray-500">Pour: {formatDate(order.planified_at)}</p>
              )}
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Statut</h4>
              <p className="mt-1 text-sm text-gray-900 capitalize">{order.status}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Paiement</h4>
              <p className="mt-1 text-sm text-gray-900">{order.is_paid === 1 ? "Payée" : "Non payée"}</p>
              <p className="text-xs text-gray-500">À la caisse: {order.payment_at_checkout === 1 ? "Oui" : "Non"}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Informations</h4>
              <dl className="mt-1 space-y-1 text-xs text-gray-700">
                <div className="flex justify-between"><dt>Commande ID</dt><dd className="font-medium">#{order.id}</dd></div>
                <div className="flex justify-between"><dt>Store ID</dt><dd>{order.store_id}</dd></div>
                <div className="flex justify-between"><dt>Client ID</dt><dd>{order.customer_id}</dd></div>
                {order.customer_store_id !== null && (
                  <div className="flex justify-between"><dt>Client Store ID</dt><dd>{order.customer_store_id}</dd></div>
                )}
                <div className="flex justify-between"><dt>Créée</dt><dd>{formatDate(order.created_at)}</dd></div>
                <div className="flex justify-between"><dt>MAJ</dt><dd>{formatDate(order.updated_at)}</dd></div>
              </dl>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Flags</h4>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 ring-1 ring-inset ${order.isRead === 1 ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : 'bg-gray-50 text-gray-700 ring-gray-200'}`}>Lu: {order.isRead === 1 ? 'Oui' : 'Non'}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 ring-1 ring-inset ${order.isRefund === 1 ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-gray-50 text-gray-700 ring-gray-200'}`}>Remboursé: {order.isRefund === 1 ? 'Oui' : 'Non'}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 ring-1 ring-inset ${order.printed === 1 ? 'bg-indigo-50 text-indigo-700 ring-indigo-200' : 'bg-gray-50 text-gray-700 ring-gray-200'}`}>Imprimé: {order.printed === 1 ? 'Oui' : 'Non'}</span>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 ring-1 ring-inset ${order.at_place === 1 ? 'bg-blue-50 text-blue-700 ring-blue-200' : 'bg-gray-50 text-gray-700 ring-gray-200'}`}>Sur place: {order.at_place === 1 ? 'Oui' : 'Non'}</span>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <h4 className="text-sm font-semibold text-gray-700">Références</h4>
              <dl className="mt-1 space-y-1 text-xs text-gray-700">
                {order.promocode_id !== null && (
                  <div className="flex justify-between"><dt>Promo</dt><dd>#{order.promocode_id}</dd></div>
                )}
                {order.table_id !== null && (
                  <div className="flex justify-between"><dt>Table</dt><dd>#{order.table_id}</dd></div>
                )}
                {order.delivery_address_id !== null && (
                  <div className="flex justify-between"><dt>Adresse LIV</dt><dd>#{order.delivery_address_id}</dd></div>
                )}
                {order.cac_address_id !== null && (
                  <div className="flex justify-between"><dt>Adresse CAC</dt><dd>#{order.cac_address_id}</dd></div>
                )}
                {order.stripe_payment_intent && (
                  <div className="flex justify-between"><dt>Stripe</dt><dd className="truncate max-w-[12rem]">{order.stripe_payment_intent}</dd></div>
                )}
              </dl>
            </div>
          </div>

          {/* Articles */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">Articles</h4>
              <p className="text-xs text-gray-500">{elements.length} lignes • {itemsCount} articles</p>
            </div>
            <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-gray-200">
              <table className="w-full text-xs leading-tight">
                <thead className="sticky top-0 z-10 bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-semibold">Produit</th>
                    <th className="px-2 py-1.5 text-left font-semibold">Qté</th>
                    <th className="px-2 py-1.5 text-left font-semibold">Prix</th>
                    <th className="px-2 py-1.5 text-left font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {elements.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-2 py-3 text-center text-gray-500">Aucun article pour cette commande</td>
                    </tr>
                  )}
                  {elements.map((el: OrderElement) => (
                    <tr key={el.id} className="hover:bg-gray-50">
                      <td className="px-2 py-2">
                        <div className="font-medium text-gray-900 truncate">{el.product?.name ?? `#${el.product_id}`}</div>
                        {el.comment && <div className="text-[10px] text-gray-500">{el.comment}</div>}
                        {Array.isArray(el.sub_elements_order) && el.sub_elements_order.length > 0 && (
                          <ul className="mt-1 space-y-0.5 text-[10px] text-gray-600">
                            {el.sub_elements_order.map((se: SubElementOrder) => (
                              <li key={se.id} className="flex items-center justify-between">
                                <span>
                                  {se.sub_product?.name ?? `Option #${se.sub_product_id}`} × {se.quantity}
                                </span>
                                <span>{formatAmount(se.total_amount_sub_element)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </td>
                      <td className="px-2 py-2">{el.quantity}</td>
                      <td className="px-2 py-2 tabular-nums">{formatAmount(el.price)}</td>
                      <td className="px-2 py-2 font-medium text-gray-900 tabular-nums">{formatAmount(el.total_amount_element)}</td>
                    </tr>
                  ))}
                </tbody>
                {elements.length > 0 && (
                  <tfoot className="bg-gray-50 text-gray-700 text-[11px]">
                    <tr>
                      <td className="px-2 py-2 text-right font-medium" colSpan={3}>Sous-total</td>
                      <td className="px-2 py-2 font-semibold text-gray-900 tabular-nums">
                        {formatAmount(elements.reduce((sum, el) => sum + (el.total_amount_element || 0), 0))}
                      </td>
                    </tr>
                    {typeof order.fees === 'number' && (
                      <tr>
                        <td className="px-2 py-1.5 text-right font-medium" colSpan={3}>Frais</td>
                        <td className="px-2 py-1.5 font-semibold text-gray-900 tabular-nums">{formatAmount(order.fees)}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="px-2 py-2 text-right font-medium" colSpan={3}>Total</td>
                      <td className="px-2 py-2 text-indigo-700 font-bold tabular-nums">{formatAmount(order.total_amount)}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/60 px-6 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-600/60"
          >
            Fermer
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/60"
          >
            <Printer className="h-4 w-4" />
            Imprimer
          </button>
        </div>
      </div>
    </div>
  )
}


