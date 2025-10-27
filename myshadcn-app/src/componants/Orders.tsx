"use client"

import { useState } from "react"

interface OrderItem {
  id: number
  orderNumber: string
  date: string
  clientName: string
  amount: string
  orderBy: string
  type: string
  planned: string
}

const mockOrders: OrderItem[] = [
  {
    id: 1,
    orderNumber: "0772",
    date: "10/20/2025",
    clientName: "J",
    amount: "13.49 €",
    orderBy: "Done",
    type: "Sur place",
    planned: "Non",
  },
]

export default function Order() {
  const [filterType, setFilterType] = useState("Tous")
  const [orderBy, setOrderBy] = useState("Tous")
  const [commandType, setCommandType] = useState("Tous")
  const [impression, setImpression] = useState("Normale")

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {/* New Orders */}
        <div className="bg-purple-600 text-white p-6 rounded-lg shadow-md">
          <div className="text-sm font-semibold tracking-wide">NOUVELL COMMANDES</div>
          <div className="text-3xl font-bold mt-2">1</div>
        </div>

        {/* In Preparation */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="text-sm font-semibold text-gray-700">EN PRÉPARATIONS</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
        </div>

        {/* Delivered */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="text-sm font-semibold text-gray-700">LIVREE</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">0</div>
        </div>

        {/* Historical */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="text-sm font-semibold text-gray-700">HISTORIQUES</div>
          <div className="text-3xl font-bold text-gray-900 mt-2">630</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Title and Impression */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">LISTE DES COMMANDES</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-gray-700">Impression :</span>
            <select
              value={impression}
              onChange={(e) => setImpression(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded text-sm bg-white cursor-pointer"
            >
              <option>Désactiver</option>
              <option>Normale</option>
              <option>Multiple</option>
            </select>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-200">
          {/* Planifier */}
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-3">Planifier :</label>
            <div className="flex gap-2">
              {["Tous", "Oui", "Non"].map((option) => (
                <button
                  key={option}
                  onClick={() => setFilterType(option)}
                  className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                    filterType === option
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Order by */}
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-3">Order by :</label>
            <div className="flex gap-2">
              {["Tous", "Site web", "Hôme"].map((option) => (
                <button
                  key={option}
                  onClick={() => setOrderBy(option)}
                  className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                    orderBy === option
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <button className="mt-2 px-4 py-2 rounded border border-gray-300 text-sm font-medium text-gray-900 bg-white hover:bg-gray-50">
              Manager
            </button>
          </div>

          {/* Type de commande */}
          <div>
            <label className="text-sm font-semibold text-gray-900 block mb-3">Type de commande :</label>
            <div className="flex gap-2">
              {["Tous", "Livraison", "Importer"].map((option) => (
                <button
                  key={option}
                  onClick={() => setCommandType(option)}
                  className={`px-4 py-2 rounded border text-sm font-medium transition-colors ${
                    commandType === option
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-900 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="px-4 py-3 text-left text-sm font-semibold">INDEX</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">ORDER N°</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">DATE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">NOM DU CLIENT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">MONTANT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">ORDER_BY</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">TYPE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">PLANIFIÉE</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">ACTION</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {mockOrders.map((order, index) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{order.orderNumber}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{order.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{order.clientName}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{order.amount}</td>
                  <td className="px-4 py-4 text-sm">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {order.orderBy}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-xs font-medium">
                      {order.type}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">{order.planned}</td>
                  <td className="px-4 py-4 text-sm">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700 transition-colors">
                        Imprimer
                      </button>
                      <button className="px-3 py-1 bg-gray-200 text-gray-900 rounded text-xs font-medium hover:bg-gray-300 transition-colors">
                        Détails
                      </button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors">
                        Annuler
                      </button>
                      <button className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors">
                        Accepter
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Totals */}
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Total des commandes de type pending :</span>
            <span className="ml-2 font-bold text-gray-900">13.49 €</span>
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold">Total des commandes d'aujourd'hui :</span>
            <span className="ml-2 font-bold text-gray-900">13.49 €</span>
          </div>
        </div>
      </div>
    </div>
  )
}
