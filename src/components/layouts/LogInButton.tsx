import { logIn, LogInState, logOut } from "@/hooks/user";
import { ActionIcon, Avatar, Menu } from "@mantine/core";
import React, { useCallback } from "react";
import { useSnapshot } from "valtio";
import { headerIconHeight } from "./AppHeader";

const { Dropdown, Item, Divider } = Menu;

const { Target } = Menu;

const LogInButton: React.FC = () => {
  const { isLogIn, user } = useSnapshot(LogInState);

  const handleGitHub = useCallback(() => {
    window.open(`https://github.com/${LogInState.user?.name}`);
  }, []);

  if (!isLogIn) {
    return (
      <ActionIcon variant="default" onClick={logIn} size={headerIconHeight}>
        <i className="ti ti-brand-github"></i>
      </ActionIcon>
    );
  }

  return (
    <Menu trigger="hover" position="bottom-end">
      <Target>
        <Avatar src={user?.image} size={headerIconHeight} />
      </Target>
      <Dropdown>
        <Item
          onClick={handleGitHub}
          icon={<i className="ti ti-brand-github"></i>}
        >
          {user?.name}
        </Item>
        <Divider />
        <Item onClick={logOut} icon={<i className="ti ti-logout"></i>}>
          退出登录
        </Item>
      </Dropdown>
    </Menu>
  );
};

export default React.memo(LogInButton);
