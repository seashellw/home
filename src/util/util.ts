declare global {
  interface Window {
    Prism: any;
    confetti: any;
    filesize: any;
  }
}

/**
 * 格式化文件大小, 输出成带单位的字符串
 */
export function formatSize(size: number | string | undefined) {
  if (typeof size !== "number") {
    size = parseInt(size || "0");
  }
  return window?.filesize?.(size) as string | undefined;
}

/**
 * 获取文件扩展名，不带点号
 */
export function getFileExtensionName(fileName: string | undefined): string {
  return fileName?.split(".")?.pop() || "";
}

/**
 * 复制到剪切板
 */
export const copy = async (text: string) => {
  await navigator.clipboard.writeText(text.trim());
};

/**
 * 发射五彩纸屑
 */
export const launchParty = (option?: {
  // 横坐标
  x?: number;
  // 纵坐标
  y?: number;
  // 旋转角度
  angle?: number;
  // 散射角度
  spread?: number;
  // 纸屑数量
  count?: number;
}) => {
  option ||= {};
  option.x ||= window.innerWidth / 2;
  option.y ||= window.innerHeight / 2;
  option.count ||= 200;
  option.spread ||= 120;
  option = {
    ...option,
    x: option.x / window.innerWidth,
    y: option.y / window.innerHeight,
  };
  window?.confetti({
    origin: {
      x: option.x,
      y: option.y,
    },
    angle: option.angle,
    spread: option.spread,
    particleCount: option.count,
    zIndex: 9999,
  });
};

/**
 * 全局刷新代码高亮
 */
export const refreshPrism = () => {
  requestIdleCallback(() => {
    window?.Prism?.highlightAll();
  });
};

export const sleep = (time: number) =>
  new Promise<void>((resolve) => setTimeout(() => resolve(), time));

export type DeepReadonly<T> = {
  readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export const isImg = (fileName: string | undefined) => {
  return fileName?.match(
    /.(jpg|jpeg|png|gif|bmp|webp|svg|ico|cur|apng|avif)$/i
  );
};

export const isVideo = (fileName: string | undefined) => {
  return fileName?.match(/.(mp4|webm)$/i);
};
