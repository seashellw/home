import AppHeader from "@/components/layouts/AppHeader";
import AppNavbar from "@/components/layouts/AppNavbar";
import Provider from "@/components/layouts/Provider";
import Fallback from "@/components/util/Fallback";
import { useAutoLogIn } from "@/hooks/user";
import { AppShell } from "@mantine/core";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

function App() {
  useAutoLogIn();

  return (
    <Provider>
      <AppShell
        navbarOffsetBreakpoint="sm"
        padding="sm"
        header={<AppHeader />}
        navbar={<AppNavbar />}
      >
        <Suspense fallback={<Fallback />}>
          <Outlet />
        </Suspense>
      </AppShell>
    </Provider>
  );
}

export default React.memo(App);
