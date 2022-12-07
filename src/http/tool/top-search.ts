import { get } from "../fetch";

export interface TopSearchRequest {}

export interface TopSearchResponse {
  list: {
    id: string;
    title: number;
    url: string;
    type: string;
  }[];
}

export const fetchTopSearch = () =>
  get<TopSearchResponse, TopSearchRequest>({
    path: "/tools/top-search",
  });
