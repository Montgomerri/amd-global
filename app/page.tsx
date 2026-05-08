"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, CalendarClock, ChevronRight,
  Headphones, PlugZap, ShieldCheck, ShoppingBag, Star, Truck,
  Zap, WashingMachine, Refrigerator, Tv, Fan, Microwave,
  AirVent, Smartphone, Lightbulb, CreditCard, X, Mail, Phone,
  MapPin, ChevronDown,
} from "lucide-react";

const categories = [
  { name: "Refrigerators", icon: Refrigerator },
  { name: "Washing Machines", icon: WashingMachine },
  { name: "Microwaves", icon: Microwave },
  { name: "Air Conditioners", icon: AirVent },
  { name: "Small Appliances", icon: Fan },
  { name: "Lighting", icon: Lightbulb },
];

const benefits = [
  { icon: Truck, title: "Fast nationwide delivery", text: "Quick dispatch on electronics and home appliances with live tracking from checkout to doorstep." },
  { icon: ShieldCheck, title: "Warranty-backed products", text: "Shop with confidence on selected items covered by manufacturer or store warranty options." },
  { icon: CreditCard, title: "Flexible payment options", text: "Pay with cards or mobile money." },
  { icon: Headphones, title: "Expert support", text: "Get help choosing the right appliance, fridge, or appliance for your home or business." },
];

const serviceCards = [
  { title: "Energy-saving picks", text: "Highlight efficient appliances and smart devices that reduce power use and running costs.", icon: Zap },
  { title: "Same-day order updates", text: "Send instant order confirmation, payment confirmation, and delivery status updates.", icon: CalendarClock },
];

const reviews = [
  { quote: "I found the exact appliance I needed, and the delivery updates were clear", name: "Ama K.", role: "Verified customer" },
  { quote: "The store makes it easy to shop appliances, and accessories without feeling crowded.", name: "Daniel M.", role: "Customer" },
  { quote: "Very clean layout, strong product info, and the checkout process felt smooth and trustworthy.", name: "Appiah T.", role: "Customer" },
];

const faqs = [
  { q: "Where is your physical store located?", a: "Our physical store is located in Accra, Ghana. We also operate fully online and deliver across all regions of Ghana." },
  { q: "What products do you sell?", a: "We sell a wide range of imported electronics and home appliances including TVs, refrigerators, washing machines, air conditioners, microwaves, smartphones, small appliances, and lighting." },
  { q: "Do you deliver outside Accra?", a: "Yes! We deliver nationwide across all 16 regions of Ghana. Same-day delivery is available for orders within Accra." },
  { q: "What payment methods do you accept?", a: "We accept mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money) and card payments through our secure Paystack checkout." },
  { q: "Do your products come with a warranty?", a: "Selected products come with manufacturer or store warranty. Warranty details are listed on each product page." },
  { q: "How long does delivery take?", a: "Orders within Accra are dispatched within 24–48 hours. Deliveries to other regions typically take 2–5 business days." },
  { q: "Can I return a product?", a: "Yes, we have a return policy for defective or damaged items. Please contact our support team within 48 hours of receiving your order." },
];

type ModalType = "about" | "support" | "contact" | "faq" | null;

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[28px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.2)] p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-[-0.06em] text-zinc-950">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 transition">
            <X className="h-5 w-5 text-zinc-500" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SectionLabel({ children, light }: { children: React.ReactNode; light?: boolean }) {
  if (light) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white/70 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-lime-400" />
        {children}
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600 shadow-sm">
      <span className="h-2 w-2 rounded-full bg-lime-500" />
      {children}
    </div>
  );
}

function BenefitCard({ icon: Icon, title, text }: { icon: React.ElementType; title: string; text: string }) {
  return (
    <div className="rounded-[24px] bg-white/10 border border-white/10 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-400 text-zinc-950">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-[18px] font-medium tracking-[-0.05em] text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/60">{text}</p>
    </div>
  );
}

