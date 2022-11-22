import { get } from "./fetch";
import { TOKEN_KEY } from "./util";

export interface UserItem {
  [key: string]: string | undefined;
  id: string;
  image: string;
  name: string;
  email: string;
  authority?: string;
}

export const fetchUser = async () => {
  return await get<{
    user: UserItem;
  }>({ path: "/user" });
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
