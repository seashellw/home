import { usePageTitle } from "@/hooks/title";
import { Burger, Header, MediaQuery, Title } from "@mantine/core";
import React, { Suspense } from "react";
import { useSnapshot } from "valtio";
import Icon from "../util/Icon";
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
    <Header height={headerHeight} fixed className="flex items-center" p="sm">
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger opened={isOpen} onClick={toggleNavbar} size="sm" mr="xl" />
      </MediaQuery>
      <Title
        order={1}
        size={17}
        weight={700}
        mr="sm"
        className="flex-grow flex items-center"
      >
        <Icon icon="brand-react" size={25} className="mr-2" />
        <span className="truncate">大道之行也 天下为公</span>
      </Title>
      <Suspense>
        <LogInButton />
      </Suspense>
    </Header>
  );
};

export default React.memo(AppHeader);
