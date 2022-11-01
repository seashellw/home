import { post } from "../fetch";
import { Page } from "../page";

export interface UserItem {
  [key: string]: string | undefined;
  id: string;
  image: string;
  name: string;
  email: string;
  authority?: string;
}

export interface UserListRequest {
  page: Page;
}

export interface UserListResponse {
  list?: UserItem[];
  page?: Page;
}

export const fetchUserList = (req: UserListRequest) =>
  post<UserListResponse, UserListRequest>({ path: "/userList", body: req });
