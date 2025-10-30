"use client"

import { useEffect, useMemo, useState } from "react"
import { getHistoricOrders, getUnstructuredOrders } from "./core/request"
import type { Order } from "./core/model"
import { Printer, Eye, X, Check } from "lucide-react"
import DetailsCommands from "./DetailsCommands"

 

export default function OrderDashboard() {
  
  const [statusFilter, setStatusFilter] = useState<"pending" | "preparing" | "delivered" | "all">("pending")
  const [filterType, setFilterType] = useState("Tous")
  const [orderBy, setOrderBy] = useState("Tous")
  const [commandType, setCommandType] = useState("Tous")
  // Impression UI removed for now; keep state when we implement printing
  // const [impression, setImpression] = useState("Normale")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      const res = await getHistoricOrders(page)
      if (!mounted) return
      if (res && res.data) {
        setOrders(res.data.data || [])
        setTotal(res.data.total || 0)
      } else {
        setError("Impossible de charger les commandes.")
      }
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [page])

  const filteredOrders = useMemo(
    () =>
      orders.filter(order => {
        const normalizedQuery = search.trim().toLowerCase()
        const matchesQuery =
          normalizedQuery.length === 0 ||
          `${order.id}`.toLowerCase().includes(normalizedQuery) ||
          (order.customer?.name?.toLowerCase?.().includes(normalizedQuery) ?? false) ||
          (order.borne_cust_name?.toLowerCase?.().includes(normalizedQuery) ?? false)

        const orderDate = new Date(order.created_at)
        const fromOk = dateFrom ? orderDate >= new Date(dateFrom) : true
        const toOk = dateTo ? orderDate <= new Date(dateTo) : true

        const matchesPlanifier =
          filterType === "Tous" || (filterType === "Oui" ? order.planified === 1 : order.planified === 0)

        const matchesOrderBy = orderBy === "Tous" || order.order_by === orderBy
        const matchesCommandType = commandType === "Tous" || order.type === commandType
        const matchesStatus = statusFilter === "all" || order.status === statusFilter

        return matchesQuery && fromOk && toOk && matchesPlanifier && matchesOrderBy && matchesCommandType && matchesStatus
      }),
    [orders, search, dateFrom, dateTo, filterType, orderBy, commandType, statusFilter]
  )

  const formatAmount = (amount: number) => `${amount.toFixed(2)} €`
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString()

  const getStatusBadgeClasses = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 ring-amber-200"
      case "preparing":
        return "bg-blue-100 text-blue-800 ring-blue-200"
      case "delivered":
        return "bg-emerald-100 text-emerald-800 ring-emerald-200"
      case "accepted":
        return "bg-indigo-100 text-indigo-800 ring-indigo-200"
      case "cancelled":
        return "bg-red-100 text-red-800 ring-red-200"
      default:
        return "bg-gray-100 text-gray-800 ring-gray-200"
    }
  }

  const handlePrint = async (order: Order) => {
    try {
      const mod = await import("jspdf")
      // @ts-ignore - ESM default export shape
      const jsPDF = mod.jsPDF || mod.default?.jsPDF || mod.default
      const doc = new jsPDF()

      const safeStr = (v: any) => (v === undefined || v === null ? "" : String(v))
      const safeNum = (v: any) => (v === undefined || v === null || isNaN(Number(v)) ? 0 : Number(v))

      let y = 12
      const left = 14
      const right = 196 - 14
      const line = () => { doc.setDrawColor(200); doc.line(left, y, 196 - 14, y); }
      const bump = (dy = 6) => { y += dy; if (y > 280) { doc.addPage(); y = 12 } }

      // Header
      doc.setFontSize(14)
      doc.text("Votre Restaurant", (left + right) / 2, y, { align: "center" })
      bump(6)
      doc.setFontSize(16)
      doc.text(`Commande #${safeStr(order.id)}`, left, y)
      bump(7)
      doc.setFontSize(10)
      doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, left, y)
      bump(6)
      if (order.order_by) { doc.text(`Origine: ${safeStr(order.order_by)}`, left, y); bump(5) }
      if (order.type) { doc.text(`Type: ${safeStr(order.type)}`, left, y); bump(5) }
      if (order.planified === 1) {
        doc.text(`Planifiée: Oui${order.planified_at ? ` (${new Date(order.planified_at).toLocaleString()})` : ""}`, left, y)
        bump(5)
      }
      const clientName = order.customer?.name ?? order.borne_cust_name
      if (clientName) { doc.text(`Client: ${safeStr(clientName)}`, left, y); bump(5) }
      if (order.customer?.email) { doc.text(`Email: ${safeStr(order.customer.email)}`, left, y); bump(5) }

      line(); bump(6)

      // Payment + Flags
      doc.setFontSize(11)
      doc.text("Paiement", left, y)
      bump(5)
      doc.setFontSize(9)
      doc.text(`Payée: ${order.is_paid === 1 ? "Oui" : "Non"}`, left, y)
      doc.text(`À la caisse: ${order.payment_at_checkout === 1 ? "Oui" : "Non"}`, left + 60, y)
      bump(6)
      doc.setFontSize(11)
      doc.text("Flags", left, y)
      bump(5)
      doc.setFontSize(9)
      const flags: string[] = []
      if (order.isRead === 1) flags.push("Lu")
      if (order.isRefund === 1) flags.push("Remboursé")
      if (order.printed === 1) flags.push("Imprimé")
      if (order.at_place === 1) flags.push("Sur place")
      doc.text(flags.length ? flags.join(" • ") : "Aucun", left, y)
      bump(6)

      // References
      doc.setFontSize(11)
      doc.text("Références", left, y)
      bump(5)
      doc.setFontSize(9)
      const refs: string[] = []
      if (order.promocode_id !== null) refs.push(`Promo #${safeStr(order.promocode_id)}`)
      if (order.table_id !== null) refs.push(`Table #${safeStr(order.table_id)}`)
      if (order.delivery_address_id !== null) refs.push(`Adresse LIV #${safeStr(order.delivery_address_id)}`)
      if (order.cac_address_id !== null) refs.push(`Adresse CAC #${safeStr(order.cac_address_id)}`)
      if (order.stripe_payment_intent) refs.push(`Stripe ${safeStr(order.stripe_payment_intent)}`)
      doc.text(refs.length ? refs.join(" • ") : "-", left, y, { maxWidth: right - left })
      bump(8)

      line(); bump(6)

      // Articles
      doc.setFontSize(12)
      doc.text("Articles", left, y)
      bump(6)
      doc.setFontSize(10)
      const elements = Array.isArray(order.elements_order) ? order.elements_order : []
      for (const el of elements) {
        const name = el.product?.name ?? `Produit #${safeStr(el.product_id)}`
        const qty = safeNum(el.quantity)
        const lineTotal = safeNum(el.total_amount_element)
        const leftText = `${qty} × ${name}`
        doc.text(leftText, left, y, { maxWidth: right - left - 40 })
        doc.text(`${lineTotal.toFixed(2)} €`, right, y, { align: "right" })
        bump(6)
        if (el.comment) { doc.setFontSize(9); doc.text(`Note: ${safeStr(el.comment)}`, left + 4, y); doc.setFontSize(10); bump(5) }
        if (Array.isArray(el.sub_elements_order) && el.sub_elements_order.length > 0) {
          for (const sub of el.sub_elements_order) {
            const sname = sub.sub_product?.name ?? `Option #${safeStr(sub.sub_product_id)}`
            const sline = `> ${sname} × ${safeNum(sub.quantity)}`
            doc.setFontSize(9)
            doc.text(sline, left + 4, y, { maxWidth: right - left - 40 })
            doc.text(`${safeNum(sub.total_amount_sub_element).toFixed(2)} €`, right, y, { align: "right" })
            bump(5)
            doc.setFontSize(10)
          }
        }
        if (y > 280) { doc.addPage(); y = 12 }
      }

      bump(2); line(); bump(6)

      // Totals
      const subtotal = elements.reduce((sum, el) => sum + safeNum(el.total_amount_element), 0)
      doc.setFontSize(11)
      doc.text("Sous-total", left, y)
      doc.text(`${subtotal.toFixed(2)} €`, right, y, { align: "right" })
      bump(5)
      if (typeof order.fees === "number" && order.fees > 0) {
        doc.setFontSize(10)
        doc.text("Frais", left, y)
        doc.text(`${safeNum(order.fees).toFixed(2)} €`, right, y, { align: "right" })
        bump(5)
      }
      doc.setFontSize(12)
      doc.text("TOTAL", left, y)
      doc.text(`${safeNum(order.total_amount).toFixed(2)} €`, right, y, { align: "right" })
      bump(8)

      line(); bump(5)
      doc.setFontSize(10)
      doc.text("Merci pour votre commande !", (left + right) / 2, y, { align: "center" })

      doc.save(`commande-${safeStr(order.id)}.pdf`)
    } catch (err) {
      // Fallback to window.print approach if jsPDF not available
      try {
        const win = window.open("", "_blank", "noopener,noreferrer,width=600,height=800")
        if (!win) return
        const itemsHtml = (order.elements_order || [])
          .map(el => {
            const name = el.product?.name ?? `Produit #${el.product_id}`
            const qty = el.quantity
            const lineTotal = (el.total_amount_element ?? (el.price * (qty || 0))).toFixed(2)
            return `<tr><td style=\"padding:4px 0\">${qty ?? 0} × ${name}</td><td style=\"text-align:right\">${lineTotal} €</td></tr>`
          })
          .join("")
        const html = `<!doctype html><html><head><meta charset=\"utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" /><title>Commande #${order.id}</title></head><body>${itemsHtml}</body></html>`
        win.document.open(); win.document.write(html); win.document.close()
        win.addEventListener('load', ()=>{ win.print(); setTimeout(()=>win.close(), 300) })
      } catch (e2) {
        console.error("Impression impossible", e2)
      }
    }
  }

  // Derived counters from fetched data
  const { pendingCount, preparingCount, deliveredCount } = useMemo(() => {
    return {
      pendingCount: orders.filter((o) => o.status === "pending").length,
      preparingCount: orders.filter((o) => o.status === "preparing").length,
      deliveredCount: orders.filter((o) => o.status === "delivered").length,
    }
  }, [orders])

  // Filter options aligned with backend values
  const orderByOptions: { value: string; label: string }[] = [
    { value: "Tous", label: "Tous" },
    { value: "website", label: "Site web" },
    { value: "home", label: "Hôme" },
  ]

  const commandTypeOptions: { value: string; label: string }[] = [
    { value: "Tous", label: "Tous" },
    { value: "cac", label: "C.A.C" },
    { value: "liv", label: "Livraison" },
    { value: "at_place", label: "Sur place" },
    { value: "emporter", label: "À emporter" },
  ]

  // Fetch typed orders for 'Nouvelles Commande'
  const handlePendingClick = async () => {
    if (statusFilter === "pending") return;
    setStatusFilter("pending")
    setLoading(true)
    setError(null)
    try {
      const list = await getUnstructuredOrders()
      setOrders(list)
      setTotal(list.length)
    } catch (e) {
      setOrders([])
      setTotal(0)
      setError("Erreur réseau lors du chargement des commandes non structurées.")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div
            onClick={handlePendingClick}
            className={`relative overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-300 ${
              statusFilter === "pending"
                ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="p-6">
              <div
                className={`text-xs uppercase tracking-wider/5 font-medium/none ${
                  statusFilter === "pending" ? "opacity-90" : "text-gray-700 font-semibold"
                }`}
              >
                Nouvelles commandes
              </div>
              <div className="mt-2 text-3xl font-bold">{pendingCount}</div>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("preparing")}
            className={`rounded-xl shadow-sm cursor-pointer transition-all duration-300 ${
              statusFilter === "preparing"
                ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="p-6">
              <div
                className={`text-xs uppercase tracking-wider/5 font-semibold ${
                  statusFilter === "preparing" ? "text-white opacity-90" : "text-gray-700"
                }`}
              >
                En préparations
              </div>
              <div className="mt-2 text-3xl font-bold">{preparingCount}</div>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("delivered")}
            className={`rounded-xl shadow-sm cursor-pointer transition-all duration-300 ${
              statusFilter === "delivered"
                ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="p-6">
              <div
                className={`text-xs uppercase tracking-wider/5 font-semibold ${
                  statusFilter === "delivered" ? "text-white opacity-90" : "text-gray-700"
                }`}
              >
                Livrées
              </div>
              <div className="mt-2 text-3xl font-bold">{deliveredCount}</div>
            </div>
          </div>

          <div
            onClick={() => setStatusFilter("all")}
            className={`rounded-xl shadow-sm cursor-pointer transition-all duration-300 ${
              statusFilter === "all"
                ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white"
                : "bg-white border border-gray-200 text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="p-6">
              <div
                className={`text-xs uppercase tracking-wider/5 font-semibold ${
                  statusFilter === "all" ? "text-white opacity-90" : "text-gray-700"
                }`}
              >
                Historiques
              </div>
              <div className="mt-2 text-3xl font-bold">{total}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        

          {/* Quick Filter Bar */}
          <div className="flex flex-col gap-4 p-6 border-b border-gray-200 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.89 9.39l3.11 3.1a.75.75 0 1 0 1.06-1.06l-3.1-3.11A5.5 5.5 0 0 0 9 3.5Zm-4 5.5a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clipRule="evenodd" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par N° de commande ou client..."
                className="w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-purple-600/60 focus:border-purple-600"
              />
            </div>

           
          </div>

          {/* Filters Section */}
          <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3 border-b border-gray-200">
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-900">Planifier</label>
              <div className="flex flex-wrap gap-2">
                {["Tous", "Oui", "Non"].map((option) => (
                  <button
                    key={option}
                    onClick={() => setFilterType(option)}
                    className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-600/60 ${
                      filterType === option
                        ? "border-transparent bg-purple-600 text-white hover:bg-purple-700"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-gray-900">Order by</label>
              <div className="flex flex-wrap gap-2">
                {orderByOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setOrderBy(option.value)}
                    className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-600/60 ${
                      orderBy === option.value
                        ? "border-transparent bg-purple-600 text-white hover:bg-purple-700"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button className="mt-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-600/60">
                Manager
              </button>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-gray-900">Type de commande</label>
              <div className="flex flex-wrap gap-2">
                {commandTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setCommandType(option.value)}
                    className={`inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-purple-600/60 ${
                      commandType === option.value
                        ? "border-transparent bg-purple-600 text-white hover:bg-purple-700"
                        : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-600/95 text-white sticky top-0 z-10 shadow">
                    <th className="sticky left-0 z-20 bg-purple-600/95 px-6 py-3 text-left text-xs font-medium uppercase tracking-wide">Commande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide">Canal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide">Planifiée</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && (
                    <tr>
                      <td colSpan={8} className="px-6 py-6 text-center text-sm text-gray-500">Chargement...</td>
                    </tr>
                  )}
                  {!loading && error && (
                    <tr>
                      <td colSpan={8} className="px-6 py-6 text-center text-sm text-red-600">{error}</td>
                    </tr>
                  )}
                  {!loading && !error && filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-6 text-center text-sm text-gray-500">Aucune commande trouvée</td>
                    </tr>
                  )}
                  {!loading && !error && filteredOrders.map((order) => (
                    <tr key={order.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition">
                      <td className="sticky left-0 z-10 bg-white/80 backdrop-blur px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">{formatAmount(order.total_amount)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800 ring-1 ring-inset ring-green-200">
                          {order.order_by}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center rounded-full bg-pink-100 px-2.5 py-1 text-xs font-semibold text-pink-800 ring-1 ring-inset ring-pink-200">
                          {order.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{order.planified === 1 ? "Oui" : "Non"}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusBadgeClasses(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-2">
                          <button
                            aria-label="Imprimer"
                            title="Imprimer"
                            onClick={() => handlePrint(order)}
                            className="inline-flex items-center justify-center rounded-md bg-purple-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600/60 cursor-pointer"
                          >
                            <Printer className="h-4 w-4" />
                            <span className="sr-only">Imprimer</span>
                          </button>
                          <button
                            aria-label="Détails"
                            title="Détails"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-900 shadow-sm transition hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600/60 cursor-pointer"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Détails</span>
                          </button>
                          <button
                            aria-label="Annuler"
                            title="Annuler"
                            className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/60"
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Annuler</span>
                          </button>
                          <button
                            aria-label="Accepter"
                            title="Accepter"
                            className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600/60"
                          >
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Accepter</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selectedOrder && (
            <DetailsCommands order={selectedOrder} onClose={() => setSelectedOrder(null)} />
          )}

          {/* Footer Totals & Pagination */}
          <div className="flex flex-col gap-4 border-t border-gray-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700">
              <span className="font-medium">Total des commandes :</span>
              <span className="ml-2 font-semibold text-gray-900">{total}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Précédent
              </button>
              <span className="text-sm text-gray-700">Page {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={loading}
                className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
