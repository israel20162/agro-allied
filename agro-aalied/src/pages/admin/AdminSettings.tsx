import { useState, useEffect } from "react";
import { Config } from "../../lib/types";
import AdminLayout from "./AdminLayout";
import { supabase } from "../../lib/supabase";
import Switch from "../../components/Switch";

export default function AdminSettings() {
  const [settings, setSettings] = useState<Config[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusIsChecked, setStatusIsChecked] = useState(false);
  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      let query = supabase.from("configs").select("*");
      const { data } = await query;
      console.log(data);
      setSettings((data as Config[]) ?? []);
      setStatusIsChecked(
        (data as Config[]).find((s) => s.key === "open")?.value === "true",
      );
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleStatusChange = async (newValue: boolean) => {
    setStatusIsChecked(newValue);
    const { error } = await supabase
      .from("configs")
      .update({ value: newValue.toString() })
      .eq("key", "open");
    if (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-3xl font-bold text-leaf-800">
        Settings
      </h1>
      <p className="mt-1 text-leaf-600">Manage your store settings.</p>
      {loading ? (
        <p className="mt-4 text-leaf-600">Loading settings...</p>
      ) : (
        <div className="mt-4 w-full max-w-2xl rounded-lg border border-leaf-100 bg-white p-4">
          {settings.map((setting) => {
            switch (setting.type) {
              case "boolean":
                return (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between w-full py-2"
                  >
                    <span className="text-leaf-600">{setting.key}</span>
                    <Switch
                      checked={statusIsChecked}
                      onChange={async () =>
                        await handleStatusChange(!statusIsChecked)
                      }
                    />
                  </div>
                );
              default:
                return (
                  <div
                    key={setting.key}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-leaf-600">{setting.key}</span>
                    <span className="text-leaf-800">{setting.value}</span>
                  </div>
                );
            }
          })}
        </div>
      )}
    </AdminLayout>
  );
}
