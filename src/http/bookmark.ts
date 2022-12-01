import { get, post } from "@/http/fetch";

export interface BookmarkCreateRequest {
  url?: string;
  title?: string;
}

export const fetchBookmarkCreate = (req: BookmarkCreateRequest) =>
  post<{}, BookmarkCreateRequest>({
    path: "/bookmark-create",
    body: req,
  });

export interface BookmarkDeleteRequest {
  id?: string;
}

export interface BookmarkDeleteResponse {}

export const fetchBookmarkDelete = (req: BookmarkDeleteRequest) =>
  post<BookmarkDeleteResponse, BookmarkDeleteRequest>({
    path: "/bookmark-delete",
    body: req,
  });

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
    path: "/bookmark-list",
  });

export interface BookmarkUpdateRequest {
  id?: string;
  url?: string;
  title?: string;
}

export const fetchBookmarkUpdate = (req: BookmarkUpdateRequest) =>
  post<{}, BookmarkUpdateRequest>({
    path: "/bookmark-update",
    body: req,
  });
