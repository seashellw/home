import { useHandleInput, useOpen, useStorageStore } from "@/hooks/util";
import { checkPathItem, fetchFileList } from "@/util/tencent";
import { Button, TextInput } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRequest } from "ahooks";
import React, { Suspense, useEffect } from "react";
import { useSnapshot } from "valtio";
import { FileFormDataState, FileListState } from "./fileState";

const AddDialog = React.lazy(() => import("./AddDialog"));

export const getSpaceError = (value: string) => {
  if (!value) return "请输入命名空间";
  if (!checkPathItem(value)) return "不能包含特殊字符";
};

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
    FileFormDataState.error = getSpaceError(value);
  });

  const { open, onClose, onOpen } = useOpen();

  return (
    <div className="flex gap-2">
      <TextInput
        placeholder="命名空间"
        className="flex-grow"
        value={space}
        onChange={handleChange}
        error={error}
      />

      <Button
        leftIcon={<i className="ti ti-circle-plus"></i>}
        color="green"
        onClick={onOpen}
      >
        新增
      </Button>
      <Suspense>
        <AddDialog open={open} onClose={onClose} />
      </Suspense>
    </div>
  );
};

export default React.memo(SearchForm);
