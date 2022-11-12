import { useHandleInput, useMinWidth } from "@/hooks/util";
import { fetchDeleteFile, join } from "@/util/tencent";
import {
  DeepReadonly,
  formatSize,
  getFileExtensionName,
  isImg,
  isVideo,
} from "@/util/util";
import { Button, Image, Input, List, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Prism } from "@mantine/prism";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FileListState, getShareUrl, moveFile, TreeItem } from "./fileState";

const { Item } = List;

const FileDetailModal: React.FC<{
  open: boolean;
  onClose: () => void;
  item?: DeepReadonly<TreeItem>;
}> = ({ open, onClose, item }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [filePath, setFilePath] = useState("");
  const onChangeFilePath = useHandleInput(setFilePath);
  useEffect(() => {
    setFilePath(item?.path || "");
  }, [item?.path, setFilePath]);
  const handleDelete = useCallback(async () => {
    if (!item) return;
    setIsLoading(true);
    let err = await fetchDeleteFile(join(item?.space, item?.path));
    setIsLoading(false);
    if (!err) {
      showNotification({
        message: "删除成功",
        color: "green",
      });
    } else {
      showNotification({
        title: "删除失败",
        message: err,
        color: "red",
      });
    }
    FileListState.run?.();
    onClose();
  }, [item, onClose]);

  const isWindowLarge = useMinWidth(500);
  const url = useMemo(
    () => getShareUrl(join(item?.space, item?.path)),
    [item?.path, item?.space]
  );

  const handleRename = useCallback(async () => {
    if (!item) return;
    moveFile(item, filePath);
    onClose();
  }, [filePath, item, onClose]);

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title={item?.name}
      size={isWindowLarge ? "md" : "calc(100% - 40px)"}
    >
      <Prism language="markdown" mb={"sm"}>
        {url}
      </Prism>
      {isImg(item?.name) ? <Image src={url} className="w-full" /> : null}
      {isVideo(item?.name) ? (
        <video src={url} controls className="w-full" autoPlay />
      ) : null}
      {item ? (
        <List my="sm">
          <Item>文件大小：{formatSize(item.size)}</Item>
          <Item>上传时间：{new Date(item.time).toLocaleString()}</Item>
          <Item>文件类型：{getFileExtensionName(item.name)}</Item>
        </List>
      ) : null}
      <p className="mb-1">移动到</p>
      <div className="flex gap-2 mb-4">
        <Input
          value={filePath}
          onChange={onChangeFilePath}
          className="flex-grow"
          disabled={isLoading}
        />
        <Button color="grape" onClick={handleRename} loading={isLoading}>
          确定
        </Button>
      </div>
      <Button color="red" onClick={handleDelete} loading={isLoading}>
        删除
      </Button>
    </Modal>
  );
};

export default React.memo(FileDetailModal);
