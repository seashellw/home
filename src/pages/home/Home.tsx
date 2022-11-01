import Bookmark from "@/components/home/bookmark/Bookmark";
import ShiCi from "@/components/util/ShiCi";
import { Skeleton } from "@mantine/core";
import React, { Suspense } from "react";

const Format = React.lazy(() => import("@/components/home/Format"));

const Home: React.FC = () => {
  return (
    <>
      <Bookmark />
      <Suspense fallback={<Skeleton my="md" height={150} radius="sm" />}>
        <Format />
      </Suspense>
      <p className="text-center my-10">
        <ShiCi />
      </p>
    </>
  );
};

export default React.memo(Home);
