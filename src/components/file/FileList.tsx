import { useOpen } from "@/hooks/util";
import { getFileUrl } from "@/util/tencent";
import { DeepReadonly } from "@/util/util";
import { ActionIcon, Anchor, Box, BoxProps } from "@mantine/core";
import React, { Suspense, useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import Icon from "../util/Icon";
import {
  FileListState,
  FileTreeState,
  getTreeFromList,
  TreeItem,
} from "./fileState";

const FileDetailModal = React.lazy(() => import("./FileDetailModal"));

const Link: React.FC<{ item: DeepReadonly<TreeItem> }> = React.memo(
  ({ item }) => {
    const [href, setHref] = useState<string | undefined>(undefined);
    useEffect(() => {
      getFileUrl(item).then(setHref);
    }, [item]);
    return (
      <Anchor
        sx={{ color: "inherit" }}
        href={href}
        target="_blank"
        className="truncate"
      >
        {item.name}
      </Anchor>
    );
  }
);

const Tree: React.FC<
  Partial<BoxProps> & {
    tree: DeepReadonly<TreeItem[]>;
    onContext?: (item: DeepReadonly<TreeItem>) => void;
  }
> = React.memo((props) => {
  const { tree, onContext, ...others } = props;
  return (
    <Box component="ul" className="list-none pl-4" {...others}>
      {tree.map((item) => (
        <li key={item.name}>
          <Box
            component="p"
            sx={{ width: "calc(100% - 10px)" }}
            className="inline-flex items-center gap-2 my-[3px]"
          >
            <ActionIcon onClick={() => onContext?.(item)}>
              <Icon
                icon={item.isDir ? "folder" : "circle-dot"}
                color={item.isDir ? "#FCC419" : "#339AF0"}
              />
            </ActionIcon>
            {item.isDir ? (
              <span className="truncate">{item.name}</span>
            ) : (
              <Link item={item} />
            )}
          </Box>
          {item.children.length ? (
            <Tree tree={item.children} onContext={onContext} />
          ) : null}
        </li>
      ))}
    </Box>
  );
});

const FileList: React.FC = () => {
  const { list } = useSnapshot(FileListState);
  useEffect(() => {
    const { list } = FileListState;
    FileTreeState.tree = getTreeFromList(list);
  }, [list]);

  const { open, onClose, onOpen } = useOpen();

  const [item, setItem] = useState<DeepReadonly<TreeItem> | undefined>(
    undefined
  );

  const { tree } = useSnapshot(FileTreeState);
  return (
    <>
      <Tree
        tree={tree}
        my="sm"
        onContext={(e) => {
          setItem(e);
          onOpen();
        }}
      />
      <Suspense>
        <FileDetailModal open={open} onClose={onClose} item={item} />
      </Suspense>
    </>
  );
};

export default React.memo(FileList);