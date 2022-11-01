import { usePageTitle } from "@/hooks/title";
import { Box, Burger, Header, MediaQuery, Title } from "@mantine/core";
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
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      p="sm"
    >
      <MediaQuery largerThan="sm" styles={{ display: "none" }}>
        <Burger opened={isOpen} onClick={toggleNavbar} size="sm" mr="xl" />
      </MediaQuery>
      <Box className="flex-1">
        <Title order={1} size={17} weight={700}>
          大道之行也，天下为公
        </Title>
      </Box>
      <Suspense>
        <LogInButton />
      </Suspense>
    </Header>
  );
};

export default React.memo(AppHeader);
