import styled from "@emotion/styled";
import { Anchor, Divider } from "@mantine/core";
import React from "react";

const FooterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 20px 10%;
  gap: 10px;
`;

/**
 * 顶部导航栏
 */
const AppFooter: React.FC = () => {
  return (
    <>
      <Divider />
      <FooterBox>
        <Anchor
          href="https://beian.miit.gov.cn/"
          target="_blank"
          className="text-gray-400"
          size="sm"
        >
          豫ICP备2022027021号
        </Anchor>
      </FooterBox>
    </>
  );
};

export default React.memo(AppFooter);
