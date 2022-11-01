import { isDark } from "@/util/util";
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useLocalStorageState } from "ahooks";
import React, { PropsWithChildren, useCallback, useMemo } from "react";

const useDark = () => {
  const [colorScheme, setColorScheme] = useLocalStorageState<ColorScheme>(
    "theme",
    {
      defaultValue: isDark() ? "dark" : "light",
    }
  );

  const toggleColorScheme = useCallback(
    (value?: ColorScheme) =>
      setColorScheme(value || (colorScheme === "dark" ? "light" : "dark")),
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
          globalStyles: () => ({
            "*": {
              scrollBehavior: "smooth",
            },
            "[data-radix-scroll-area-viewport]": {
              scrollBehavior: "auto",
            },
            ".mantine-ScrollArea-viewport": {
              scrollBehavior: "auto",
            },
            ":root.dark": {
              colorScheme: "dark",
            },
            ".ti": {
              transform: "scale(1.2)",
            },
            ".mantine-Prism-code": {
              fontFamily: "JetBrainsMono",
            },
          }),
          headings: {
            fontFamily: "inherit",
          },
          fontFamily: "MiSans",
          colorScheme,
        }}
      >
        <NotificationsProvider>{children}</NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

export default React.memo(Provider);
