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
          path: "/fileSystem",
          element: h(() => import("@/pages/fileSystem/FileSystem")),
        },
      ],
    },
  ],
  { basename: "/home" }
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
    icon: <i className="ti ti-armchair"></i>,
  },
  {
    title: "文件系统",
    path: "/fileSystem",
    icon: <i className="ti ti-brand-google-drive"></i>,
  },
];
