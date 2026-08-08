import { ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

const tabs = [
  { to: "/admin", label: "Orders", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-leaf-50">
      <header className="border-b border-leaf-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="font-display text-lg font-bold text-leaf-800">
            Ameer Farms admin
          </Link>
          <nav className="ml-4 flex gap-1">
            {tabs.map((tab) => (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-sm font-medium ${
                    isActive
                      ? "bg-leaf-600 text-white"
                      : "text-leaf-600 hover:bg-leaf-50"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </nav>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/admin/login");
            }}
            className="ml-auto text-sm font-semibold text-leaf-600 underline"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
