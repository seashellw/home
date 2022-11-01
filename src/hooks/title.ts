import { menu } from "@/router";
import { useTitle } from "ahooks";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const usePageTitle = () => {
  const { pathname } = useLocation();

  const title = useMemo(
    () => menu.find((item) => item.path === pathname)?.title,
    [pathname]
  );

  const pageTitle = useMemo(
    () => [title, "应用程序"].filter((item) => item).join(" - "),
    [title]
  );

  useTitle(pageTitle);

  return useMemo(
    () => ({
      title,
    }),
    [title]
  );
};
