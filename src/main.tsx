import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./App.tsx";
import { MockedAuthProvider } from "./contexts/MockedAuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MockedAuthProvider>
      <App />
    </MockedAuthProvider>
  </StrictMode>
);
