import { formatSize } from "@/util/util";
import { Badge, DefaultMantineColor, Portal, Progress } from "@mantine/core";
import { useInViewport } from "ahooks";
import React, { useCallback, useRef } from "react";
import { useSnapshot } from "valtio";
import Icon from "../util/Icon";
import { FileUploadListState, FileUploadResult } from "./file-state";

const UploadProgress: React.FC = () => {
  const { list } = useSnapshot(FileUploadListState);

  const getState = useCallback<
    (result: FileUploadResult) => { color: DefaultMantineColor; label: string }
  >((result) => {
    switch (result) {
      case FileUploadResult.prepare:
        return { color: "violet", label: "远程下载中" };
      case FileUploadResult.uploading:
        return { color: "blue", label: "上传中" };
      case FileUploadResult.success:
        return { color: "green", label: "成功" };
      case FileUploadResult.error:
        return { color: "red", label: "失败" };
      case FileUploadResult.copy:
        return { color: "indigo", label: "复制中" };
    }
  }, []);

  const listRef = useRef(null);
  const [inViewport] = useInViewport(listRef);

  if (!list.length) {
    return null;
  }

  return (
    <>
      <p ref={listRef} className="m-3 font-semibold text-cyan-500">
        <Icon icon="activity-heartbeat" className="mr-2" />
        {`进行中 ${list.length}`}
      </p>
      {list.map((item) => (
        <div key={item.key} className="m-3 truncate">
          <span className="">{item.name}</span>
          <Progress
            value={item.progress.percent * 100}
            color={getState(item.result).color}
          />
          <span className="inline-flex w-full gap-4 text-sm">
            <span>{formatSize(item.progress.total)}</span>
            <span className="flex-grow">{getState(item.result).label}</span>
            {item.progress.speed ? (
              <span>{formatSize(item.progress.speed)}/s</span>
            ) : null}
            <span>{(item.progress.percent * 100).toFixed(0)}%</span>
          </span>
        </div>
      ))}
      {!inViewport ? (
        <Portal>
          <Badge className="fixed bottom-5 left-1/2 -translate-x-1/2">
          {`进行中 ${list.length}`}
          </Badge>
        </Portal>
      ) : null}
    </>
  );
};

export default React.memo(UploadProgress);
