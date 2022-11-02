import { LogInState } from "@/hooks/user";
import { fetchBookmarkCreate } from "@/interface/bookmark/bookmarkCreate";
import { fetchBookmarkDelete } from "@/interface/bookmark/bookmarkDelete";
import { fetchBookmarkList } from "@/interface/bookmark/bookmarkList";
import { fetchBookmarkUpdate } from "@/interface/bookmark/bookmarkUpdate";
import { showNotification } from "@mantine/notifications";
import { useRequest } from "ahooks";
import { useCallback, useMemo } from "react";
import { proxy, useSnapshot } from "valtio";

export const enum ActionType {
  Add,
  Edit,
}

export const BookMarkState = proxy<{
  open: boolean;
  type: ActionType;
  item: BookmarkItem;
}>({
  open: false,
  type: ActionType.Add,
  item: {
    id: "",
    title: "",
    url: "",
  },
});

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
}

export const BookMarkListState = proxy<{
  list: BookmarkItem[];
}>({
  list: [],
});

export const useBookmarkAction = () => {
  const isLogIn = useSnapshot(LogInState).isLogIn;

  /**
   * 请求书签列表
   */
  const { run } = useRequest(
    async () => {
      if (!isLogIn) {
        return;
      }
      let res = await fetchBookmarkList();
      if (res.ok && res.data?.list) {
        BookMarkListState.list = res.data?.list;
        return res.data;
      } else {
        showNotification({
          title: "获取书签列表失败",
          message: res.message,
          color: "red",
        });
      }
    },
    { refreshDeps: [isLogIn] }
  );

  /**
   * 发起删除书签的请求
   */
  const fetchDelete = useCallback(async () => {
    const { item } = BookMarkState;
    if (!item?.id) {
      return;
    }
    let res = await fetchBookmarkDelete({
      id: item?.id,
    });
    if (res.ok) {
      showNotification({
        message: "成功删除书签",
        color: "green",
      });
    } else {
      showNotification({
        title: "删除书签失败",
        message: res.message,
        color: "red",
      });
    }
    run();
  }, [run]);

  /**
   * 发起更新书签的请求
   */
  const fetchUpdate = useCallback(async () => {
    const { item } = BookMarkState;
    if (!item?.id) {
      return;
    }
    let res = await fetchBookmarkUpdate(item);
    if (res.ok) {
      showNotification({
        message: "成功更新书签",
        color: "green",
      });
    } else {
      showNotification({
        title: "更新书签失败",
        message: res.message,
        color: "red",
      });
    }
    run();
  }, [run]);

  /**
   * 发起添加书签的请求
   */
  const fetchAdd = useCallback(async () => {
    const { item } = BookMarkState;
    if (!item?.url) {
      return;
    }
    let res = await fetchBookmarkCreate(item);
    if (res.ok) {
      showNotification({
        message: "成功添加书签",
        color: "green",
      });
    } else {
      showNotification({
        title: "添加书签失败",
        message: res.message,
        color: "yellow",
      });
    }
    run();
  }, [run]);

  return useMemo(() => {
    return {
      fetchDelete,
      fetchUpdate,
      fetchAdd,
    };
  }, [fetchAdd, fetchDelete, fetchUpdate]);
};
