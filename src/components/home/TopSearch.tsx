import { fetchTopSearch } from "@/http/tool/top-search";
import { Anchor, Badge, Card, Skeleton } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useLocalStorageState, useRequest } from "ahooks";
import React from "react";

const TopSearch: React.FC = () => {
  const [data, setData] = useLocalStorageState<
    {
      id: string;
      title: number;
      url: string;
      type: string;
    }[]
  >("top-search", { defaultValue: [] });

  const { loading } = useRequest(async () => {
    let res = await fetchTopSearch();
    if (!res.ok) {
      showNotification({
        title: "获取热搜失败",
        message: res.message,
        color: "red",
      });
      return;
    }
    let data = res.data?.list;
    if (!data) return;
    setData(data);
  });
  return (
    <Card withBorder className="m-3 py-3 px-4">
      {loading && !data.length ? (
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
                {item.title}
              </Anchor>
              <Badge color="blue" className="mx-2">
                {item.type}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default React.memo(TopSearch);
