"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ArrowRight, Mail, Lock, Phone, MapPin, User } from "lucide-react";
import swell from "@/lib/swell";

const ghanaRegions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Northern",
  "Upper East",
  "Upper West",
  "Volta",
  "Bono",
  "Bono East",
  "Ahafo",
  "Western North",
  "Oti",
  "Savannah",
  "North East",
];

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/checkout";

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    address: "",
    region: "",
    city: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await swell.account.login(form.email, form.password);

      if ((res as any)?.email) {
        router.push(nextPath);
      } else {
        setError("Invalid email or password.");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await swell.account.create({
        email: form.email,
        password: form.password,
        name: form.name,
        phone: form.phone,
        billing: {
          address1: form.address,
          city: form.city,
          state: form.region,
          country: "GH",
        },
        shipping: {
          address1: form.address,
          city: form.city,
          state: form.region,
          country: "GH",
        },
      });

      if ((res as any)?.email) {
        router.push(nextPath);
      } else {
        setError("Failed to create account.");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#e9edf4] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_20px_60px_rgba(20,28,50,0.12)] border border-white/70">
        <div className="grid min-h-[720px] lg:grid-cols-2">
          {/* LEFT PANEL */}
          <section className="bg-white px-5 sm:px-8 md:px-12 py-8 sm:py-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-900 tracking-wide">
                  AMD Global Imports
                </p>
              </div>

              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 leading-tight">
                  {isLogin ? "Welcome back," : "Create your account,"}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-500">
                  {isLogin
                    ? "Please enter your details to continue."
                    : "Sign up to start shopping and checkout faster."}
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {!isLogin && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Full name
                      </label>
                      <div className="relative">
                        <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          placeholder="Your full name"
                          className="w-full rounded-2xl border border-gray-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-[#9AE600]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Phone number
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          placeholder="Phone number"
                          className="w-full rounded-2xl border border-gray-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-[#9AE600]"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-[#9AE600]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                      placeholder="Enter your password"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-[#9AE600]"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <input
                          value={form.address}
                          onChange={(e) => update("address", e.target.value)}
                          placeholder="Street address"
                          className="w-full rounded-2xl border border-gray-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-[#9AE600]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Region
                        </label>
                        <select
                          value={form.region}
                          onChange={(e) => update("region", e.target.value)}
                          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#9AE600]"
                        >
                          <option value="">Select Region</option>
                          {ghanaRegions.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          City
                        </label>
                        <input
                          value={form.city}
                          onChange={(e) => update("city", e.target.value)}
                          placeholder="City"
                          className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#9AE600]"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={isLogin ? handleLogin : handleRegister}
                disabled={loading}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#9AE600] px-4 py-3.5 text-sm font-bold text-gray-900 shadow-sm transition hover:opacity-90 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{isLogin ? "Login" : "Create Account"}</span>
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>

              <p className="mt-5 text-center text-sm text-gray-500">
                {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    setError("");
                    setIsLogin((prev) => !prev);
                  }}
                  className="font-semibold text-gray-900 underline-offset-4 hover:underline"
                >
                  {isLogin ? "Sign up" : "Login"}
                </button>
              </p>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <section className="relative hidden lg:flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#eef2ff] via-[#ebfff3] to-[#f7fbdd] px-10 py-10">
            <div className="absolute inset-0 opacity-90">
              <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-[#9AE600]/15 blur-3xl" />
              <div className="absolute right-6 bottom-8 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.75),transparent_40%),radial-gradient(circle_at_25%_75%,rgba(154,230,0,0.22),transparent_36%)]" />
            </div>

            <div className="relative z-10 max-w-md">
              <div className="rounded-[2rem] border border-white/70 bg-white/35 backdrop-blur-sm p-8 shadow-[0_20px_60px_rgba(28,41,66,0.08)]">
                <div className="mb-5 h-24 w-24 rounded-full bg-gradient-to-br from-[#9AE600] to-cyan-300 blur-[1px] opacity-80" />
                <p className="text-lg leading-8 text-gray-800">
                  “Imagination is more important than knowledge. For knowledge is limited, whereas imagination embraces the entire world.”
                </p>
                <p className="mt-4 text-sm text-gray-500">— Albert Einstein</p>
              </div>
            </div>
          </section>

          {/* MOBILE RIGHT PANEL */}
          <section className="lg:hidden border-t border-gray-100 bg-gradient-to-br from-[#eef2ff] via-[#ebfff3] to-[#f7fbdd] px-5 py-8">
            <div className="max-w-md mx-auto rounded-[2rem] border border-white/70 bg-white/35 backdrop-blur-sm p-6 shadow-[0_20px_60px_rgba(28,41,66,0.08)]">
              <p className="text-base leading-7 text-gray-800">
                “Imagination is more important than knowledge.”
              </p>
              <p className="mt-3 text-sm text-gray-500">— Albert Einstein</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}