import { parseISO } from "date-fns";

export interface FileItem {
  space: string;
  // 文件全名（包含路径和文件名）
  path: string;
  // 上传时间
  time: number;
  // 文件大小：以字节为单位
  size: number;
}

declare global {
  interface Window {
    COS: any;
  }
}

export const Bucket = {
  Bucket: "",
  Region: "",
};

export const checkCOS = () => {
  return !!window?.COS;
};

let cos = (async () => {
  if (!checkCOS()) {
    console.error(
      "COS not found. Please add the following script to your html."
    );
    return undefined;
  }
  let res = await fetch("/server/api/file-authorization").then((res) =>
    res.json()
  );
  Bucket.Bucket = res.Bucket;
  Bucket.Region = res.Region;
  const COS = window?.COS;
  return new COS({
    getAuthorization: function (_: any, callback: any) {
      fetch("/server/api/file-authorization")
        .then((res) => res.json())
        .then((res) => {
          let tempKeys = res?.tempKeys;
          callback({
            TmpSecretId: tempKeys.credentials.tmpSecretId,
            TmpSecretKey: tempKeys.credentials.tmpSecretKey,
            SecurityToken: tempKeys.credentials.sessionToken,
            StartTime: tempKeys.startTime,
            ExpiredTime: tempKeys.expiredTime,
          });
        });
    },
  });
})();

export const getCOS = async () => cos;

export const join = (...path: (string | undefined)[]) => {
  let result: string[] = [];
  for (let item of path) {
    item = item || "";
    result.push(...item.split(/[/\\]/));
  }
  return result.filter((item) => item).join("/");
};

export const getSpace = (key: string) => {
  const index = key.indexOf("/");
  return key.slice(0, index);
};

export const getPath = (key: string) => {
  const index = key.indexOf("/");
  return key.slice(index + 1);
};

/**
 * 将标准COS路径转换为可读路径
 */
export const decodeKey = (key: string) =>
  key
    .split("/")
    .map((item) => decodeURIComponent(item))
    .join("/");

/**
 * 将用户输入的路径转换为COS路径
 */
export const encodeKey = (key: string) =>
  key
    .split("/")
    .filter((i) => i)
    .map((item) => encodeURIComponent(item))
    .join("/");

export interface ProgressInfo {
  // 已经上传的文件部分大小，以字节（Bytes）为单位
  loaded: number;
  // 整个文件的大小，以字节（Bytes）为单位
  total: number;
  // 文件的上传速度，以字节/秒（Bytes/s）为单位
  speed?: number;
  // 文件的上传百分比，以小数形式呈现，例如，上传50%即为0.5
  percent: number;
}

export const fetchUpload = (param: {
  key: string;
  body: File;
  onProgress: (progressData: ProgressInfo) => void;
}) =>
  new Promise<string>((resolve) => {
    getCOS().then((cos) => {
      cos.uploadFile(
        {
          Bucket: Bucket.Bucket,
          Region: Bucket.Region,
          Key: encodeKey(param.key),
          Body: param.body,
          onProgress: param.onProgress,
        },
        function (err: any) {
          if (err) {
            console.error(err);
            resolve(JSON.stringify(err));
            return;
          }
          resolve("");
        }
      );
    });
  });

export const fetchFileList = (space?: string) =>
  new Promise<FileItem[] | undefined>((resolve) => {
    getCOS().then((cos) => {
      cos.getBucket(
        {
          Bucket: Bucket.Bucket,
          Region: Bucket.Region,
          Prefix: space ? encodeKey(space) + "/" : "/",
        },
        function (err: any, data: any) {
          if (err) {
            console.error(err);
            resolve(undefined);
            return;
          }
          let resList: FileItem[] = [];
          for (const item of data.Contents) {
            resList.push({
              time: parseISO(item.LastModified).getTime(),
              size: parseInt(item.Size),
              space: decodeKey(getSpace(item.Key)),
              path: decodeKey(getPath(item.Key)),
            });
          }
          resolve(resList);
        }
      );
    });
  });

export const getFileUrl = (item: { space: string; path: string }) =>
  `https://seashellw.world/server/api/file/${encodeKey(
    join(item.space, item.path)
  )}`;

export const fetchDeleteFile = (key: string) =>
  new Promise<string>((resolve) => {
    getCOS().then((cos) => {
      cos.deleteObject(
        {
          Bucket: Bucket.Bucket,
          Region: Bucket.Region,
          Key: encodeKey(key),
        },
        function (err: any) {
          if (err) {
            console.error(err);
            resolve(JSON.stringify(err));
            return;
          }
          resolve("");
        }
      );
    });
  });
