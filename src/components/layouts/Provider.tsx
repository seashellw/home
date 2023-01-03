import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { NavigationProgress } from "@mantine/nprogress";
import React, {
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";

const useDark = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    localStorage.getItem("theme") as ColorScheme
  );

  const toggleColorScheme = useCallback(
    (value?: ColorScheme) => {
      const nextColorScheme =
        value ?? (colorScheme === "dark" ? "light" : "dark");
      localStorage.setItem("theme", nextColorScheme);
      setColorScheme(nextColorScheme);
    },
    [colorScheme, setColorScheme]
  );

  return useMemo(() => {
    if (colorScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return {
      colorScheme,
      toggleColorScheme,
    };
  }, [colorScheme, toggleColorScheme]);
};

const Provider: React.FC<PropsWithChildren> = ({ children }) => {
  const { colorScheme, toggleColorScheme } = useDark();

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        withCSSVariables
        theme={{
          headings: {
            fontFamily: "inherit",
          },
          fontFamily: "HarmonyOS_Sans_SC",
          colorScheme,
        }}
      >
        <NavigationProgress />
        <NotificationsProvider>{children}</NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default React.memo(Provider);
