import FileList from "@/components/file/FileList";
import SearchForm from "@/components/file/SearchForm";
import React from "react";

const FileSystem: React.FC = () => {
  return (
    <>
      <SearchForm />
      <FileList />
    </>
  );
};

export default React.memo(FileSystem);
