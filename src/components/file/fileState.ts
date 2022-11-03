import { fetchUpload, FileItem, join, ProgressInfo } from "@/util/tencent";
import { sleep } from "@/util/util";
import { proxy } from "valtio";
import {
  fetchFileUrlUpload,
  fetchFileUrlUploadStatus,
} from "@/interface/file/urlUpload";
import { showNotification } from "@mantine/notifications";

export interface TreeItem extends FileItem {
  isDir: boolean;
  children: TreeItem[];
  father: TreeItem | undefined;
  name: string;
}

export const FileFormDataState = proxy<{
  space: string;
  path: string;
  error?: string;
}>({
  space: "",
  path: "",
});

export const FileListState = proxy<{
  list: FileItem[];
  loading: boolean;
  run?: () => void;
}>({
  list: [],
  loading: false,
});

export const FileTreeState = proxy<{
  tree: TreeItem[];
}>({
  tree: [],
});

export const getDir = (path: string) => {
  let res = path.split("/");
  res.pop();
  return res.join("/");
};

export const getName = (path: string) => {
  let res = path.split("/");
  return res[res.length - 1];
};

export const getTreeFromList = (list: FileItem[]) => {
  const dirMap: Map<string, TreeItem> = new Map();
  for (let item of list) {
    let dir = getDir(item.path);
    let treeItem: TreeItem = {
      ...item,
      name: getName(item.path),
      isDir: false,
      children: [],
      father: undefined,
    };
    dirMap.set(item.path, treeItem);
    while (dir) {
      let father = dirMap.get(dir);
      if (!father) {
        father = {
          space: item.space,
          father: undefined,
          size: 0,
          time: 0,
          path: dir,
          name: getName(dir),
          isDir: true,
          children: [],
        };
        dirMap.set(dir, father);
      }
      father.size += item.size;
      father.time = Math.max(father.time, item.time);
      father.children.push(treeItem);
      treeItem.father = father;
      treeItem = father;
      dir = getDir(dir);
    }
  }
  const tree: TreeItem[] = [];
  for (let [path, item] of dirMap) {
    let dir = getDir(path);
    if (!dir) {
      tree.push(item);
    }
  }
  return tree;
};

export const enum FileUploadResult {
  success,
  error,
  uploading,
  prepare,
}

interface FileUploadItem {
  progress: ProgressInfo;
  key: string;
  result: FileUploadResult;
  name: string;
}

export const FileUploadListState = proxy<{
  list: FileUploadItem[];
}>({
  list: [],
});

export const uploadMore = (path: string, files: File[]) => {
  files.forEach((item) => {
    let state: FileUploadItem = {
      key: join(path, item.name),
      name: item.name,
      result: FileUploadResult.uploading,
      progress: {
        loaded: 0,
        total: 0,
        speed: 0,
        percent: 0,
      },
    };
    FileUploadListState.list.push(state);
    const set = (a: Partial<FileUploadItem>) => {
      FileUploadListState.list = FileUploadListState.list.map((item) => {
        if (item.key === state.key) return { ...item, ...a };
        return item;
      });
    };
    fetchUpload({
      body: item,
      onProgress(progressData) {
        set({
          progress: progressData,
        });
      },
      key: state.key,
    }).then(async ({ ok }) => {
      FileListState.run?.();
      if (ok) {
        set({
          result: FileUploadResult.success,
        });
        await sleep(1000);
        FileUploadListState.list = FileUploadListState.list.filter(
          (item) => item.key !== state.key
        );
      } else {
        set({
          result: FileUploadResult.error,
        });
        showNotification({
          message: `${state.name} 上传失败`,
          color: "red",
        });
        await sleep(3000);
        FileUploadListState.list = FileUploadListState.list.filter(
          (item) => item.key !== state.key
        );
      }
    });
  });
};

export const uploadFromUrl = (data: { key: string; url: string }) => {
  fetchFileUrlUpload(data).then((res) => {
    if (!res.ok) {
      showNotification({
        message: res.message,
        color: "red",
      });
      return;
    }
    let state: FileUploadItem = {
      progress: {
        loaded: 0,
        total: 0,
        speed: 0,
        percent: 0,
      },
      key: data.key,
      name: getName(data.key),
      result: FileUploadResult.prepare,
    };
    const set = (a: Partial<FileUploadItem>) => {
      FileUploadListState.list = FileUploadListState.list.map((item) => {
        if (item.key === state.key) return { ...item, ...a };
        return item;
      });
    };
    FileUploadListState.list.push(state);
    let timer = setInterval(async () => {
      const res = await fetchFileUrlUploadStatus({ key: state.key });
      if (!res.ok) {
        return;
      }
      switch (res.data?.state) {
        case "prepare":
          set({
            result: FileUploadResult.prepare,
            progress: res.data.progress,
          });
          break;
        case "uploading":
          set({
            result: FileUploadResult.uploading,
            progress: res.data.progress,
          });
          break;
        case "success":
          FileListState.run?.();
          clearInterval(timer);
          set({
            result: FileUploadResult.success,
            progress: res.data.progress,
          });
          await sleep(1000);
          FileUploadListState.list = FileUploadListState.list.filter(
            (item) => item.key !== state.key
          );
          break;
        case "error":
          FileListState.run?.();
          clearInterval(timer);
          set({
            result: FileUploadResult.error,
            progress: res.data.progress,
          });
          showNotification({
            message: `${state.name} 上传失败，${res.data?.message}`,
            color: "red",
          });
          await sleep(3000);
          FileUploadListState.list = FileUploadListState.list.filter(
            (item) => item.key !== state.key
          );
          break;
      }
    }, 1000);
  });
};

export const getShareUrl = (key: string) => {
  key = encodeURIComponent(key);
  return `https://seashellw.world/server/api/file?key=${key}`;
};
