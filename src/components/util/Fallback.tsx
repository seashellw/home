import {
  completeNavigationProgress,
  resetNavigationProgress,
  startNavigationProgress,
} from "@mantine/nprogress";
import React, { useEffect } from "react";

const Fallback: React.FC = () => {
  useEffect(() => {
    resetNavigationProgress();
    startNavigationProgress();
    return () => {
      completeNavigationProgress();
    };
  }, []);
  return <></>;
};

export default React.memo(Fallback);
