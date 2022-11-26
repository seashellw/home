import AppHeader from "@/components/layouts/AppHeader";
import AppNavbar from "@/components/layouts/AppNavbar";
import Provider from "@/components/layouts/Provider";
import { useAutoLogIn } from "@/hooks/user";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const AppFooter = React.lazy(() => import("@/components/layouts/AppFooter"));

function App() {
  useAutoLogIn();

  return (
    <Provider>
      <AppHeader />
      <AppNavbar />
      <Suspense>
        <Outlet />
        <AppFooter />
      </Suspense>
    </Provider>
  );
}

export default React.memo(App);
