import { post } from "@/interface/fetch";
import { decodeKey, encodeKey, ProgressInfo } from "@/interface/file/tencent";

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

export const fetchFileUrlUpload = async (
  req: Required<FileUrlUploadRequest>
) => {
  req = {
    ...req,
    key: encodeKey(req.key),
  };
  return post<{}, typeof req>({
    path: "/file-url-upload",
    body: req,
  });
};

export const fetchFileUrlUploadStatus = async (
  req: Pick<FileUrlUploadRequest, "key">
) => {
  req = {
    ...req,
    key: encodeKey(req.key),
  };
  let res = await post<FileUrlUploadResponse, typeof req>({
    path: "/file-url-upload",
    body: req,
  });
  if (res.data) {
    res.data.key = decodeKey(res.data.key);
  }
  return res;
};
