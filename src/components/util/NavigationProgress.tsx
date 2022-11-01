import {
  completeNavigationProgress,
  resetNavigationProgress,
  startNavigationProgress,
} from "@mantine/nprogress";
import React, { useEffect } from "react";

const NavigationProgress: React.FC = () => {
  useEffect(() => {
    resetNavigationProgress();
    startNavigationProgress();
    return () => {
      completeNavigationProgress();
    };
  }, []);
  return <></>;
};

export default React.memo(NavigationProgress);
