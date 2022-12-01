import { get } from "../fetch";

export interface TopSearchRequest {}

export interface TopSearchResponse {
  list: {
    name: string;
    hot: number;
    url: string;
  }[];
}

export const fetchTopSearch = () =>
  get<TopSearchResponse, TopSearchRequest>({
    path: "/tools/top-search",
  });
