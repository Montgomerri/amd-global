"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import swell from "@/lib/swell";
import { Loader2 } from "lucide-react";

const ghanaRegions = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Central",
  "Northern", "Upper East", "Upper West", "Volta", "Bono",
  "Bono East", "Ahafo", "Savannah", "North East", "Oti", "Western North",
];

export default function AuthPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    phone: "", address: "", city: "", region: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    try {
      const res = await swell.account.login(form.email, form.password);
      if (res?.email) router.push("/checkout");
      else setError("Invalid email or password.");
    } catch { setError("Invalid email or password."); }
    finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.phone || !form.address || !form.city || !form.region) {
      setError("Please fill in all fields."); return;
    }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    try {
      const res = await swell.account.create({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
        phone: `+233${form.phone}`,
        shipping: {
          name: `${form.firstName} ${form.lastName}`,
          address1: form.address,
          city: form.city,
          state: form.region,
          country: "GH",
          phone: `+233${form.phone}`,
        },
      });
      if (res?.email) router.push("/checkout");
      else setError("Something went wrong. Please try again.");
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="container">

        {/* LEFT SIDE */}
        <div className="left">
          <div className="logo">
            <span className="dot" />
            AMD Global Imports
          </div>

          <div>
            <h1>{isSignup ? "Create account" : "Welcome back"}</h1>
            <p className="subtitle">
              {isSignup
                ? "Create your account to get started."
                : "Welcome back! Please enter your details."}
            </p>

            {error && <p className="error">{error}</p>}

            <div className="form">

              {/* LOGIN */}
              {!isSignup && (
                <>
                  <input type="email" placeholder="Enter your email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                  <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => update("password", e.target.value)} />
                  <div className="row">
                    <label><input type="checkbox" /> Remember for 30 days</label>
                    <button type="button" className="link">Forgot password</button>
                  </div>
                </>
              )}

              {/* SIGNUP */}
              {isSignup && (
                <>
                  <div className="two-col">
                    <input type="text" placeholder="First name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
                    <input type="text" placeholder="Last name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
                  </div>
                  <input type="email" placeholder="Enter your email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                  <input type="password" placeholder="Password (min. 6 characters)" value={form.password} onChange={(e) => update("password", e.target.value)} />
                  <div className="phone-row">
                    <span className="phone-prefix">🇬🇭 +233</span>
                    <input type="tel" placeholder="XX XXX XXXX" value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 9))} />
                  </div>
                  <input type="text" placeholder="Delivery address (Street / Area / Landmark)" value={form.address} onChange={(e) => update("address", e.target.value)} />
                  <div className="two-col">
                    <input type="text" placeholder="City" value={form.city} onChange={(e) => update("city", e.target.value)} />
                    <select value={form.region} onChange={(e) => update("region", e.target.value)}>
                      <option value="">Region</option>
                      {ghanaRegions.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </>
              )}

              <button className="primary" onClick={isSignup ? handleRegister : handleLogin} disabled={loading}>
                {loading ? <Loader2 size={16} className="spin" /> : isSignup ? "Sign up" : "Sign in"}
              </button>

            </div>

            <p className="switch">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => { setIsSignup(!isSignup); setError(""); }}>
                {isSignup ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>

          <p className="footer">© AMD Global Imports {new Date().getFullYear()}</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <div className="orb"></div>
          <div className="reflection"></div>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .container {
          width: 100%;
          max-width: 1100px;
          background: white;
          border-radius: 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .left {
          padding: 48px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow-y: auto;
          max-height: 100vh;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 32px;
        }
        .dot {
          width: 8px;
          height: 8px;
          background: #9AE600;
          border-radius: 50%;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 8px;
          font-weight: 600;
        }
        .subtitle {
          color: #666;
          margin-bottom: 24px;
          font-size: 14px;
        }
        .error {
          color: #ef4444;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .phone-row {
          display: flex;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        .phone-prefix {
          display: flex;
          align-items: center;
          padding: 0 12px;
          background: #f9f9f9;
          font-size: 13px;
          color: #555;
          white-space: nowrap;
          border-right: 1px solid #ddd;
        }
        .phone-row input {
          border: none !important;
          border-radius: 0 !important;
          flex: 1;
          box-shadow: none !important;
        }
        input, select {
          padding: 12px 14px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          outline: none;
          width: 100%;
          box-sizing: border-box;
          background: white;
          color: #111;
        }
        input:focus, select:focus {
          border-color: #9AE600;
          box-shadow: 0 0 0 2px rgba(154, 230, 0, 0.2);
        }
        .row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          color: #666;
          align-items: center;
        }
        .row label {
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .link {
          background: none;
          border: none;
          color: #000;
          cursor: pointer;
          font-size: 13px;
        }
        .primary {
          margin-top: 4px;
          background: #9AE600;
          color: #111;
          border: none;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .primary:hover { background: #82c800; }
        .primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .switch {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }
        .switch button {
          color: #9AE600;
          border: none;
          background: none;
          cursor: pointer;
          font-weight: 600;
        }
        .footer {
          font-size: 12px;
          color: #aaa;
          margin-top: 32px;
        }
        .right {
          background: #f3f2f7;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .orb {
          width: 200px;
          height: 200px;
          background: radial-gradient(circle at 30% 30%, #9AE600, #ffffff);
          border-radius: 50%;
          filter: blur(6px);
        }
        .reflection {
          position: absolute;
          width: 200px;
          height: 100px;
          bottom: 30%;
          background: linear-gradient(to bottom, rgba(154, 230, 0, 0.3), transparent);
          border-radius: 50%;
          filter: blur(20px);
        }
        @media (max-width: 900px) {
          .container { grid-template-columns: 1fr; }
          .right { display: none; }
        }
      `}</style>
    </div>
  );
}