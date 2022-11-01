import React from "react";
import img from "public/undraw_empty_re_opql.svg";

const Empty: React.FC<{
  text?: string;
}> = (props) => {
  return (
    <div
      style={{ margin: "5rem 20%" }}
      className={"flex flex-col items-center"}
    >
      <div className={"max-w-sm"}>
        <img className="w-full h-auto" src={img} alt={"empty"} />
      </div>
      <span className={"m-2 text-center block text-neutral-500"}>
        {props.text || "暂无数据"}
      </span>
    </div>
  );
};

export default React.memo(Empty);
