"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { updateOrderStatus } from "./core/request"

interface OrderStatusActionsProps {
  orderId: number
  onAccepted?: () => void
  onCanceled?: () => void
}

export default function OrderStatusActions({ orderId, onAccepted, onCanceled }: OrderStatusActionsProps) {
  const [loadingAction, setLoadingAction] = useState<"accept" | "cancel" | null>(null)
  const [confirming, setConfirming] = useState<"accept" | "cancel" | null>(null)

  const handleAccept = async () => {
    if (loadingAction) return
    setLoadingAction("accept")
    const ok = await updateOrderStatus(orderId, "accepted")
    setLoadingAction(null)
    if (ok) onAccepted?.()
  }

  const handleCancel = async () => {
    if (loadingAction) return
    setLoadingAction("cancel")
    const ok = await updateOrderStatus(orderId, "canceled")
    setLoadingAction(null)
    if (ok) onCanceled?.()
      
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button
          aria-label="Annuler"
          title="Annuler"
          onClick={() => setConfirming("cancel")}
          disabled={loadingAction !== null}
          className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-red-700 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-red-600/60 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Annuler</span>
        </button>
        <button
          aria-label="Accepter"
          title="Accepter"
          onClick={() => setConfirming("accept")}
          disabled={loadingAction !== null}
          className="inline-flex items-center justify-center rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-green-700 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-green-600/60 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Check className="h-4 w-4" />
          <span className="sr-only">Accepter</span>
        </button>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 bg-black/40 opacity-0 animate-[backdropFade_.18s_ease-out_forwards]" onClick={() => setConfirming(null)} />
          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black/5 opacity-0 animate-[modalIn_.2s_cubic-bezier(0.2,0.8,0.2,1)_forwards]">
            <div className={`px-5 py-4 border-b ${confirming === "accept" ? "border-emerald-100" : "border-rose-100"}`}>
              <div className="flex items-center gap-2">
                <div className={`inline-flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-inset ${confirming === "accept" ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-rose-50 text-rose-700 ring-rose-200"}`}>
                  {confirming === "accept" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </div>
                <h4 className="text-sm font-semibold text-gray-900">
                  {confirming === "accept" ? "Confirmer l’acceptation" : "Confirmer l’annulation"}
                </h4>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                {confirming === "accept"
                  ? `Voulez-vous passer la commande #${orderId} en préparation ?`
                  : `Voulez-vous envoyer la commande #${orderId} vers l’historique (annuler) ?`}
              </p>
            </div>
            <div className="px-5 py-4 flex items-center justify-end gap-2 bg-gray-50/70">
              <button
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 shadow-sm transition hover:bg-gray-50 active:translate-y-px focus:outline-none focus:ring-2 focus:ring-indigo-600/60"
                onClick={() => setConfirming(null)}
              >
                Non
              </button>
              <button
                className={`inline-flex items-center justify-center rounded-md px-3 py-1.5 text-xs font-medium text-white shadow-sm transition focus:outline-none focus:ring-2 active:translate-y-px ${
                  confirming === "accept"
                    ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/60"
                    : "bg-rose-600 hover:bg-rose-700 focus:ring-rose-600/60"
                }`}
                onClick={async () => {
                  if (confirming === "accept") {
                    await handleAccept()
                  } else {
                    await handleCancel()
                  }
                  setConfirming(null)
                }}
                disabled={loadingAction !== null}
              >
                {loadingAction ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z"></path>
                    </svg>
                    Traitement...
                  </span>
                ) : "Oui"}
              </button>
            </div>
          </div>
          <style>
            {`
              @keyframes modalIn {
                from { opacity: 0; transform: translateY(10px) scale(0.98); }
                to   { opacity: 1; transform: translateY(0px) scale(1); }
              }
              @keyframes backdropFade {
                from { opacity: 0; }
                to   { opacity: 1; }
              }
              @media (prefers-reduced-motion: reduce) {
                .animate-[modalIn_.2s_cubic-bezier(0.2,0.8,0.2,1)_forwards] { animation: none; opacity: 1; }
                .animate-[backdropFade_.18s_ease-out_forwards] { animation: none; opacity: 1; }
              }
            `}
          </style>
        </div>
      )}
    </>
  )
}


