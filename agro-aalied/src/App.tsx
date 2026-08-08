import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder from "./pages/TrackOrder";
import UploadList from "./pages/UploadList";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import RequireStaff from "./pages/admin/RequireStaff";
import { Toaster } from "react-hot-toast";
import AdminSettings from "./pages/admin/AdminSettings";
import { useOpen } from "./context/OpenContext";

/** Shop pages get the public shell; admin pages bring their own. */
function Public({ children }: { children: JSX.Element }) {
  const { isOpen } = useOpen();
  return (
    <Layout>
      {/* Store Closed Banner */}
      {!isOpen && (
        <div className="bg-red-600 px-4 py-4 text-center text-white shadow-md">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-1 sm:flex-row sm:gap-3">
            <span className="text-2xl">🔒</span>

            <div>
              <p className="font-display text-lg font-bold">
                Sorry, we're currently closed
              </p>
              <p className="text-sm text-red-100">
                Please check back later. Thank you for your support!
              </p>
            </div>
          </div>
        </div>
      )}
      {children}{" "}
      <div>
        <Toaster />
      </div>
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Public>
            <Home />
          </Public>
        }
      />
      <Route
        path="/shop"
        element={
          <Public>
            <Shop />
          </Public>
        }
      />
      <Route
        path="/cart"
        element={
          <Public>
            <Cart />
          </Public>
        }
      />
      <Route
        path="/checkout"
        element={
          <Public>
            <Checkout />
          </Public>
        }
      />
      <Route
        path="/order/:orderNumber"
        element={
          <Public>
            <OrderConfirmation />
          </Public>
        }
      />
      <Route
        path="/track"
        element={
          <Public>
            <TrackOrder />
          </Public>
        }
      />
      <Route
        path="/upload-list"
        element={
          <Public>
            <UploadList />
          </Public>
        }
      />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireStaff>
            <AdminOrders />
          </RequireStaff>
        }
      />
      <Route
        path="/admin/products"
        element={
          <RequireStaff>
            <AdminProducts />
          </RequireStaff>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <RequireStaff>
            <AdminSettings />
          </RequireStaff>
        }
      />

      <Route
        path="*"
        element={
          <Public>
            <NotFound />
          </Public>
        }
      />
    </Routes>
  );
}
