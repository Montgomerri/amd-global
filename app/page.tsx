import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronRight,
  Headphones,
  PlugZap,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Wrench,
  Zap,
  WashingMachine,
  Refrigerator,
  Tv,
  Fan,
  Microwave,
  AirVent,
  Smartphone,
  Lightbulb,
  CreditCard,
} from "lucide-react";

const categories = [
  { name: "Smart TVs", icon: Tv },
  { name: "Refrigerators", icon: Refrigerator },
  { name: "Washing Machines", icon: WashingMachine },
  { name: "Microwaves", icon: Microwave },
  { name: "Air Conditioners", icon: AirVent },
  { name: "Small Appliances", icon: Fan },
  { name: "Smartphones", icon: Smartphone },
  { name: "Lighting", icon: Lightbulb },
];

const benefits = [
  {
    icon: Truck,
    title: "Fast nationwide delivery",
    text: "Quick dispatch on electronics and home appliances with live tracking from checkout to doorstep.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty-backed products",
    text: "Shop with confidence on selected items covered by manufacturer or store warranty options.",
  },
  {
    icon: CreditCard,
    title: "Flexible payment options",
    text: "Pay with cards, mobile money, or split payments on eligible home appliances.",
  },
  {
    icon: Headphones,
    title: "Expert support",
    text: "Get help choosing the right TV, fridge, or appliance for your home or business.",
  },
];

const serviceCards = [

  {
    title: "Energy-saving picks",
    text: "Highlight efficient appliances and smart devices that reduce power use and running costs.",
    icon: Zap,
  },
  {
    title: "Same-day order updates",
    text: "Send instant order confirmation, payment confirmation, and delivery status updates.",
    icon: CalendarClock,
  },
];

