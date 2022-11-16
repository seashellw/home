import { useInputValue } from "@/hooks/util";
import { fetchToolsFormat } from "@/interface/tool/toolsFormat";
import { Alert, Card, Radio, Textarea, Title } from "@mantine/core";
import { Prism, PrismProps } from "@mantine/prism";
import { useRequest } from "ahooks";
import React, { useMemo, useState } from "react";

const { Group } = Radio;

const languages: {
  label: string;
  parser: string;
  language: PrismProps["language"];
}[] = [
  {
    label: "JSON",
    parser: "json",
    language: "json",
  },
  {
    label: "JavaScript",
    parser: "babel",
    language: "javascript",
  },
  {
    label: "TypeScript",
    parser: "typescript",
    language: "typescript",
  },
  {
    label: "HTML",
    parser: "html",
    language: "markup",
  },
  {
    label: "MarkDown",
    parser: "markdown",
    language: "markdown",
  },
];

const Format: React.FC = () => {
  const [parser, setParser] = useState("json");
  const [input, setInput] = useInputValue();

  const language = useMemo(
    () =>
      languages.find((item) => item.parser === parser)?.language || "markup",
    [parser]
  );

  const [isError, setIsError] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const { data } = useRequest(
    async () => {
      if (!input) return;
      let res = await fetchToolsFormat({
        parser,
        text: input,
      });
      if (!res.ok) {
        setIsError(true);
        setErrMessage(res.message);
        return;
      }
      setIsError(false);
      setErrMessage("");
      return res.data?.text;
    },
    {
      refreshDeps: [parser, input],
      debounceWait: 500,
    }
  );

  return (
    <Card withBorder className="m-3">
      <Title order={6}>格式化</Title>
      <Group value={parser} onChange={setParser} mb="xs">
        {languages.map(({ label, parser }) => (
          <Radio value={parser} label={label} key={label} />
        ))}
      </Group>
      {errMessage ? (
        <Alert
          title="发生错误"
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
      <div className="lg:flex lg:gap-3">
        <Textarea
          placeholder="文本"
          value={input}
          onChange={setInput}
          mb="xs"
          autosize
          error={isError}
          className="lg:w-1/2"
        />
        <Prism withLineNumbers language={language} mb="xs" className="lg:w-1/2">
          {data || "输出"}
        </Prism>
      </div>
    </Card>
  );
};

export default React.memo(Format);
