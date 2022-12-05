import { fetchTopSearch } from "@/http/tool/top-search";
import { formatSizeNumber } from "@/util/util";
import { Anchor, Badge, Card, Skeleton } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useRequest } from "ahooks";
import React from "react";

const TopSearch: React.FC = () => {
  const { data, loading } = useRequest(async () => {
    let res = await fetchTopSearch();
    if (!res.ok) {
      showNotification({
        title: "获取热搜失败",
        message: res.message,
        color: "red",
      });
      return;
    }
    return res.data?.list.map((item) => ({
      ...item,
      hot: formatSizeNumber(item.hot),
      url: `https://cn.bing.com/search?q=${decodeURIComponent(item.name)}`,
    }));
  });
  return (
    <Card withBorder className="m-3 py-3 px-4">
      {loading ? (
        new Array(18)
          .fill(0)
          .map((_, index) => (
            <Skeleton height={16} my={16} key={index} radius="xl" />
          ))
      ) : (
        <ul className="m-0 pl-5 sm:pl-10 ">
          {data?.map((item, index) => (
            <li key={index} className="my-2">
              <Anchor
                href={item.url}
                className="align-middle text-inherit"
                target="_blank"
              >
                {item.name}
              </Anchor>
              <Badge color="orange" className="mx-2">
                {item.hot}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default React.memo(TopSearch);
