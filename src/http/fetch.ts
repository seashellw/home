import { FetchError, ofetch, SearchParameters } from "ofetch";
import { TOKEN_KEY } from "@/http/user";

export const HOST = import.meta.env.VITE_HOST;
export const LOGIN_URL = HOST + "/auth/login";
export const LOGOUT_URL = HOST + "/auth/logout";

export type FetchResponse<T = any> = {
  code: number;
  ok: boolean;
  data: T | undefined;
  message: string;
};

export const fetch: <Response = any>(option: {
  path: string;
  headers?: Record<string, string>;
  Query?: SearchParameters;
  body?: any;
  method?: "GET" | "POST" | "PUT" | "DELETE";
}) => Promise<FetchResponse<Response>> = async (option) => {
  try {
    let res = await ofetch(option.path, {
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
  } catch (err) {
    if (!(err instanceof FetchError)) throw err;
    return {
      code: err.response?.status || 0,
      ok: false,
      data: undefined,
      message: err.data instanceof Object ? JSON.stringify(err.data) : err.data,
    };
  }
};

export const get: <
  Response = any,
  Query extends SearchParameters | undefined = undefined
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
