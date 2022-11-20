import { post } from "../fetch";

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
