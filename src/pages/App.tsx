import AppHeader, { headerHeight } from "@/components/layouts/AppHeader";
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

const Main = styled.main`
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  min-height: ${`calc(100vh - ${headerHeight}px)`};
`;

function App() {
  useAutoLogIn();

  return (
    <Provider>
      <AppHeader />
      <section className="flex">
        <AppNavbarFlex />
        <Main>
          <Suspense>
            <Outlet />
          </Suspense>
        </Main>
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
