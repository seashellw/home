import { fetchLogIn, fetchLogOut, fetchUser } from "@/interface/user/user";
import { UserItem } from "@/interface/user/userList";
import { TOKEN_KEY } from "@/interface/util";
import { showNotification } from "@mantine/notifications";
import { useMount } from "ahooks";
import { proxy } from "valtio";
import { useStorageStore } from "./util";

const logInURL = "https://seashellw.world/server/api/auth/logIn";
const logOutURL = "https://seashellw.world/server/api/auth/logOut";

/**
 * 登录状态
 */
export const LogInState = proxy<{
  isLogIn: boolean;
  user?: UserItem;
}>({
  isLogIn: false,
});

export const logIn = () => fetchLogIn(logInURL);

export const logOut = async () => {
  LogInState.isLogIn = false;
  LogInState.user = undefined;
  await fetchLogOut(logOutURL);
};

export const useAutoLogIn = () => {
  useStorageStore("LogInState", LogInState);
  useMount(async () => {
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
