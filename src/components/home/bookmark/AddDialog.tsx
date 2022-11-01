import { useWatch } from "@/hooks/util";
import { Button, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useCallback, useState } from "react";
import { useSnapshot } from "valtio";
import { ActionType, BookMarkState, useBookmarkAction } from "./bookmarkState";

const AddDialog: React.FC = () => {
  const { fetchAdd, fetchUpdate, fetchDelete } = useBookmarkAction();

  const form = useForm({
    initialValues: {
      ...BookMarkState.item,
    },
    validate(values) {
      return {
        url: values.url ? undefined : "请输入URL",
      };
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const { open, type } = useSnapshot(BookMarkState);

  useWatch(open, (open) => {
    if (open) {
      form.setValues({
        ...BookMarkState.item,
      });
    }
  });

  const handleSave = form.onSubmit(async (values) => {
    BookMarkState.item = values;
    setIsLoading(true);
    switch (BookMarkState.type) {
      case ActionType.Add:
        await fetchAdd();
        break;
      case ActionType.Edit:
        await fetchUpdate();
        break;
    }
    setIsLoading(false);
    BookMarkState.open = false;
  });

  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    await fetchDelete();
    setIsLoading(false);
    BookMarkState.open = false;
  }, [fetchDelete]);

  return (
    <Modal
      opened={open}
      onClose={() => (BookMarkState.open = false)}
      title={type === ActionType.Add ? "新增书签" : "编辑书签"}
      closeOnClickOutside={false}
    >
      <form onSubmit={handleSave} >
        <TextInput label="标题" {...form.getInputProps("title")} mb="sm" />
        <TextInput label="链接" {...form.getInputProps("url")} mb="lg" />
        <Button
          type="submit"
          variant="filled"
          mr="sm"
          mb="sm"
          loading={isLoading}
        >
          确定
        </Button>
        {type === ActionType.Edit ? (
          <Button
            onClick={handleDelete}
            variant="subtle"
            color="gray"
            loading={isLoading}
          >
            删除
          </Button>
        ) : null}
      </form>
    </Modal>
  );
};

export default React.memo(AddDialog);