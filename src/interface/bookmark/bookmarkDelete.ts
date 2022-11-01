import { post } from "../fetch";

export interface BookmarkDeleteRequest {
  id?: string;
}

export interface BookmarkDeleteResponse {}

export const fetchBookmarkDelete = (req: BookmarkDeleteRequest) =>
  post<BookmarkDeleteResponse, BookmarkDeleteRequest>({
    path: "/bookmarkDelete",
    body: req,
  });
