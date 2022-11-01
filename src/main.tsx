import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "uno.css";
import Router from "./router/Router";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No root element found");

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Suspense>
      <Router />
    </Suspense>
  </StrictMode>
);
