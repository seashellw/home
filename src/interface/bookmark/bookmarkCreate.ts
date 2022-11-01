import { post } from "../fetch";

export interface BookmarkCreateRequest {
  url?: string;
  title?: string;
}

export const fetchBookmarkCreate = (req: BookmarkCreateRequest) =>
  post<{}, BookmarkCreateRequest>({
    path: "/bookmarkCreate",
    body: req,
  });
