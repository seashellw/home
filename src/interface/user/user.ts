import { get } from "../fetch";
import { TOKEN_KEY } from "../util";
import { UserItem } from "./userList";

export const fetchUser = async () => {
  const res = await get<{
    user: UserItem;
  }>({ path: "/user" });
  return res;
};

export const fetchLogIn = async (path: string) => {
  const url = new URL(path);
  url.searchParams.set("from", window.location.href);
  window.location.href = url.toString();
};

export const fetchLogOut = async (path: string) => {
  localStorage.removeItem(TOKEN_KEY);
  const url = new URL(path);
  url.searchParams.set("from", window.location.href);
  window.location.href = url.toString();
};