const reviews = [
  {
    quote:
      "I found the exact refrigerator I needed, and the delivery updates were clear from start to finish.",
    name: "Ama K.",
    role: "Verified customer",
  },
  {
    quote:
      "The store makes it easy to compare TVs, appliances, and accessories without feeling crowded.",
    name: "Daniel M.",
    role: "Repeat buyer",
  },
  {
    quote:
      "Very clean layout, strong product info, and the checkout process felt smooth and trustworthy.",
    name: "Leah T.",
    role: "First-time shopper",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-zinc-600 shadow-sm">
      <span className="h-2 w-2 rounded-full bg-lime-500" />
      {children}
    </div>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ElementType;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.07)] ring-1 ring-black/5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lime-100 text-zinc-950">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-[20px] font-medium tracking-[-0.05em] text-zinc-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{text}</p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#eef2ea] text-zinc-950">
      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-[#f8f7f2] px-4 pb-10 pt-4 sm:px-6 lg:px-12">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(194,255,109,0.35)_0%,rgba(194,255,109,0.18)_30%,rgba(255,255,255,0)_72%)] blur-3xl" />
        <div className="pointer-events-none absolute right-[-120px] top-[120px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle,rgba(133,255,202,0.28)_0%,rgba(133,255,202,0.12)_38%,rgba(255,255,255,0)_74%)] blur-3xl" />

        <header className="relative z-10 flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.04em]">
            <ShoppingBag className="h-5 w-5" />
            Amd Global Imports
          </div>

          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-700 md:gap-8">
            <Link href="/" className="hover:text-zinc-950">
              Home
            </Link>
            <Link href="/products" className="hover:text-zinc-950">
              Shop
            </Link>
            <Link href="/products" className="hover:text-zinc-950">
              Appliances
            </Link>
            <Link href="#reviews" className="hover:text-zinc-950">
              Support
            </Link>
          </nav>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm ring-1 ring-black/5 transition hover:bg-zinc-100"
            >
              Login
            </Link>
            <Link
              href="/products"
              className="rounded-full bg-zinc-950 px-4 py-2 text-sm text-white shadow-sm transition hover:bg-zinc-800"
            >
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
            Discover TVs, refrigerators, washing machines, air conditioners, phones, and everyday home
            electronics built for comfort, convenience, and modern living.
          </p>

          <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-sm font-medium text-zinc-950 shadow-sm transition hover:bg-lime-300"
            >
              Shop electronics <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-zinc-950 shadow-sm ring-1 ring-black/5 transition hover:bg-zinc-100"
            >
              View appliances
            </Link>
          </div>

          <div className="mt-10 grid w-full max-w-[1040px] grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-[22px] bg-white px-6 py-5 text-left shadow-sm ring-1 ring-black/5">
              <div className="text-[28px] font-semibold tracking-[-0.07em]">24–48h</div>
              <div className="mt-1 text-sm text-zinc-500">dispatch on selected items</div>
            </div>
            <div className="rounded-[22px] bg-white px-6 py-5 text-left shadow-sm ring-1 ring-black/5">
              <div className="text-[28px] font-semibold tracking-[-0.07em]">Warranty</div>
              <div className="mt-1 text-sm text-zinc-500">backed on eligible products</div>
            </div>
            <div className="rounded-[22px] bg-white px-6 py-5 text-left shadow-sm ring-1 ring-black/5">
              <div className="text-[28px] font-semibold tracking-[-0.07em]">Expert help</div>
              <div className="mt-1 text-sm text-zinc-500">for every purchase decision</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BAND */}
      <section className="w-full bg-lime-400 px-4 py-10 sm:px-6 lg:px-12 lg:py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <SectionLabel>Easy checkout • trusted store • retail-ready</SectionLabel>
            <h2 className="mt-5 max-w-[620px] text-[34px] leading-[0.95] tracking-[-0.08em] sm:text-[44px] lg:text-[56px]">
              FAST SHOPPING,
              <br />
              CLEAR PRICING
            </h2>
            <p className="mt-5 max-w-[560px] text-sm leading-7 text-zinc-900/80 sm:text-base">
              Compare devices, choose the right appliance, and complete checkout without clutter.
              Everything is built for simple, confident buying.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
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
                {[
                  ["55-inch Smart TV", "$420"],
                  ["Air Fryer", "$95"],
                  ["Shipping", "$12"],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3">
                    <span>{label}</span>
                    <span className="font-medium text-zinc-950">{val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-2xl bg-zinc-950 px-4 py-3 text-white">
                <div className="flex items-center justify-between text-sm">
                  <span>Total</span>
                  <span className="font-semibold">$527</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-4 block w-full rounded-full bg-lime-400 py-3 text-center text-sm font-medium text-zinc-950 transition hover:bg-lime-300"
              >
                Checkout now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="w-full bg-[#eef2ea] px-4 py-10 sm:px-6 lg:px-12">
        <div className="w-full">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>Shop by category</SectionLabel>
              <h2 className="mt-4 text-[34px] leading-[0.96] tracking-[-0.08em] sm:text-[48px]">
                FIND THE RIGHT PRODUCT FOR EVERY ROOM
              </h2>
            </div>
            <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-zinc-950">
              Browse all categories <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href="/products"
                  className="flex items-center gap-4 rounded-[26px] bg-white p-5 text-left shadow-[0_16px_38px_rgba(15,23,42,0.06)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:bg-zinc-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-zinc-950">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[17px] font-medium tracking-[-0.04em] text-zinc-950">
                      {item.name}
                    </div>
                    <div className="mt-1 text-sm text-zinc-500">Shop now</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="w-full bg-zinc-900 px-4 py-10 text-white sm:px-6 lg:px-12 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <SectionLabel>Trusted store</SectionLabel>
            <h2 className="mt-4 text-[32px] leading-[0.95] tracking-[-0.08em] sm:text-[44px] lg:text-[56px]">
              BUILT FOR
              <br />
              HOMES THAT WORK SMARTER
            </h2>
            <p className="mt-4 max-w-[560px] text-sm leading-7 text-white/70 sm:text-base">
              Make shopping easier with clear product details, support you can reach, and reliable
              delivery for large and small appliances alike.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-lime-300"
            >
              Learn more <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {benefits.map((item) => (
              <BenefitCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY BUY HERE */}
      <section className="w-full bg-[#eef2ea] px-4 py-10 sm:px-6 lg:px-12">
        <div className="grid w-full gap-5 lg:grid-cols-2">
          <div className="rounded-[34px] bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.07)] ring-1 ring-black/5 lg:p-10">
            <SectionLabel>Why customers choose us</SectionLabel>
            <h2 className="mt-4 max-w-[480px] text-[32px] leading-[0.95] tracking-[-0.08em] sm:text-[44px]">
              EVERYTHING YOU NEED FOR A BETTER HOME SETUP
            </h2>
            <div className="mt-6 space-y-4">
              {serviceCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-[24px] bg-zinc-50 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-100 text-zinc-950">
                        <Icon className="h-5 w-5" />
                      </div>
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
                    <div className="text-sm font-medium text-zinc-900">Smart TV bundles</div>
                    <Tv className="h-5 w-5 text-zinc-900" />
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-[-0.08em] text-zinc-950">4K</div>
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Big-screen clarity, streaming apps, and cinema-style viewing for your living room.
                    </p>
                  </div>
                  <Link
                    href="/products"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white"
                  >
                    Shop TVs <ArrowRight className="h-4 w-4" />
                  </Link>
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
                    <p className="mt-2 text-sm leading-6 text-zinc-700">
                      Bundles and energy-saving appliances made for busy households.
                    </p>
                  </div>
                  <Link
                    href="/products"
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-4 py-2 text-sm text-white"
                  >
                    View deals <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTALLATION / SUPPORT */}
      <section className="w-full bg-[#eef2ea] px-4 py-6 sm:px-6 lg:px-12">
        <div className="grid w-full gap-5 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[34px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] ring-1 ring-black/5 lg:p-10">
            <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
              <div className="relative flex aspect-[4/5] items-center justify-center rounded-[28px] bg-zinc-950 p-6 text-white">
                <div className="text-center">
                  <Smartphone className="mx-auto h-12 w-12 text-lime-400" />
                  <div className="mt-4 text-2xl font-semibold tracking-[-0.06em]">Smart devices</div>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Phones, tablets, earbuds, and everyday tech with a clean shopping experience.
                  </p>
                </div>
              </div>
              <div>
                <SectionLabel>Mobile shopping</SectionLabel>
                <h3 className="mt-4 text-[30px] leading-[0.96] tracking-[-0.08em] sm:text-[42px]">
                  SHOP ELECTRONICS
                  <br />
                  FROM ANY DEVICE
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600">
                  The layout stays smooth on phones and tablets, so customers can browse, compare, and
                  purchase with ease.
                </p>
                <Link
                  href="/products"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Explore store <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[34px] bg-[#dff7be] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.07)] ring-1 ring-black/5 lg:p-10">
            <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div>
                <SectionLabel>Order tracking</SectionLabel>
                <h3 className="mt-4 text-[30px] leading-[0.96] tracking-[-0.08em] sm:text-[42px]">
                  STAY UPDATED
                  <br />
                  AFTER PURCHASE
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-700">
                  Give customers confidence with order confirmations, delivery progress, installation
                  scheduling, and support access.
                </p>
                <div className="mt-6 space-y-3 text-sm text-zinc-800">
                  {[
                    "Order confirmation sent instantly",
                    "Live delivery tracking",
                    "Installation or setup scheduling",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3">
                      <Check className="h-4 w-4 text-lime-600" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative flex aspect-[4/5] items-center justify-center rounded-[28px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.08)] ring-1 ring-black/5">
                <div className="text-center">
                  <ShieldCheck className="mx-auto h-12 w-12 text-lime-600" />
                  <p className="mt-4 text-2xl font-semibold tracking-[-0.06em] text-zinc-950">
                    Secure delivery
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    Careful handling for TVs, fridges, washers, and other large appliances.
                  </p>
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
            <h2 className="mt-4 max-w-[520px] text-[32px] leading-[0.95] tracking-[-0.08em] sm:text-[44px]">
              MADE FOR PEOPLE WHO BUY WITH CONFIDENCE
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.name} className="rounded-[24px] bg-zinc-50 p-5">
                  <div className="flex items-center gap-1 text-lime-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-zinc-700">“{review.quote}”</p>
                  <div className="mt-5 text-sm font-medium text-zinc-950">{review.name}</div>
                  <div className="text-xs text-zinc-500">{review.role}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] bg-zinc-950 p-7 text-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] lg:p-10">
            <SectionLabel>Limited offer</SectionLabel>
            <h2 className="mt-4 text-[32px] leading-[0.95] tracking-[-0.08em] sm:text-[44px]">
              GET THE BEST
              <br />
              DEALS FOR YOUR HOME
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/70">
              Use this layout for an electronics and home appliances store, a product launch page, or a
              seasonal promotion campaign.
            </p>
            <div className="mt-8 rounded-[28px] bg-white p-5 text-zinc-950 shadow-[0_18px_40px_rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-500">Today only</p>
                  <p className="text-xl font-medium tracking-[-0.05em]">Free delivery over $50</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-100 text-lime-700">
                  <span className="text-sm font-semibold">%</span>
                </div>
              </div>
              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-lime-400 px-5 py-3 text-sm font-medium text-zinc-950 transition hover:bg-lime-300"
              >
                Claim offer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
              <Headphones className="h-4 w-4 text-lime-400" />
              24/7 support for your customers
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white px-4 pb-10 pt-10 sm:px-6 lg:px-12">
        <div className="grid w-full gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.04em]">
              <ShoppingBag className="h-5 w-5" />
              Amd Global Imports
            </div>
            <p className="mt-4 max-w-[260px] text-sm leading-6 text-zinc-600">
              Electronics and home appliances with a clean, trustworthy shopping experience from discovery
              to delivery.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">Shop</h3>
            <div className="mt-4 space-y-2">
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">New arrivals</button>
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">Best sellers</button>
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">Bundles</button>
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">Gift ideas</button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">Company</h3>
            <div className="mt-4 space-y-2">
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">About us</button>
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">Shipping</button>
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">Returns</button>
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">Warranty policy</button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-950">Support</h3>
            <div className="mt-4 space-y-2">
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">Help center</button>
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">Contact</button>
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">Track order</button>
              <button className="block text-sm text-zinc-600 hover:text-zinc-950">FAQ</button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
          © 2026 Amd Global Imports. Built for electronics and home appliance sales.
        </div>
      </footer>
    </main>
  );
}