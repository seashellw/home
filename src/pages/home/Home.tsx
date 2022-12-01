import Bookmark from "@/components/home/bookmark/Bookmark";
import ShiCi from "@/components/util/ShiCi";
import { Skeleton } from "@mantine/core";
import React, { Suspense } from "react";

const JsonFormat = React.lazy(() => import("@/components/home/JsonFormat"));
const TopSearch = React.lazy(() => import("@/components/home/TopSearch"));

const Home: React.FC = () => {
  return (
    <>
      <Bookmark />
      <Suspense
        fallback={<Skeleton m="md" width={"auto"} height={150} radius="sm" />}
      >
        <JsonFormat />
      </Suspense>
      <p className="text-center my-10">
        <ShiCi />
      </p>
      <Suspense
        fallback={<Skeleton m="md" width={"auto"} height={200} radius="sm" />}
      >
        <TopSearch />
      </Suspense>
    </>
  );
};

export default React.memo(Home);
