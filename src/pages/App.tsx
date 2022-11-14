import AppHeader from "@/components/layouts/AppHeader";
import AppNavbar from "@/components/layouts/AppNavbar";
import Provider from "@/components/layouts/Provider";
import NavigationProgress from "@/components/util/NavigationProgress";
import { useAutoLogIn } from "@/hooks/user";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

function App() {
  useAutoLogIn();

  return (
    <Provider>
      <AppHeader />
      <AppNavbar />
      <Suspense fallback={<NavigationProgress />}>
        <Outlet />
      </Suspense>
    </Provider>
  );
}

export default React.memo(App);
