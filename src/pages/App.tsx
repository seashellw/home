import AppHeader from "@/components/layouts/AppHeader";
import AppNavbar from "@/components/layouts/AppNavbar";
import Provider from "@/components/layouts/Provider";
import { useAutoLogIn } from "@/hooks/user";
import styled from "@emotion/styled";
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";

const AppFooter = React.lazy(() => import("@/components/layouts/AppFooter"));

const AppNavbarFlex = styled(AppNavbar)`
  flex-grow: 0;
  flex-shrink: 0;
`;

function App() {
  useAutoLogIn();

  return (
    <Provider>
      <AppHeader />
      <section className="flex">
        <AppNavbarFlex />
        <main className="flex-grow flex-shrink overflow-hidden">
          <Suspense>
            <Outlet />
          </Suspense>
        </main>
      </section>
      <footer>
        <Suspense>
          <AppFooter />
        </Suspense>
      </footer>
    </Provider>
  );
}

export default React.memo(App);
