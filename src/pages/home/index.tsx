import Bookmark from "@/components/home/bookmark/Bookmark";
import Format from "@/components/home/Format";
import ShiCi from "@/components/util/ShiCi";
import React from "react";


const Home: React.FC = () => {
  return (
    <>
      <Bookmark />
      <Format />
      <p className="text-center my-10">
        <ShiCi />
      </p>
    </>
  );
};

export default React.memo(Home);
