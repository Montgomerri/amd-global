"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  Mail,
  Lock,
  Phone,
  MapPin,
  User,
} from "lucide-react";
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

export default function AuthClient() {
  const router = useRouter();

  // SAFE: now inside client component wrapped by Suspense
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/checkout";

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
                <p className="text-sm font-semibold text-gray-900">
                  AMN Global Imports
                </p>
              </div>

              <div className="mb-8">
                <h1 className="text-3xl font-semibold text-gray-900">
                  {isLogin ? "Welcome back," : "Create your account,"}
                </h1>
              </div>

              {error && (
                <div className="mb-5 text-red-600 text-sm">{error}</div>
              )}

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="w-full border p-3 rounded-xl mb-3"
              />

              <input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="w-full border p-3 rounded-xl mb-3"
              />

              {!isLogin && (
                <>
                  <input
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    className="w-full border p-3 rounded-xl mb-3"
                  />

                  <input
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="w-full border p-3 rounded-xl mb-3"
                  />

                  <input
                    placeholder="Address"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    className="w-full border p-3 rounded-xl mb-3"
                  />

                  <select
                    value={form.region}
                    onChange={(e) => update("region", e.target.value)}
                    className="w-full border p-3 rounded-xl mb-3"
                  >
                    <option value="">Select Region</option>
                    {ghanaRegions.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>

                  <input
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className="w-full border p-3 rounded-xl mb-3"
                  />
                </>
              )}

              <button
                onClick={isLogin ? handleLogin : handleRegister}
                disabled={loading}
                className="w-full bg-[#9AE600] p-3 rounded-xl font-bold"
              >
                {loading ? "Loading..." : isLogin ? "Login" : "Create Account"}
              </button>

              <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-4 text-sm underline"
              >
                {isLogin ? "Create account" : "Login"}
              </button>
            </div>
          </section>

          {/* RIGHT PANEL (kept minimal) */}
          <section className="hidden lg:flex items-center justify-center bg-gray-100">
            <p className="text-gray-500">Welcome</p>
          </section>

        </div>
      </div>
    </main>
  );
}