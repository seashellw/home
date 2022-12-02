import { usePageTitle } from "@/hooks/title";
import { Burger, Header, MediaQuery, Title } from "@mantine/core";
import React, { Suspense } from "react";
import { useSnapshot } from "valtio";
import { NavbarState, toggleNavbar } from "./AppNavbar";

const LogInButton = React.lazy(() => import("./LogInButton"));

export const headerHeight = 60;
export const headerIconHeight = 34;

/**
 * 顶部导航栏
 */
const AppHeader: React.FC = () => {
  usePageTitle();
  const isOpen = useSnapshot(NavbarState).open;

  return (
    <Header
      height={headerHeight}
      sx={{ position: "sticky", top: 0, zIndex: 10 }}
      className="flex items-center backdrop-blur dark:bg-[#1a1b1e52] bg-[#ffffff52]"
      p="sm"
    >
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger opened={isOpen} onClick={toggleNavbar} size="sm" mr="xl" />
      </MediaQuery>
      <Title
        order={1}
        size={20}
        mx="sm"
        className="flex-grow flex items-center"
      >
        <span className="truncate lan-she-ji-sans">大道之行也 天下为公</span>
      </Title>
      <Suspense>
        <LogInButton />
      </Suspense>
    </Header>
  );
};

export default React.memo(AppHeader);
