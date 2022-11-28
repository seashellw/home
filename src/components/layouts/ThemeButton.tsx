import { launchParty, sleep } from "@/util/util";
import {
  Box,
  Center,
  ColorScheme,
  SegmentedControl,
  useMantineColorScheme,
} from "@mantine/core";
import React, { useCallback } from "react";
import Icon from "../util/Icon";

const ThemeButton: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const onChange = useCallback(
    async (value: ColorScheme) => {
      toggleColorScheme(value);
      await sleep(200);
      launchParty({
        y: window.innerHeight,
      });
    },
    [toggleColorScheme]
  );

  return (
    <SegmentedControl
      value={colorScheme}
      onChange={onChange}
      data={[
        {
          value: "light",
          label: (
            <Center>
              <Icon icon="sun" />
              <Box ml={10}>Light</Box>
            </Center>
          ),
        },
        {
          value: "dark",
          label: (
            <Center>
              <Icon icon="moon" />
              <Box ml={10}>Dark</Box>
            </Center>
          ),
        },
      ]}
    />
  );
};

export default React.memo(ThemeButton);
