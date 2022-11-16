import { useWatch } from "@/hooks/util";
import { menu } from "@/router/Router";
import { Divider, Global, Navbar, NavLink, ScrollArea } from "@mantine/core";
import React, { Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { proxy, useSnapshot } from "valtio";
import { headerHeight } from "./AppHeader";

const ThemeButton = React.lazy(
  () => import("@/components/layouts/ThemeButton")
);

const { Section } = Navbar;

export const NavbarState = proxy({
  open: false,
});

export const toggleNavbar = () => {
  NavbarState.open = !NavbarState.open;
};

const AppNavbar: React.FC = () => {
  const isOpen = useSnapshot(NavbarState).open;

  const { pathname } = useLocation();

  useWatch(pathname, () => {
    NavbarState.open = false;
  });

  return (
    <>
      <Navbar
        p="sm"
        hiddenBreakpoint="sm"
        hidden={!isOpen}
        width={{ sm: 200, lg: 300 }}
        fixed
      >
        <Section grow component={ScrollArea}>
          {menu.map((item) => (
            <NavLink
              label={item.title}
              component={Link}
              icon={item.icon}
              to={item.path}
              key={item.path}
              active={pathname === item.path}
            />
          ))}
        </Section>
        <Divider my={"sm"} />
        <Section
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Suspense>
            <ThemeButton />
          </Suspense>
        </Section>
      </Navbar>
      <Global
        styles={(theme) => ({
          "#root": {
            paddingTop: headerHeight,
          },
          [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
            "#root": {
              paddingLeft: 200,
            },
          },
          [`@media (min-width: ${theme.breakpoints.lg}px)`]: {
            "#root": {
              paddingLeft: 300,
            },
          },
        })}
      />
    </>
  );
};

export default React.memo(AppNavbar);
