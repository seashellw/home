import FileList from "@/components/file/FileList";
import SearchForm from "@/components/file/SearchForm";
import React, { Suspense } from "react";

const UploadProgress = React.lazy(
  () => import("@/components/file/UploadProgress")
);

const FileSystem: React.FC = () => {
  return (
    <>
      <SearchForm />
      <FileList />
      <Suspense>
        <UploadProgress />
      </Suspense>
    </>
  );
};

export default React.memo(FileSystem);
