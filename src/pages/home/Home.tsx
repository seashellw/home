import Bookmark from "@/components/home/bookmark/Bookmark";
import ShiCi from "@/components/util/ShiCi";
import { Skeleton } from "@mantine/core";
import React, { Suspense } from "react";

const JsonFormat = React.lazy(() => import("@/components/home/JsonFormat"));
const TopSearch = React.lazy(() => import("@/components/home/TopSearch"));

const Home: React.FC = () => {
  return (
    <main className="app-main">
      <Bookmark />
      <Suspense fallback={<Skeleton my="md" height={150} radius="sm" />}>
        <JsonFormat />
      </Suspense>
      <p className="text-center my-10">
        <ShiCi />
      </p>
      <Suspense fallback={<Skeleton my="md" height={200} radius="sm" />}>
        <TopSearch />
      </Suspense>
    </main>
  );
};

export default React.memo(Home);
