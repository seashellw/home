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

export const Bucket = "cache-1259243245";
export const Region = "ap-beijing";

export const checkCOS = () => {
  return !!window?.COS;
};

export const getCOS = (() => {
  let cos: any = undefined;
  return () => {
    if (cos) {
      return cos;
    }
    if (!checkCOS()) {
      console.error(
        "COS not found. Please add the following script to your html."
      );
      return undefined;
    }
    const COS = window?.COS;
    cos = new COS({
      getAuthorization: function (_: any, callback: any) {
        fetch("https://seashellw.world/server/api/fileAuthorization")
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
    return cos;
  };
})();

export const checkPathItem = (name: string) => {
  return /^[^\s/\\]*$/.test(name);
};

export const checkPath = (path: string) => {
  path = path.replace(/[/\\]/g, "");
  return checkPathItem(path);
};

export const join = (...path: (string | undefined)[]) => {
  let result: string[] = [];
  for (let item of path) {
    item = item || "";
    result.push(...item.split(/[/\\]/));
  }
  return result.filter((item) => item).join("/");
};

export const generateKey = (param: { space: string; path: string }) =>
  join(param.space, param.path);

export const parseKey = (key: string) => {
  const index = key.indexOf("/");
  if (index <= 0) {
    return null;
  }
  return {
    space: key.slice(0, index),
    path: key.slice(index + 1),
  };
};

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
  new Promise<{
    ok: boolean;
  }>((resolve) => {
    getCOS().uploadFile(
      {
        Bucket,
        Region,
        Key: param.key,
        Body: param.body,
        onProgress: param.onProgress,
      },
      function (err: any) {
        if (err) {
          console.error(err);
          resolve({ ok: false });
          return;
        }
        resolve({ ok: true });
      }
    );
  });

export const fetchFileList = (space?: string) =>
  new Promise<FileItem[] | undefined>((resolve) => {
    getCOS().getBucket(
      {
        Bucket,
        Region,
        Prefix: space + "/",
      },
      function (err: any, data: any) {
        if (err) {
          console.error(err);
          resolve(undefined);
          return;
        }
        let resList: FileItem[] = [];
        for (const item of data.Contents) {
          let keyObj = parseKey(item.Key);
          if (!keyObj) {
            console.error("文件key解析错误", item.Key);
            resolve(undefined);
            return;
          }
          resList.push({
            time: parseISO(item.LastModified).getTime(),
            size: parseInt(item.Size),
            ...keyObj,
          });
        }
        resolve(resList);
      }
    );
  });

export const getFileUrl = async (item: { space: string; path: string }) =>
  new Promise<string | undefined>((resolve) => {
    getCOS().getObjectUrl(
      {
        Bucket,
        Region,
        Key: generateKey(item),
        Protocol: "https:",
      },
      (err: any, data: any) => {
        resolve(err ? undefined : data.Url);
      }
    );
  });

export const fetchDeleteFile = (key: string) =>
  new Promise<boolean>((resolve) => {
    getCOS().deleteObject(
      {
        Bucket,
        Region,
        Key: key,
      },
      function (err: any) {
        if (err) {
          console.error(err);
          resolve(false);
          return;
        }
        resolve(true);
      }
    );
  });
