import { useForm } from "@mantine/form";
import { UseFormInput } from "@mantine/form/lib/types";
import { useMediaQuery } from "@mantine/hooks";
import { useLocalStorageState, useMemoizedFn, useMount } from "ahooks";
import destr from "destr";
import { useCallback, useEffect, useMemo, useState } from "react";
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
    let data = localStorage.getItem(key);
    if (data) Object.assign(store, destr(data));
    const unSub = subscribe(store, () => {
      localStorage.setItem(key, JSON.stringify(store));
    });
    return () => {
      unSub();
    };
  }, [key, store]);
};

export const useMinWidth = (width: number) =>
  useMediaQuery(`(min-width: ${width}px)`);

export const useStateForm = <T extends Object>(
  state: T,
  from: UseFormInput<T>
) => {
  const formObj = useForm({
    initialValues: { ...state },
    ...from,
  });
  useWatch(formObj.values, (values) => {
    if (!equals(values, state)) Object.assign(state, values);
  });
  useEffect(() => {
    const unSub = subscribe(state, () => {
      if (!equals(state, formObj.values)) formObj.setValues(state);
    });
    return () => {
      unSub();
    };
  }, []);

  return formObj;
};
