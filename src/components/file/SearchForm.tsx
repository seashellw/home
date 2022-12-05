import { useHandleInput, useOpen, useStorageStore } from "@/hooks/util";
import { fetchFileList } from "@/http/file/tencent";
import { ActionIcon, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRequest } from "ahooks";
import React, { Suspense, useEffect } from "react";
import { useSnapshot } from "valtio";
import Icon from "../util/Icon";
import { FileFormDataState, FileListState } from "./file-state";

const AddDialog = React.lazy(() => import("./AddDialog"));

const SearchForm: React.FC = () => {
  useStorageStore("FileListState", FileListState);
  useStorageStore("FileFormDataState", FileFormDataState);
  const { space, error } = useSnapshot(FileFormDataState);

  const { run, loading } = useRequest(
    async () => {
      if (!space) return;
      if (error) return;
      let res = await fetchFileList(space);
      if (!res) {
        showNotification({
          message: "获取文件列表失败",
          color: "red",
        });
        return;
      }
      let list = res;
      FileListState.list = list;
    },
    { refreshDeps: [space], debounceWait: 300 }
  );

  useEffect(() => {
    FileListState.loading = loading;
    FileListState.run = run;
  }, [loading, run]);

  const handleChange = useHandleInput((value) => {
    FileFormDataState.space = value;
    FileFormDataState.error = value ? undefined : "请输入命名空间";
  });

  const { open, onClose, onOpen } = useOpen();

  return (
    <div className="flex gap-2 m-3">
      <TextInput
        placeholder="命名空间"
        className="flex-grow"
        value={space}
        onChange={handleChange}
        error={error}
      />

      <ActionIcon color="green" onClick={onOpen} size="lg" variant="filled">
        <Icon icon="plus" />
      </ActionIcon>
      <Suspense>
        <AddDialog open={open} onClose={onClose} />
      </Suspense>
    </div>
  );
};

export default React.memo(SearchForm);
