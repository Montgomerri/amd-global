"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import swell from "@/lib/swell";
import {
  Bell,
  ChevronDown,
  Mail,
  Search,
  Settings,
  Shield,
  User,
  LogOut,
  Home,
  Package,
  Heart,
  CreditCard,
  Save,
  Edit3,
} from "lucide-react";

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

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/products" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Package, label: "Orders", href: "/orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: CreditCard, label: "Payments", href: "/checkout" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    region: "",
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const account = await swell.account.get();

        if (!account) {
          router.push("/auth?next=profile");
          return;
        }

        setUser(account);
        setForm({
          name: account.name || "",
          email: account.email || "",
          phone: account.phone || "",
          address: account.shipping?.address1 || account.billing?.address1 || "",
          city: account.shipping?.city || account.billing?.city || "",
          region: account.shipping?.state || account.billing?.state || "",
        });
      } catch (err) {
        console.error("Failed to load account:", err);
        router.push("/auth?next=profile");
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [router]);

  const initials = useMemo(() => {
    const name = form.name?.trim() || user?.name || "U";
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? "U"}${parts[1][0] ?? ""}`.toUpperCase();
  }, [form.name, user]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await swell.account.update({
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

      setUser((prev: any) => ({
        ...prev,
        name: form.name,
        phone: form.phone,
        billing: {
          ...(prev?.billing || {}),
          address1: form.address,
          city: form.city,
          state: form.region,
          country: "GH",
        },
        shipping: {
          ...(prev?.shipping || {}),
          address1: form.address,
          city: form.city,
          state: form.region,
          country: "GH",
        },
      }));

      setMessage("Profile updated successfully.");
      setEditMode(false);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await swell.account.logout();
      router.push("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
      setError("Logout failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#c9dcff] via-[#f3f6ff] to-[#fbf5d9] flex items-center justify-center px-4">
        <div className="rounded-3xl bg-white/70 backdrop-blur border border-white/70 shadow-[0_20px_60px_rgba(28,41,66,0.12)] px-6 py-5 text-sm text-gray-600">
          Loading your profile...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#c9dcff] via-[#f6f8ff] to-[#fbf5d9] p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white/80 backdrop-blur-xl shadow-[0_24px_90px_rgba(26,34,56,0.14)] ring-1 ring-white/80 overflow-hidden min-h-[calc(100vh-2rem)]">
        <div className="flex min-h-[calc(100vh-2rem)]">
          <aside className="hidden md:flex w-20 lg:w-24 flex-col items-center border-r border-gray-100 bg-white/70 py-8 gap-8">
            <div className="w-11 h-11 rounded-2xl bg-[#eff4ff] flex items-center justify-center shadow-sm">
              <User className="h-5 w-5 text-blue-500" />
            </div>

            <nav className="flex flex-col items-center gap-4">
              {sidebarItems.map((item, index) => {
                const Icon = item.icon;
                const active = index === 1;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                      active ? "bg-[#edf4ff] text-blue-500" : "text-gray-300 hover:bg-gray-50 hover:text-gray-500"
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </nav>
          </aside>

          <section className="flex-1 px-5 sm:px-8 lg:px-10 py-6 sm:py-8">
            <div className="flex flex-col gap-6">
              <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-semibold text-slate-700">
                    Welcome, {form.name || "User"}
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Manage your account details, contact information, and delivery address.
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start">
                  <div className="hidden sm:flex items-center gap-2 h-12 w-[280px] rounded-2xl bg-white border border-gray-100 px-4 shadow-sm">
                    <Search className="h-4 w-4 text-gray-400" />
                    <input
                      placeholder="Search"
                      className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
                    />
                  </div>

                  <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:text-gray-700 transition">
                    <Bell className="h-4 w-4" />
                  </button>

                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 shadow-sm flex items-center justify-center text-white font-bold">
                    {initials}
                  </div>
                </div>
              </header>

              <div className="rounded-[1.8rem] overflow-hidden bg-white shadow-[0_18px_50px_rgba(23,34,56,0.08)] border border-gray-100">
                <div className="h-28 sm:h-32 bg-gradient-to-r from-[#b7d3ff] via-[#eef2ff] to-[#fdf5d8]" />

                <div className="px-5 sm:px-8 lg:px-10 pb-8">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 rounded-full bg-white p-1 shadow-lg ring-4 ring-white overflow-hidden flex items-center justify-center">
                          <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-700 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                            {initials}
                          </div>
                        </div>

                        <div>
                          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                            {form.name || "Your Profile"}
                          </h2>
                          <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="h-4 w-4" />
                            <span>{form.email || "No email found"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setEditMode((prev) => !prev)}
                          className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 transition"
                        >
                          <Edit3 className="h-4 w-4" />
                          {editMode ? "View" : "Edit"}
                        </button>
                      </div>
                    </div>

                    {(message || error) && (
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm ${
                          error
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        {error || message}
                      </div>
                    )}

                    <div className="grid gap-5 lg:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        <input
                          value={form.name}
                          onChange={(e) => update("name", e.target.value)}
                          disabled={!editMode}
                          placeholder="Your full name"
                          className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none ring-0 placeholder:text-gray-300 disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        <input
                          value={form.email}
                          disabled
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-500 outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                        <input
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          disabled={!editMode}
                          placeholder="Your phone number"
                          className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Region</label>
                        <div className="relative">
                          <select
                            value={form.region}
                            onChange={(e) => update("region", e.target.value)}
                            disabled={!editMode}
                            className="w-full appearance-none rounded-2xl border border-gray-100 bg-white px-4 py-3 pr-10 text-sm text-gray-800 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                          >
                            <option value="">Select Region</option>
                            {ghanaRegions.map((region) => (
                              <option key={region} value={region}>
                                {region}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        </div>
                      </div>

                      <div className="space-y-2 lg:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Delivery Address</label>
                        <input
                          value={form.address}
                          onChange={(e) => update("address", e.target.value)}
                          disabled={!editMode}
                          placeholder="Street address"
                          className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">City</label>
                        <input
                          value={form.city}
                          onChange={(e) => update("city", e.target.value)}
                          disabled={!editMode}
                          placeholder="City"
                          className="w-full rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-800 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Security</label>
                        <div className="flex h-[50px] items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 text-sm text-gray-500">
                          <Shield className="h-4 w-4 text-emerald-500" />
                          Account protected by Swell
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        <span>We use this address for checkout and order updates.</span>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {editMode && (
                          <button
                            onClick={handleSave}
                            disabled={saving}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9AE600] px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:opacity-90 disabled:opacity-60 transition"
                          >
                            <Save className="h-4 w-4" />
                            {saving ? "Saving..." : "Save Changes"}
                          </button>
                        )}

                        <button
                          onClick={handleLogout}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-5 py-3 text-sm font-semibold text-red-500 shadow-sm hover:bg-red-50 transition"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
