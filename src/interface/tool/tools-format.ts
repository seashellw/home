import { post } from "../fetch";

export interface ToolsFormatRequest {
  text: string;
  parser: string;
}

export interface ToolsFormatResponse {
  text?: string;
}

export const fetchToolsFormat = (req: ToolsFormatRequest) =>
  post<ToolsFormatResponse, ToolsFormatRequest>({
    path: "/tools/format",
    body: req,
  });
