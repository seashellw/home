import logoImg from "./logo.svg";
import { headerIconHeight } from "@/components/layouts/AppHeader";
import React from "react";
import "./logo.css";

const Logo = React.memo(() => {
  return (
    <img
      src={logoImg}
      alt="logo"
      style={{
        width: headerIconHeight,
        height: headerIconHeight,
      }}
      className="spin-9 mr-3"
    />
  );
});

export default Logo;
