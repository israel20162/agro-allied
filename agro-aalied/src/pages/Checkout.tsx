import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FileInput from "../components/FileInput";
import { useCart } from "../context/CartContext";
import { BUSINESS, PAYMENT_ACCOUNTS } from "../lib/config";
import { formatNaira, generateOrderNumber, uploadFile } from "../lib/helpers";
import { supabase } from "../lib/supabase";

const schema = Yup.object({
  customer_name: Yup.string()
    .trim()
    .min(2, "Enter your full name")
    .required("Name is required"),
  phone: Yup.string()
    .matches(/^[0-9+\s-]{10,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  payment_reference: Yup.string().trim(),
});

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<File | null>(null);
  const [failure, setFailure] = useState("");

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="font-display text-3xl font-bold text-leaf-800">
          Nothing to check out
        </h1>
        <p className="mt-2 text-leaf-600">Add items to your cart first.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-leaf-800">
        Checkout
      </h1>
      <p className="mt-1 text-leaf-600">
        Pay first, then collect at {BUSINESS.address}.
      </p>

      {/* Payment accounts */}
      <div className="card mt-6 p-5">
        <h2 className="font-semibold text-leaf-900">
          Transfer {formatNaira(total)} to either account
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {PAYMENT_ACCOUNTS.map((account) => (
            <div key={account.bank} className="rounded-xl bg-leaf-50 p-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-leaf-600">
                {account.bank}
              </p>
              <p className="mt-1 font-display text-xl font-bold text-leaf-800">
                {account.accountNumber}
              </p>
              <p className="text-sm text-leaf-600">{account.accountName}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-leaf-600">
          After transferring, upload the receipt or type the transaction
          reference below.
        </p>
      </div>

      <Formik
        initialValues={{
          customer_name: "",
          phone: "",
          payment_reference: "",
          note: "",
        }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          setFailure("");
          try {
            const receiptUrl = await uploadFile(receipt, "uploads", "receipts");
            const orderNumber = generateOrderNumber();

            const { data: order, error: orderError } = await supabase
              .from("orders")
              .insert({
                order_number: orderNumber,
                customer_name: values.customer_name.trim(),
                phone: values.phone.trim(),
                total,
                status: "pending",
                payment_reference: values.payment_reference.trim() || null,
                receipt_url: receiptUrl,
                note: values.note.trim() || null,
              })
              .select()
              .single();

            if (orderError) throw orderError;

            const { error: itemsError } = await supabase
              .from("order_items")
              .insert(
                items.map((item) => ({
                  order_id: order.id,
                  product_id: item.product.id,
                  product_name: item.product.name,
                  unit: item.product.unit,
                  unit_price: item.product.price,
                  quantity: item.quantity,
                })),
              );
            if (itemsError) throw itemsError;

            clearCart();
            navigate(`/order/${orderNumber}`);
          } catch (error) {
            console.error(error);
            setFailure(
              "We could not save your order. Check your connection and try again.",
            );
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="card mt-6 space-y-5 p-5">
            <div>
              <label className="label" htmlFor="customer_name">
                Full name
              </label>
              <Field
                id="customer_name"
                name="customer_name"
                className="input"
                placeholder="Aisha Bello"
              />
              <ErrorMessage
                name="customer_name"
                component="p"
                className="error"
              />
            </div>

            <div>
              <label className="label" htmlFor="phone">
                Phone number
              </label>
              <Field
                id="phone"
                name="phone"
                type="tel"
                className="input"
                placeholder="0803 000 0000"
              />
              <ErrorMessage name="phone" component="p" className="error" />
              <p className="mt-1 text-xs text-leaf-500">
                We message this number on WhatsApp when your order is ready.
              </p>
            </div>

            <div>
              <label className="label" htmlFor="payment_reference">
                Transaction reference (optional)
              </label>
              <Field
                id="payment_reference"
                name="payment_reference"
                className="input"
                placeholder="e.g. OPay 1234567890"
              />
            </div>

            <FileInput
              name="receipt"
              label="Upload payment receipt"
              hint="A screenshot of the transfer works fine."
              onFile={setReceipt}
            />

            <div>
              <label className="label" htmlFor="note">
                Note for the shop (optional)
              </label>
              <Field
                id="note"
                name="note"
                as="textarea"
                rows={3}
                className="input"
                placeholder="Please pack the beans separately."
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-leaf-50 px-4 py-3">
              <span className="text-leaf-600">Total</span>
              <span className="font-display text-xl font-bold text-leaf-800">
                {formatNaira(total)}
              </span>
            </div>

            {failure && <p className="error">{failure}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? "Placing order…" : "Place order"}
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
}
