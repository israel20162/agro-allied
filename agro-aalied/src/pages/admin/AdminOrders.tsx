import { useEffect, useState } from "react";
import StatusBadge from "../../components/StatusBadge";
import { formatNaira, statusMessage, whatsappLink } from "../../lib/helpers";
import { supabase } from "../../lib/supabase";
import type { Order, OrderStatus } from "../../lib/types";
import AdminLayout from "./AdminLayout";
import Spinner from "../../components/Spinner";

type Filter = "today" | "active" | "all";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("today");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  async function loadOrders() {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (phoneSearch.trim()) {
      query = query.ilike("phone", `%${phoneSearch.trim()}%`);
    } else if (filter === "today") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      query = query.gte("created_at", startOfToday.toISOString());
    } else if (filter === "active") {
      query = query.in("status", ["pending", "paid", "almost_ready", "ready"]);
    }

    const { data } = await query;
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const interval = setInterval(loadOrders, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [filter]);

  async function updateStatus(order: Order, status: OrderStatus) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", order.id);
    if (error) return alert("Could not update the order. Try again.");

    setOrders((current) =>
      current.map((item) =>
        item.id === order.id ? { ...item, status } : item,
      ),
    );

    // Notify the customer. Push notifications can replace this later.
    if (status === "ready" || status === "almost_ready") {
      window.open(
        whatsappLink(order.phone, statusMessage(order.order_number, status)),
        "_blank",
      );
    }
  }

  const todayTotal = orders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );

  return (
    <AdminLayout>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-sm text-leaf-500">Orders shown</p>
          <p className="font-display text-2xl font-bold text-leaf-800">
            {orders.length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-leaf-500">Value</p>
          <p className="font-display text-2xl font-bold text-leaf-800">
            {formatNaira(todayTotal)}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-leaf-500">Waiting on payment</p>
          <p className="font-display text-2xl font-bold text-leaf-800">
            {orders.filter((order) => order.status === "pending").length}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {(["today", "active", "all"] as Filter[]).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              setPhoneSearch("");
              setFilter(name);
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${
              filter === name && !phoneSearch
                ? "bg-leaf-600 text-white"
                : "bg-white text-leaf-700"
            }`}
          >
            {name === "today" ? "Today's orders" : name}
          </button>
        ))}

        <div className="ml-auto flex gap-2">
          <input
            className="input py-2"
            placeholder="Search by phone number"
            value={phoneSearch}
            onChange={(event) => setPhoneSearch(event.target.value)}
          />
          <button
            type="button"
            onClick={loadOrders}
            className="btn-primary shrink-0 py-2"
          >
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : orders.length === 0 ? (
        <p className="card mt-6 p-6 text-leaf-600">
          No orders here yet. New orders appear as soon as a customer checks
          out.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {orders.map((order) => (
            <li key={order.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-leaf-800">
                    {order.order_number}
                  </p>
                  <p className="text-sm text-leaf-600">
                    {order.customer_name} · {order.phone}
                  </p>
                  <p className="text-xs text-leaf-400">
                    {new Date(order.created_at).toLocaleString("en-NG")}
                  </p>
                </div>

                <div className="ml-auto text-right">
                  <p className="font-display text-xl font-bold text-leaf-700">
                    {formatNaira(order.total)}
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(order, "paid")}
                    className="btn-outline py-2"
                  >
                    Confirm payment
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => updateStatus(order, "almost_ready")}
                  className="btn-almost py-2"
                >
                  ALMOST READY
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(order, "ready")}
                  className="btn-ready py-2"
                >
                  READY FOR PICKUP
                </button>
                {order.status !== "completed" && (
                  <button
                    type="button"
                    onClick={() => updateStatus(order, "completed")}
                    className="btn-outline py-2"
                  >
                    Mark picked up
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setOpenId(openId === order.id ? null : order.id)
                  }
                  className="btn-outline py-2"
                >
                  {openId === order.id ? "Hide details" : "View details"}
                </button>
              </div>

              {openId === order.id && (
                <div className="mt-4 border-t border-leaf-100 pt-4">
                  {order.order_items && order.order_items.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead className="text-left text-leaf-500">
                        <tr>
                          <th className="py-1">Item</th>
                          <th className="py-1">Qty</th>
                          <th className="py-1 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.order_items.map((item) => (
                          <tr key={item.id} className="border-t border-leaf-50">
                            <td className="py-1.5">
                              {item.product_name}{" "}
                              <span className="text-leaf-400">
                                per {item.unit}
                              </span>
                            </td>
                            <td className="py-1.5">{item.quantity}</td>
                            <td className="py-1.5 text-right">
                              {formatNaira(item.unit_price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-sm text-leaf-600">
                      No line items. This came in as a shopping list.
                    </p>
                  )}

                  {order.note && (
                    <p className="mt-3 rounded-xl bg-leaf-50 p-3 text-sm text-leaf-700">
                      Note: {order.note}
                    </p>
                  )}

                  {order.payment_reference && (
                    <p className="mt-3 text-sm text-leaf-700">
                      Reference: {order.payment_reference}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-4">
                    {order.shopping_list_url && (
                      <a
                        href={order.shopping_list_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={order.shopping_list_url}
                          alt="Shopping list"
                          className="h-40 rounded-xl border border-leaf-100 object-cover"
                        />
                        <span className="mt-1 block text-xs text-leaf-500">
                          Shopping list
                        </span>
                      </a>
                    )}
                    {order.receipt_url && (
                      <a
                        href={order.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={order.receipt_url}
                          alt="Payment receipt"
                          className="h-40 rounded-xl border border-leaf-100 object-cover"
                        />
                        <span className="mt-1 block text-xs text-leaf-500">
                          Payment receipt
                        </span>
                      </a>
                    )}
                  </div>

                  <a
                    href={whatsappLink(
                      order.phone,
                      `Hello ${order.customer_name}, about your Ameer Farms order ${order.order_number}:`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline mt-4 py-2"
                  >
                    Message customer
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </AdminLayout>
  );
}
