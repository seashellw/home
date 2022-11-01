import { useMinWidth } from "@/hooks/util";
import { fetchDeleteFile, join } from "@/util/tencent";
import {
  DeepReadonly,
  formatSize,
  getFileExtensionName,
  isImg,
  isVideo,
} from "@/util/util";
import { Image } from "@mantine/core";
import { Button, List, Modal } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Prism } from "@mantine/prism";
import React, { useCallback, useMemo, useState } from "react";
import { FileListState, getShareUrl, TreeItem } from "./fileState";

const { Item } = List;

const FileDetailModal: React.FC<{
  open: boolean;
  onClose: () => void;
  item?: DeepReadonly<TreeItem>;
}> = ({ open, onClose, item }) => {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const handleDelete = useCallback(async () => {
    if (!item) return;
    setIsDeleteLoading(true);
    let res = await fetchDeleteFile(join(item?.space, item?.path));
    setIsDeleteLoading(false);
    if (res) {
      showNotification({
        message: "删除成功",
        color: "green",
      });
    } else {
      showNotification({
        message: "删除失败",
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
      <Button
        size="xs"
        color="red"
        onClick={handleDelete}
        loading={isDeleteLoading}
      >
        删除
      </Button>
    </Modal>
  );
};

export default React.memo(FileDetailModal);
