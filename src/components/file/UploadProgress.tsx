import { useMinWidth } from "@/hooks/util";
import { formatSize } from "@/util/util";
import {
  Button,
  DefaultMantineColor,
  Dialog,
  Loader,
  Portal,
  Progress,
} from "@mantine/core";
import { useToggle } from "ahooks";
import React, { useCallback, useMemo } from "react";
import { useSnapshot } from "valtio";
import { FileUploadListState, FileUploadResult } from "./fileState";

const UploadProgress: React.FC = () => {
  const { list } = useSnapshot(FileUploadListState);
  const opened = useMemo(() => !!list.length, [list]);
  const [isLarge, { toggle: toggleLarge }] = useToggle(true);

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

  const isWindowLarge = useMinWidth(600);

  return (
    <>
      <Dialog
        opened={opened && isLarge}
        withCloseButton
        onClose={toggleLarge}
        size={isWindowLarge ? "lg" : "calc(100vw - 50px)"}
        radius="md"
      >
        <p className="mt-0 mb-1">{`正在进行中 ${list.length}`}</p>
        {list.map((item) => (
          <div key={item.key} className="my-3 truncate">
            <span className="">{item.name}</span>
            <Progress
              value={item.progress.percent * 100}
              color={getState(item.result).color}
            />
            <span className="inline-flex w-full gap-4 text-sm">
              <span>{formatSize(item.progress.total)}</span>
              <span className="flex-grow">{getState(item.result).label}</span>
              <span>{(item.progress.percent * 100).toFixed(0)}%</span>
              {item.progress.speed ? (
                <span>{formatSize(item.progress.speed)}/s</span>
              ) : null}
            </span>
          </div>
        ))}
      </Dialog>
      {opened && !isLarge ? (
        <Portal>
          <Button
            onClick={toggleLarge}
            variant="default"
            sx={{
              position: "fixed",
              bottom: 10,
              right: 12,
            }}
            leftIcon={<Loader size="sm" color="green" />}
          >
            上传中
          </Button>
        </Portal>
      ) : null}
    </>
  );
};

export default React.memo(UploadProgress);
