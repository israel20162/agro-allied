import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { CartItem, Config, Product } from "../lib/types";
import { supabase } from "../lib/supabase";

type OpenValue = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const OpenContext = createContext<OpenValue | null>(null);

export function OpenProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Keep the cart if the student closes the tab mid-shop.
  useEffect(() => {
    async function fetchSettings() {
      let query = supabase.from("configs").select("*");
      const { data } = await query;
      setIsOpen(
        (data as Config[]).find((s) => s.key === "open")?.value === "true",
      );
    }
    fetchSettings();
  }, []);

  return (
    <OpenContext.Provider
      value={{
        isOpen,
        setIsOpen,
      }}
    >
      {children}
    </OpenContext.Provider>
  );
}

export function useOpen() {
  const context = useContext(OpenContext);
  if (!context) throw new Error("useOpen must be used inside <OpenProvider>");
  return context;
}
