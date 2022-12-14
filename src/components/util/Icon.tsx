import { Box, Sx } from "@mantine/core";
import React from "react";

const Icon: React.FC<{
  size?: number;
  icon: string;
  color?: string;
  className?: string;
  sx?: Sx;
}> = ({ size, icon, color, className, sx }) => {
  return (
    <Box
      component="i"
      className={`ti ti-${icon} ${className}`}
      sx={{
        fontSize: size,
        color: color,
        display: "inline-block",
        verticalAlign: "middle",
        transform: "scale(1.2)",
        ...sx,
      }}
    ></Box>
  );
};

export default React.memo(Icon);
