import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { BUSINESS } from "../lib/config";
import { supabase } from "../lib/supabase";
import type { Product } from "../lib/types";
import { useOpen } from "../context/OpenContext";

const steps = [
  {
    title: "Pick your items",
    body: "Browse the shelf or upload a photo of your handwritten list.",
  },
  {
    title: "Pay before pickup",
    body: "Transfer to our OPay or Moniepoint account and upload the receipt.",
  },
  {
    title: "Collect at Shop 18",
    body: `We pack while you walk over. Ready in about ${BUSINESS.pickupMinutes} minutes.`,
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .limit(6)
      .then(({ data }) => setProducts(data ?? []));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="bg-leaf-700 text-white">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
          <p className="text-sm font-semibold uppercase tracking-widest text-leaf-200">
            {BUSINESS.address}
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Order foodstuff online.
            <br />
            Pick up in {BUSINESS.pickupMinutes} minutes.
          </h1>
          <p className="mt-4 max-w-xl text-leaf-100">
            {BUSINESS.name} sells rice, beans, garri, yam, oil, frozen chicken
            and everything else on your list — right beside your hostel. Pay
            first, walk over, collect.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="btn bg-white text-leaf-700 hover:bg-leaf-50"
            >
              Shop now
            </Link>
            <Link
              to="/upload-list"
              className="btn border-2 border-white text-white hover:bg-leaf-600"
            >
              Upload shopping list
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-leaf-600 pt-6 text-sm">
            <div>
              <dt className="text-leaf-200">Pickup time</dt>
              <dd className="font-display text-xl font-bold">
                ~{BUSINESS.pickupMinutes} min
              </dd>
            </div>
            <div>
              <dt className="text-leaf-200">Payment</dt>
              <dd className="font-display text-xl font-bold">Before pickup</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* How it works — a real sequence, so the numbers earn their place. */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="font-display text-2xl font-bold text-leaf-800">
          How it works
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="card p-5">
              <span className="font-display text-3xl font-bold text-leaf-200">
                {index + 1}
              </span>
              <h3 className="mt-2 font-semibold text-leaf-900">{step.title}</h3>
              <p className="mt-1 text-sm text-leaf-600">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Popular items */}
      <section className="mx-auto max-w-5xl px-4 pb-4">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-leaf-800">
            On the shelf today
          </h2>
          <Link
            to="/shop"
            className="text-sm font-semibold text-leaf-600 underline"
          >
            See everything
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="mt-6 rounded-2xl bg-leaf-50 p-6 text-leaf-600">
            Items are being stocked. Check back shortly, or upload your shopping
            list and we will price it for you.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