export default function Page() {
  const [modal, setModal] = useState<ModalType>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#eef2ea] text-zinc-950">

      {/* ABOUT MODAL */}
      <Modal open={modal === "about"} onClose={() => setModal(null)} title="About AMNGlobal Imports">
        <div className="space-y-5">
          <div className="rounded-2xl bg-lime-50 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-lime-400 flex items-center justify-center text-zinc-900 font-bold text-lg">AG</div>
              <div>
                <p className="font-semibold text-zinc-900">AMN Global Imports</p>
                <p className="text-sm text-zinc-500">Accra, Ghana</p>
              </div>
            </div>
            <p className="text-sm text-zinc-600 leading-6">
              AMN Global Imports led by Albertha Nana Aba Boateng is a Ghanaian retail store specializing in the importation and sale of quality electronics and home appliances. We bring the best products from around the world directly to your doorstep across Ghana.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">What we sell</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Refrigerators", "Washing Machines", "Air Conditioners", "Microwaves", "Smartphones", "Smart TVs", "Lighting", "Small Appliances"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-zinc-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Our mission</h3>
            <p className="text-sm text-zinc-600 leading-6">
              To make quality imported electronics and home appliances accessible and affordable to every household in Ghana, with a seamless online shopping experience and reliable delivery nationwide.
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-4 flex items-center gap-3">
            <MapPin className="h-4 w-4 text-lime-600 shrink-0" />
            <p className="text-sm text-zinc-600">Based in Accra, Ghana  delivering nationwide</p>
          </div>
        </div>
      </Modal>

      {/* SUPPORT MODAL */}
      <Modal open={modal === "support"} onClose={() => setModal(null)} title="Support">
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">We're here to help! Reach out through any of the channels below and we'll get back to you as soon as possible.</p>
          <div className="space-y-3">
            {[
              { icon: Mail, label: "Email us", value: "amnghana959@gmail.com" },
              { icon: Phone, label: "Call or WhatsApp", value: "024 281 2273 , 024 773 9397" },
              { icon: Headphones, label: "Support hours", value: "Mon – Sat, 8am – 6pm GMT" },
              { icon: MapPin, label: "Location", value: "Accra, Ghana" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-zinc-100 p-4">
                <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-lime-700" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-zinc-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* CONTACT MODAL */}
      <Modal open={modal === "contact"} onClose={() => setModal(null)} title="Contact Us">
        <div className="space-y-4">
          <p className="text-sm text-zinc-500">Get in touch with AMNGlobal Imports for orders, inquiries, or partnerships.</p>
          <div className="space-y-3">
            {[
              { icon: ShoppingBag, label: "Business name", value: "AMNGlobal Imports" },
              { icon: Mail, label: "Email", value: "info@amnglobalimports.shop" },
              { icon: Phone, label: "Phone / WhatsApp", value: "+233 XX XXX XXXX" },
              { icon: MapPin, label: "Location", value: "Accra, Greater Accra, Ghana" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl bg-zinc-50 p-4">
                <div className="w-10 h-10 rounded-xl bg-lime-100 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-lime-700" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-zinc-900">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* FAQ MODAL */}
      <Modal open={modal === "faq"} onClose={() => setModal(null)} title="Frequently Asked Questions">
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-2xl border border-zinc-100 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-50 transition"
              >
                <span className="text-sm font-semibold text-zinc-900 pr-4">{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-zinc-600 leading-6">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>

      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-[#f8f7f2] px-4 pb-10 pt-4 sm:px-6 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(194,255,109,0.35)_0%,rgba(194,255,109,0.18)_30%,rgba(255,255,255,0)_72%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-120px] top-[120px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(133,255,202,0.28)_0%,rgba(133,255,202,0.12)_38%,rgba(255,255,255,0)_74%)] blur-3xl" />

        <header className="relative z-10 flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.04em]">
            <ShoppingBag className="h-5 w-5" />
            AMN Global Imports
          </div>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-700 md:gap-8">
            <Link href="/" className="hover:text-zinc-950">Home</Link>
            <Link href="/products" className="hover:text-zinc-950">Shop</Link>
            <button onClick={() => setModal("about")} className="hover:text-zinc-950">About</button>
            <button onClick={() => setModal("support")} className="hover:text-zinc-950">Support</button>
          </nav>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/auth" className="rounded-full bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm ring-1 ring-black/5 transition hover:bg-zinc-100">
              Login
            </Link>
            <Link href="/products" className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-zinc-800">
              Shop now
            </Link>
          </div>
        </header>

        <div className="relative z-10 flex w-full flex-col items-center text-center">
          <SectionLabel>Electronics • Home appliances • Smart living</SectionLabel>
          <h1 className="mt-6 max-w-[900px] text-[40px] leading-[0.92] tracking-[-0.09em] sm:text-[64px] lg:text-[92px]">
            POWER YOUR HOME
            <br />
            WITH SMARTER GEAR
          </h1>
          <p className="mt-5 max-w-[760px] text-sm leading-7 text-zinc-600 sm:text-base">
            Discover TVs, refrigerators, washing machines, air conditioners, and everyday home electronics built for comfort, convenience, and modern living.
          </p>
          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800">
              Shop electronics <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-950 shadow-sm ring-1 ring-black/5 transition hover:bg-zinc-100">
              View appliances
            </Link>
          </div>
          <div className="mt-10 grid w-full max-w-[1040px] grid-cols-1 gap-4 md:grid-cols-3">
            {[["24–48h", "dispatch on selected items"], ["Warranty", "backed on eligible products"], ["Expert help", "for every purchase decision"]].map(([title, sub]) => (
              <div key={title} className="rounded-[22px] bg-white px-6 py-5 text-left shadow-sm ring-1 ring-black/5">
                <div className="text-[28px] font-semibold tracking-[-0.07em]">{title}</div>
                <div className="mt-1 text-sm text-zinc-500">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE BAND */}
      <section className="w-full bg-zinc-950 px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionLabel light>Easy checkout • trusted store • retail-ready</SectionLabel>
            <h2 className="mt-5 max-w-[620px] text-[34px] leading-[0.95] tracking-[-0.08em] text-white sm:text-[44px] lg:text-[56px]">FAST SHOPPING,<br />CLEAR PRICING</h2>
            <p className="mt-5 max-w-[560px] text-sm leading-7 text-white/60 sm:text-base">Compare devices, choose the right appliance, and complete checkout without clutter.</p>
            <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-lime-300">
              Browse top deals <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[420px] rounded-[30px] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.14)] ring-1 ring-black/5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-500">Order summary</p>
                  <p className="text-lg font-medium tracking-[-0.04em]">Your cart</p>
                </div>
                <BadgeCheck className="h-6 w-6 text-lime-500" />
              </div>
              <div className="space-y-3 text-sm text-zinc-700">
                {[["Blender", "...."], ["Air Fryer", "...."], ["Delivery", "...."]].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                    <span>{label}</span><span className="font-medium text-zinc-950">{val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-zinc-950 px-4 py-3 text-white">
                <div className="flex items-center justify-between text-sm"><span>Total</span><span className="font-semibold">....</span></div>
              </div>
              <Link href="/checkout" className="mt-4 block w-full rounded-full bg-zinc-950 py-3 text-center text-sm font-medium text-white transition hover:bg-zinc-800">Checkout now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="w-full bg-[#eef2ea] px-4 py-10 sm:px-6 lg:px-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <SectionLabel>Shop by category</SectionLabel>
            <h2 className="mt-4 text-[34px] leading-[0.96] tracking-[-0.08em] sm:text-[48px]">FIND THE RIGHT PRODUCT FOR EVERY ROOM</h2>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-950">Browse all categories <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href="/products" className="flex items-center gap-4 rounded-[26px] bg-white p-5 shadow-[0_16px_38px_rgba(15,23,42,0.06)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-zinc-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white"><Icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-[17px] font-medium tracking-[-0.04em] text-zinc-950">{item.name}</div>
                  <div className="mt-1 text-sm text-zinc-500">Shop now</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* BENEFITS + FOUNDER PHOTO */}
      <section className="w-full bg-zinc-900 px-4 py-10 text-white sm:px-6 lg:px-12 lg:py-14">

        {/* Top row: small photo left + text right */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-8">

          {/* Founder photo — small and fixed */}
          <div className="relative shrink-0 w-[180px] sm:w-[220px]">
            <div className="w-full h-[240px] sm:h-[280px] overflow-hidden rounded-[16px]">
              <img
                src="/founder.jpg.png"
                alt="Albertha Nana Aba Boateng"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="mt-2 rounded-[10px] bg-lime-400 px-2.5 py-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-900">Founder & CEO</p>
              <p className="text-[11px] font-semibold text-zinc-800 mt-0.5 leading-tight">Albertha Nana Aba Boateng</p>
              <p className="text-[10px] text-zinc-700">AMN Global Imports</p>
            </div>
          </div>

          {/* Text */}
          <div className="flex-1">
            <SectionLabel light>Trusted store</SectionLabel>
            <h2 className="mt-4 text-[28px] leading-[0.95] tracking-[-0.08em] sm:text-[36px] lg:text-[44px]">BUILT FOR HOMES THAT WORK SMARTER</h2>
            <p className="mt-3 max-w-[560px] text-sm leading-7 text-white/70">Make shopping easier with clear product details, support you can reach, and reliable delivery — backed by someone who genuinely cares.</p>
            <div className="mt-4 space-y-2">
              {["Fast nationwide delivery across Ghana", "Warranty-backed products you can trust", "Flexible payment via Paystack"].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-lime-400 shrink-0" />
                  <p className="text-sm text-white/80">{point}</p>
                </div>
              ))}
            </div>
            <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-lime-300">
              Learn more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Benefit cards below */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => <BenefitCard key={item.title} {...item} />)}
        </div>

      </section>

      {/* WHY BUY HERE */}
      <section className="w-full bg-[#eef2ea] px-4 py-10 sm:px-6 lg:px-12">
        <div className="grid w-full gap-5 lg:grid-cols-2">
          <div className="rounded-[34px] bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.07)] ring-1 ring-black/5 lg:p-10">
            <SectionLabel>Why customers choose us</SectionLabel>
            <h2 className="mt-4 max-w-[480px] text-[32px] leading-[0.95] tracking-[-0.08em] sm:text-[44px]">EVERYTHING YOU NEED FOR A BETTER HOME SETUP</h2>
            <div className="mt-6 space-y-4">
              {serviceCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-[24px] bg-zinc-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-white"><Icon className="h-5 w-5" /></div>
                      <h3 className="text-lg font-medium tracking-[-0.04em] text-zinc-950">{card.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-zinc-600">{card.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-[34px] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.07)] ring-1 ring-black/5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#d9dee7_0%,#b9c0cc_100%)] p-5">
                <div className="flex h-full flex-col justify-between rounded-[22px] bg-white/65 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-zinc-900">Smart Appliances that get work done</div>
                    <Tv className="h-5 w-5 text-zinc-900" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-700">Reliable, Quality, and energy efficient.</p>
                  <Link href="/products" className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white">Shop <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            </div>
            <div className="rounded-[34px] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.07)] ring-1 ring-black/5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#edf7d0_0%,#d6e99b_100%)] p-5">
                <div className="flex h-full flex-col justify-between rounded-[22px] bg-white/70 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium text-zinc-900">Home appliance deals</div>
                    <PlugZap className="h-5 w-5 text-zinc-900" />
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-[-0.08em] text-zinc-950">Save</div>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">Bundles and energy-saving appliances made for busy households.</p>
                  </div>
                  <Link href="/products" className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white">View deals <ArrowRight className="h-4 w-4" /></Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE SHOPPING + UPDATES */}
      <section className="w-full bg-[#eef2ea] px-4 py-6 sm:px-6 lg:px-12">
        <div className="grid w-full gap-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[34px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] ring-1 ring-black/5 lg:p-10">
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div className="relative flex aspect-[4/5] items-center justify-center rounded-[28px] bg-zinc-950 p-6 text-white">
                <div className="text-center">
                  <Smartphone className="mx-auto h-12 w-12 text-lime-400" />
                  <div className="mt-4 text-2xl font-semibold tracking-[-0.06em]">Smart devices</div>
                  <p className="mt-2 text-sm leading-6 text-white/70">Phones, tablets, earbuds, and everyday tech.</p>
                </div>
              </div>
              <div>
                <SectionLabel>Mobile shopping</SectionLabel>
                <h3 className="mt-4 text-[30px] leading-[0.96] tracking-[-0.08em] sm:text-[42px]">SHOP ELECTRONICS<br />FROM ANY DEVICE</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600">The layout stays smooth on phones and tablets, so customers can browse, compare, and purchase with ease.</p>
                <Link href="/products" className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">Explore store <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-[34px] bg-[#dff7be] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] ring-1 ring-black/5 lg:p-10">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <SectionLabel>Customer engagement</SectionLabel>
                <h3 className="mt-4 text-[30px] leading-[0.96] tracking-[-0.08em] sm:text-[42px]">STAY UPDATED<br />AFTER PURCHASE</h3>
                <p className="mt-4 text-sm leading-7 text-zinc-700">Give customers confidence with order confirmations and delivery progress.</p>
              </div>
              <div className="relative flex aspect-[4/5] items-center justify-center rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
                <div className="text-center">
                  <ShieldCheck className="mx-auto h-12 w-12 text-lime-600" />
                  <p className="mt-4 text-2xl font-semibold tracking-[-0.06em] text-zinc-950">Secure delivery</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">Careful handling for large appliances.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS + CTA */}
      <section id="reviews" className="w-full bg-[#eef2ea] px-4 py-10 sm:px-6 lg:px-12">
        <div className="grid w-full gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[34px] bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.07)] ring-1 ring-black/5 lg:p-10">
            <SectionLabel>Customer stories</SectionLabel>
            <h2 className="mt-4 max-w-[520px] text-[32px] leading-[0.95] tracking-[-0.08em] sm:text-[44px]">MADE FOR PEOPLE WHO BUY WITH CONFIDENCE</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.name} className="rounded-[24px] bg-zinc-50 p-5">
                  <div className="flex items-center gap-1 text-lime-500">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-zinc-700">"{review.quote}"</p>
                  <div className="mt-5 text-sm font-medium text-zinc-950">{review.name}</div>
                  <div className="text-xs text-zinc-500">{review.role}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[34px] bg-zinc-950 p-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] lg:p-10">
            <SectionLabel light>Limited offer</SectionLabel>
            <h2 className="mt-4 text-[32px] leading-[0.95] tracking-[-0.08em] sm:text-[44px]">GET THE BEST<br />DEALS FOR YOUR HOME</h2>
            <div className="mt-8 rounded-[28px] bg-white p-5 text-zinc-950">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xl font-medium tracking-[-0.05em]">Same day delivery for orders within Accra</p>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-lime-700 shrink-0">
                  <span className="text-sm font-semibold">%</span>
                </div>
              </div>
              <Link href="/products" className="mt-5 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">Claim offer <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
              <Headphones className="h-4 w-4 text-lime-400" />
              24/7 support for your customers
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-zinc-950 px-4 pb-10 pt-10 sm:px-6 lg:px-12">
        <div className="grid w-full gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.04em] text-white">
              <ShoppingBag className="h-5 w-5" />
              AMN Global Imports
            </div>
            <p className="mt-4 max-w-[260px] text-sm leading-6 text-white/50">Electronics and home appliances with a clean, trustworthy shopping experience from discovery to delivery.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Shop</h3>
            <div className="mt-4 space-y-2">
              <Link href="/products" className="block text-sm text-white/50 hover:text-white">New arrivals</Link>
              <Link href="/products" className="block text-sm text-white/50 hover:text-white">Browse products</Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <div className="mt-4 space-y-2">
              <button onClick={() => setModal("about")} className="block text-sm text-white/50 hover:text-white">About us</button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <div className="mt-4 space-y-2">
              <button onClick={() => setModal("support")} className="block text-sm text-white/50 hover:text-white">Help center</button>
              <button onClick={() => setModal("contact")} className="block text-sm text-white/50 hover:text-white">Contact</button>
              <button onClick={() => setModal("faq")} className="block text-sm text-white/50 hover:text-white">FAQ</button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/30">
          © 2026 AMNGlobal Imports. Built for electronics and home appliance sales.
        </div>
      </footer>
    </main>
  );
}