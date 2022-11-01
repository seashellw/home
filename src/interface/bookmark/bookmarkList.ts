import { get } from "../fetch";

export interface BookmarkListResponse {
  list?: {
    id: string;
    url: string;
    title: string;
    createTime: string;
  }[];
}

export const fetchBookmarkList = () =>
  get<BookmarkListResponse>({
    path: "/bookmarkList",
  });
