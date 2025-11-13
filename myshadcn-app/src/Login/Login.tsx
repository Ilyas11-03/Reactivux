"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, Eye, EyeOff, UtensilsCrossed } from "lucide-react"
import { loginSuperAdmin } from "./core/request"
import './Login.css'

interface LoginProps {
  onLoginSuccess?: () => void
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setSubmitError(null)
    try {
      const result = await loginSuperAdmin(email, password)
      if (result && result.accessToken) {
        // Token and uuid stored by loginSuperAdmin; trigger parent to show dashboard
        onLoginSuccess?.()
      } else {
        setSubmitError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setSubmitError("Unable to sign in. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-600 to-orange-500 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Restaurant Login</h1>
            <p className="text-slate-600">Connectez-vous pour gérer vos commandes</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {submitError}
              </div>
            )}
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${
                    errors.email
                      ? "border-red-500 bg-red-50 focus:border-red-600"
                      : "border-slate-200 bg-slate-50 focus:border-slate-900 focus:bg-white"
                  }`}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
               
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-2.5 rounded-lg border-2 transition-colors focus:outline-none ${
                    errors.password
                      ? "border-red-500 bg-red-50 focus:border-red-600"
                      : "border-slate-200 bg-slate-50 focus:border-slate-900 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-900 to-slate-700 hover:from-slate-800 hover:to-slate-600 disabled:from-slate-400 disabled:to-slate-300 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          

       
        </div>

        {/* Footer Text */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Protected by reCAPTCHA and subject to the{" "}
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="hover:underline">
            Terms of Service
          </a>
        </p>
      </div>
    </div>
  )
}
