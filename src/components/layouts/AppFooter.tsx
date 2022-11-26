import { Anchor } from "@mantine/core";
import React from "react";

/**
 * 顶部导航栏
 */
const AppFooter: React.FC = () => {
  return (
    <footer className="app-footer flex items-center justify-center flex-wrap px-[10%] gap-10">
      <Anchor
        href="https://beian.miit.gov.cn/"
        target="_blank"
        color="gray"
        size="sm"
      >
        豫ICP备2022027021号
      </Anchor>
    </footer>
  );
};

export default React.memo(AppFooter);
