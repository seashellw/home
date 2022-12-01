import {
  fetchLogIn,
  fetchLogOut,
  fetchUser,
  TOKEN_KEY,
  UserItem,
} from "@/http/user";
import { showNotification } from "@mantine/notifications";
import { proxy } from "valtio";
import { useOnMount, useStorageStore } from "./util";
import { LOGIN_URL, LOGOUT_URL } from "@/http/fetch";

/**
 * 登录状态
 */
export const LogInState = proxy<{
  isLogIn: boolean;
  user?: UserItem;
}>({
  isLogIn: false,
});

export const logIn = () => fetchLogIn(LOGIN_URL);

export const logOut = async () => {
  LogInState.isLogIn = false;
  LogInState.user = undefined;
  await fetchLogOut(LOGOUT_URL);
};

export const useAutoLogIn = () => {
  useStorageStore("LogInState", LogInState);
  useOnMount(async () => {
    let url = new URL(window.location.href);
    let params = url.searchParams;
    let token = params.get("token");
    if (token) {
      params.delete("token");
      window.history.replaceState({}, "", url);
      localStorage.setItem(TOKEN_KEY, token);
    }
    token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      LogInState.isLogIn = false;
      LogInState.user = undefined;
      return;
    }
    let res = await fetchUser();
    if (res.ok) {
      LogInState.isLogIn = true;
      LogInState.user = res.data?.user;
    } else {
      showNotification({
        title: "自动登录失败",
        message: res.message,
        color: "red",
      });
      LogInState.isLogIn = false;
      LogInState.user = undefined;
      localStorage.removeItem(TOKEN_KEY);
    }
  });
};
