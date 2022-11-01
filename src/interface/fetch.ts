import { TOKEN_KEY } from "@/interface/util";
import { $fetch, FetchError, SearchParams } from "ohmyfetch";

const { origin } = window.location;
export const HOST = origin + "/server/api";

export type FetchResponse<T = any> = {
  code: number;
  ok: boolean;
  data: T | undefined;
  message: string;
};

export const fetch: <Response = any>(option: {
  path: string;
  headers?: Record<string, string>;
  query?: any;
  body?: any;
  method?: "GET" | "POST" | "PUT" | "DELETE";
}) => Promise<FetchResponse<Response>> = async (option) => {
  try {
    let res = await $fetch(option.path, {
      baseURL: HOST,
      ...option,
      async onRequest({ options }) {
        const token = localStorage.getItem(TOKEN_KEY);
        options.headers = {
          ...options.headers,
          Authorization: `${token}`,
        };
      },
    });
    return {
      code: 200,
      ok: true,
      data: res,
      message: "",
    };
  } catch (e) {
    if (!(e instanceof FetchError)) throw e;
    return {
      code: e.response?.status || 0,
      ok: false,
      data: undefined,
      message: e.data,
    };
  }
};

export const get: <
  Response = any,
  Query extends SearchParams | undefined = any
>(option: {
  path: string;
  headers?: Record<string, string>;
  query?: Query;
}) => Promise<FetchResponse<Response>> = async (option) => {
  return fetch({
    ...option,
    method: "GET",
  });
};

export const post: <Response = any, Body = any>(option: {
  path: string;
  headers?: Record<string, string>;
  body?: Body;
}) => Promise<FetchResponse<Response>> = async (option) => {
  return fetch({
    ...option,
    method: "POST",
  });
};
