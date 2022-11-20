import { useStateForm } from "@/hooks/util";
import { Button, Modal, TextInput } from "@mantine/core";
import React, { useCallback, useState } from "react";
import { useSnapshot } from "valtio";
import { ActionType, BookmarkState, useBookmarkAction } from "./bookmark-state";

const AddDialog: React.FC = () => {
  const { fetchAdd, fetchUpdate, fetchDelete } = useBookmarkAction();

  const form = useStateForm(BookmarkState.item, {
    validate(values) {
      return {
        url: values.url ? undefined : "请输入URL",
      };
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const { open, type } = useSnapshot(BookmarkState);

  const handleSave = form.onSubmit(async () => {
    setIsLoading(true);
    switch (BookmarkState.type) {
      case ActionType.Add:
        await fetchAdd();
        break;
      case ActionType.Edit:
        await fetchUpdate();
        break;
    }
    setIsLoading(false);
    BookmarkState.open = false;
  });

  const handleDelete = useCallback(async () => {
    setIsLoading(true);
    await fetchDelete();
    setIsLoading(false);
    BookmarkState.open = false;
  }, [fetchDelete]);

  return (
    <Modal
      opened={open}
      onClose={() => (BookmarkState.open = false)}
      title={type === ActionType.Add ? "新增书签" : "编辑书签"}
      closeOnClickOutside={false}
    >
      <form onSubmit={handleSave}>
        <TextInput label="标题" {...form.getInputProps("title")} mb="sm" />
        <TextInput
          label="链接"
          {...form.getInputProps("url")}
          mb="lg"
          autoFocus
        />
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
