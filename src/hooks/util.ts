import { useForm } from "@mantine/form";
import { UseFormInput } from "@mantine/form/lib/types";
import { useMediaQuery } from "@mantine/hooks";
import { useMemoizedFn } from "ahooks";
import destr from "destr";
import { isEqual } from "lodash-es";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { subscribe } from "valtio";

export const useOnMount = (cb: () => (() => void) | void | Promise<void>) => {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    let cb = ref.current();
    if (cb instanceof Function) {
      return cb;
    }
  }, []);
};

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
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

export const useHandleInput = (cb: (value: string) => void) =>
  useCallback(
    (e: any) => {
      cb(e.target.value);
    },
    [cb]
  );

export const useWatch: <T>(
  value: T,
  cb: (value: T) => (() => void) | void
) => void = (value, cb) => {
  cb = useMemoizedFn(cb);
  useEffect(() => {
    return cb(value);
  }, [cb, value]);
};

/**
 * 存储valtio数据到本地
 */
export const useStorageStore = (key: string, store: Object) => {
  useOnMount(() => {
    let data = localStorage.getItem(key);
    if (data) Object.assign(store, destr(data));
    return subscribe(store, () => {
      localStorage.setItem(key, JSON.stringify(store));
    });
  });
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
    if (!isEqual(values, state)) Object.assign(state, values);
  });
  useWatch(state, (state) => {
    if (!isEqual(state, formObj.values)) formObj.setValues(state);
    return subscribe(state, () => {
      if (!isEqual(state, formObj.values)) formObj.setValues(state);
    });
  });

  return formObj;
};
