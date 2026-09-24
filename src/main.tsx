import "@/globals.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "@heroui/react";
import Layout from "./layout";
import { Provider } from "./context.tsx";
import ErrorBoundary from "./components/error-boundary.tsx";

import IndexPage from "@/pages/index";
import SettingsPage from "@/pages/settings";
import InventoryPage from "@/pages/inventory";

import NotFoundPage from "@/pages/not-found.tsx";



function App() {
  return (
    <Layout>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<SettingsPage />} path="/settings" />

        <Route element={<InventoryPage />} path="/inventory" />

        <Route element={<NotFoundPage />} path="/*" />
      </Routes>
    </Layout>

  );
}



ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <React.StrictMode>
      <BrowserRouter>
        <Provider>
          <App />
          <ToastProvider />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>
  </ErrorBoundary>
  ,
);
