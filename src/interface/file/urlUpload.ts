import { post } from "@/interface/fetch";
import { ProgressInfo } from "@/util/tencent";

export interface FileUrlUploadRequest {
  url?: string;
  key: string;
}

export interface FileUrlUploadResponse {
  key: string;
  state: "prepare" | "uploading" | "success" | "error";
  progress: ProgressInfo;
  message: string;
}

export const fetchFileUrlUpload = (req: Required<FileUrlUploadRequest>) =>
  post<{}, typeof req>({
    path: "/fileUrlUpload",
    body: req,
  });

export const fetchFileUrlUploadStatus = (
  req: Pick<FileUrlUploadRequest, "key">
) =>
  post<FileUrlUploadResponse, typeof req>({
    path: "/fileUrlUpload",
    body: req,
  });
