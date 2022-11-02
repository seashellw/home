import { useOnMount } from "@/hooks/util";
import React, { useRef } from "react";

const ShiCi: React.FC = () => {
  const first = useRef(true);
  useOnMount(() => {
    if (first.current) {
      const id = "jinrishici-script";
      let old = document.querySelector("#" + id);
      if (old) old.remove();
      const el = document.createElement("script");
      el.src = "https://sdk.jinrishici.com/v2/browser/jinrishici.js";
      el.id = id;
      document.body.appendChild(el);
      first.current = false;
    }
  });
  return <span className="jinrishici-sentence">正在加载....</span>;
};

export default React.memo(ShiCi);
