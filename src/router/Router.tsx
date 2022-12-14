import Icon from "@/components/util/Icon";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const h = (c: () => Promise<{ default: React.FC }>) =>
  React.createElement(React.lazy(c));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: h(() => import("@/pages/App")),
      children: [
        {
          index: true,
          element: h(() => import("@/pages/home/Home")),
        },
        {
          path: "/file-system",
          element: h(() => import("@/pages/file-system/FileSystem")),
        },
      ],
    },
  ],
);

export default React.memo(() => <RouterProvider router={router} />);

export interface MenuItem {
  title: string;
  path: string;
  icon: JSX.Element;
}

export const menu: MenuItem[] = [
  {
    title: "主页",
    path: "/",
    icon: <Icon icon="armchair" />,
  },
  {
    title: "文件系统",
    path: "/file-system",
    icon: <Icon icon="brand-google-drive" />,
  },
];
