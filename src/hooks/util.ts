import { jsonParse } from "@/interface/util";
import { useMediaQuery } from "@mantine/hooks";
import {
  useLocalStorageState,
  useMemoizedFn,
  useMount,
  useUnmount,
} from "ahooks";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { equals } from "remeda";
import { subscribe } from "valtio";

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useMount(() => {
    setIsMounted(true);
  });
  return isMounted;
}

export const useInputValue: (initVal?: string) => [string, (e: any) => void] = (
  initVal
) => {
  const [value, setValue] = useState(initVal ?? "");
  const onChange = useMemoizedFn((e) => {
    setValue(e.target.value);
  });
  return useMemo(() => [value, onChange], [value, onChange]);
};

export const useOpen = (initVal = false) => {
  const [open, setOpen] = useState(initVal);
  const openFn = useMemoizedFn(() => setOpen(true));
  const closeFn = useMemoizedFn(() => setOpen(false));
  return useMemo(
    () => ({
      open,
      onOpen: openFn,
      onClose: closeFn,
    }),
    [open, openFn, closeFn]
  );
};

/**
 * 第一次访问时调用
 */
export const useFirstVisit = (cb: () => void) => {
  const [isFirst, setIsFirst] = useLocalStorageState("isFirst", {
    defaultValue: true,
  });
  useMount(() => {
    if (isFirst) {
      cb();
      setIsFirst(false);
    }
  });
};

export const useHandleInput = (cb: (value: string) => void) =>
  useCallback(
    (e: any) => {
      cb(e.target.value);
    },
    [cb]
  );

export const useWatch: <T>(value: T, cb: (value: T) => void) => void = (
  value,
  cb
) => {
  cb = useMemoizedFn(cb);
  useEffect(() => {
    cb(value);
  }, [cb, value]);
};

/**
 * 存储valtio数据到本地
 */
export const useStorageStore = (key: string, store: Object) => {
  useEffect(() => {
    console.log(key, store);
    let data = localStorage.getItem(key);
    if (data) Object.assign(store, jsonParse(data));
    const unSub = subscribe(store, () => {
      localStorage.setItem(key, JSON.stringify(store));
    });
    return () => {
      unSub();
    };
  }, [key, store]);
};

/**
 * 赋予表单数据本地存储的功能
 */
export const useStorageForm: (
  key: string,
  form: {
    values: Object;
    setValues: (values: Object) => void;
  }
) => void = (key, form) => {
  const [isMounted, setIsMounted] = useState(false);

  useMount(() => {
    setIsMounted(true);
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      try {
        let str = localStorage.getItem(key);
        if (!str) return;
        form.setValues(JSON.parse(str));
      } catch (e) {
        console.log("读取表单数据失败", e);
      }
    }
  });

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(key, JSON.stringify(form.values));
  }, [form.values, isMounted, key]);
};

/**
 * 同步两个对象。
 * 内部将进行深比较
 */
export const useSync: <T extends Object>(
  dataList: [T, T],
  cbList: [(data: T) => void, (data: T) => void]
) => void = (dataList, cbList) => {
  const [a, b] = dataList;
  const [setA, setB] = cbList;
  useWatch(a, (a) => {
    if (!equals(a, b)) {
      setB(a);
    }
  });
  useWatch(b, (b) => {
    if (!equals(a, b)) {
      setA(b);
    }
  });
};

export const useMinWidth = (width: number) =>
  useMediaQuery(`(min-width: ${width}px)`);
