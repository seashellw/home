import { useWatch } from "@/hooks/util";
import { checkPath, join } from "@/util/tencent";
import {
  Button,
  FileInput,
  Modal,
  SegmentedControl,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import React, { Suspense } from "react";
import Icon from "../util/Icon";
import {
  FileFormDataState,
  getName,
  uploadFromUrl,
  uploadMore,
} from "./fileState";
import { getSpaceError } from "./SearchForm";

const UploadProgress = React.lazy(() => import("./UploadProgress"));

const SegmentedControlData = [
  { value: "upload", label: "本地上传" },
  { value: "url", label: "从URL上传" },
];

const AddDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const form = useForm({
    initialValues: {
      ...FileFormDataState,
      url: "",
      fileList: [] as File[],
      type: "upload",
    },
    validate: (values) => {
      const errors: Record<string, string | undefined> = {};
      errors.space = getSpaceError(values.space);
      errors.path = checkPath(values.path) ? undefined : "路径不合法";
      switch (type) {
        case "upload":
          if (!values.fileList.length) {
            errors.fileList = "请选择文件";
          }
          break;
        case "url":
          if (!values.url) {
            errors.url = "请输入链接";
          } else {
            const reg = /(http|https):\/\/([\w.]+\/?)\S*/i;
            if (!reg.test(values.url)) {
              errors.url = "链接不正确";
              break;
            }
            try {
              new URL(values.url);
            } catch (e) {
              errors.url = "链接解析失败";
              break;
            }
          }
          break;
      }
      return errors;
    },
    validateInputOnChange: true,
  });

  useWatch(open, (open) => {
    if (open) {
      form.setValues({
        ...FileFormDataState,
        path: "/",
        fileList: [] as File[],
        url: "",
      });
    }
  });

  const handleSave = form.onSubmit(async (values) => {
    let { type, fileList, url, space, path } = values;
    switch (type) {
      case "upload":
        if (fileList.length === 0) {
          showNotification({
            message: "请选择文件",
          });
          return;
        }
        uploadMore(join(space, path), fileList);
        break;
      case "url":
        if (!url) {
          showNotification({
            message: "请输入URL",
          });
          return;
        }
        const key = join(space, path, getName(new URL(url).pathname));
        uploadFromUrl({ key, url });
        break;
    }
    onClose();
  });

  const { type } = form.values;
  return (
    <>
      <Modal
        opened={open}
        onClose={onClose}
        title="上传文件"
        closeOnClickOutside={false}
      >
        <form onSubmit={handleSave}>
          <SegmentedControl
            data={SegmentedControlData}
            value={type}
            onChange={(value) => form.setFieldValue("type", value)}
            mb="xs"
          />
          <TextInput
            label="命名空间"
            {...form.getInputProps("space")}
            mb="sm"
            withAsterisk
          />
          <TextInput label="路径" {...form.getInputProps("path")} mb="sm" />
          {type === "upload" ? (
            <FileInput
              label="文件"
              placeholder="请选择"
              mb="md"
              withAsterisk
              value={form.values.fileList}
              onChange={(value) => form.setFieldValue("fileList", value)}
              error={form.errors.fileList}
              multiple
              icon={<Icon icon="upload" className="relative -top-[2px]" />}
            />
          ) : null}
          {type === "url" ? (
            <TextInput
              label="URL"
              mb="md"
              withAsterisk
              autoFocus
              {...form.getInputProps("url")}
            />
          ) : null}
          <Button
            variant="filled"
            leftIcon={<Icon icon="checks" />}
            type="submit"
          >
            上传
          </Button>
        </form>
      </Modal>
      <Suspense>
        <UploadProgress />
      </Suspense>
    </>
  );
};

export default React.memo(AddDialog);
