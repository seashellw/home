import { useHandleInput } from "@/hooks/util";
import { fetchToolsFormat } from "@/http/tool/tools-format";
import { Alert, Card, SegmentedControl, Textarea, Title } from "@mantine/core";
import { Prism } from "@mantine/prism";
import React, { useCallback, useMemo, useState } from "react";
import Icon from "../util/Icon";

const Format: React.FC = () => {
  const [input, setInput] = useState("");
  const handleInput = useHandleInput(setInput);

  const [errMessage, setErrMessage] = useState("");

  const fetchData = useCallback(async () => {
    if (!input) return;
    let res = await fetchToolsFormat({
      parser: "json",
      text: input,
    });
    if (!res.ok) {
      return {
        data: "",
        error: res.message,
      };
    }
    return {
      data: res.data?.text,
      error: "",
    };
  }, [input]);

  const [modeValue, setModeValue] = useState("code");

  const Control = useMemo(() => {
    return (
      <SegmentedControl
        onChange={setModeValue}
        data={[
          {
            value: "code",
            label: (
              <span className="flex items-center gap-2">
                <Icon icon="forms" size={15} />
                输入
              </span>
            ),
          },
          {
            value: "preview",
            label: (
              <span className="flex items-center gap-2">
                <Icon icon="zoom-code" size={15} />
                预览
              </span>
            ),
          },
        ]}
      />
    );
  }, []);

  const handleBlur = useCallback(async () => {
    let res = await fetchData();
    if (res?.error) {
      setErrMessage(res.error);
      return;
    }
    if (res?.data) {
      setErrMessage("");
      setInput(res.data);
    }
  }, [fetchData, setInput]);

  return (
    <Card withBorder className="m-3">
      <Title order={6} className="mb-2 flex items-center">
        JSON 编辑器
        <span className="flex-grow"></span>
        {Control}
      </Title>
      {errMessage ? (
        <Alert
          title="错误"
          color="red"
          withCloseButton
          variant="outline"
          mb="sm"
          onClose={() => setErrMessage("")}
          styles={{
            body: {
              overflow: "hidden",
            },
            message: {
              overflow: "auto",
              width: "100%",
            },
          }}
        >
          <pre className="my-0">{errMessage}</pre>
        </Alert>
      ) : null}
      {modeValue === "code" ? (
        <Textarea
          placeholder="文本"
          value={input}
          onChange={handleInput}
          autosize
          error={!!errMessage}
          onBlur={handleBlur}
        />
      ) : (
        <Prism withLineNumbers language={"json"}>
          {input || "预览"}
        </Prism>
      )}
    </Card>
  );
};

export default React.memo(Format);
