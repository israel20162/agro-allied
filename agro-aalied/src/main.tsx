import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./index.css";
import { OpenProvider } from "./context/OpenContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>
        <OpenProvider>
          <App />
        </OpenProvider>
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
