"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import swell from "@/lib/swell";
import { Loader2 } from "lucide-react";

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

  // LOGIN
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await swell.account.login(form.email, form.password);

      // ✅ FIXED HERE
      if ((res as any)?.email) {
        router.push("/checkout");
      } else {
        setError("Invalid email or password");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
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

      // ✅ FIXED HERE
      if ((res as any)?.email) {
        router.push("/checkout");
      } else {
        setError("Failed to create account");
      }
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-sm border">

        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          {isLogin
            ? "Login to continue to checkout"
            : "Fill in your details to continue"}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-3">

          {!isLogin && (
            <>
              <input
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              />

              <input
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
          />

          {!isLogin && (
            <>
              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              />

              <select
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
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
                className="w-full border rounded-lg px-3 py-2 text-sm outline-none"
              />
            </>
          )}
        </div>

        <button
          onClick={isLogin ? handleLogin : handleRegister}
          disabled={loading}
          className="mt-6 w-full bg-[#9AE600] text-gray-900 font-bold py-3 rounded-xl flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin w-4 h-4" />}
          {isLogin ? "Login" : "Create Account"}
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 text-black font-semibold"
          >
            {isLogin ? "Sign up" : "Login"}
          </button>
        </p>
      </div>
    </main>
  );
}