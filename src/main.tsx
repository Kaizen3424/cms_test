import React from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./styles.css"

const rootElement = document.getElementById("root")
if (!rootElement) throw new Error("Root element missing")

// If navigating directly to /admin or ?view=admin, redirect/render admin entry
if (
  window.location.pathname.startsWith("/admin") ||
  new URLSearchParams(window.location.search).get("view") === "admin"
) {
  import("./admin-entry")
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}
