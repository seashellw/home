import { LogInState } from "@/hooks/user";
import { useStorageStore } from "@/hooks/util";
import { ActionIcon, Button, Group } from "@mantine/core";
import React, { Suspense, useCallback } from "react";
import { useSnapshot } from "valtio";
import {
  ActionType,
  BookmarkItem,
  BookMarkListState,
  BookMarkState,
} from "./bookmarkState";

const AddDialog = React.lazy(() => import("./AddDialog"));

const ButtonItem: React.FC<{
  item: BookmarkItem;
}> = React.memo(({ item }) => {
  return (
    <Button
      component="a"
      variant="default"
      target="_blank"
      href={item.url}
      key={item.id}
      onContextMenu={(e: React.MouseEvent) => {
        e.preventDefault();
        BookMarkState.open = true;
        BookMarkState.type = ActionType.Edit;
        BookMarkState.item = item;
      }}
    >
      {item.title}
    </Button>
  );
});

const Bookmark: React.FC = () => {
  const handleAdd = useCallback(() => {
    BookMarkState.open = true;
    BookMarkState.type = ActionType.Add;
    BookMarkState.item = { title: "", url: "", id: "" };
  }, []);

  useStorageStore("BookMarkListState", BookMarkListState);

  const { list } = useSnapshot(BookMarkListState);

  const isLogIn = useSnapshot(LogInState).isLogIn;
  if (!isLogIn) return null;

  return (
    <Group spacing="xs">
      {list.map((item) => (
        <ButtonItem key={item.id} item={item} />
      ))}
      <ActionIcon onClick={handleAdd} title="添加书签" variant="light">
        <i className="ti ti-circle-plus"></i>
      </ActionIcon>
      <Suspense>
        <AddDialog />
      </Suspense>
    </Group>
  );
};

export default React.memo(Bookmark);
