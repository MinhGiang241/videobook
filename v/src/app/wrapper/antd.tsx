"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import AntdRegistry from "@ant-design/nextjs-registry/lib/AntdRegistry";
import ConfigProvider from "antd/es/config-provider";
import { ReactNode } from "react";
import "@ant-design/v5-patch-for-react-19";
import React from "react";
import type Entity from "@ant-design/cssinjs/es/Cache";
import {
  createCache,
  StyleProvider,
} from "@ant-design/cssinjs/lib/StyleContext";
import { useServerInsertedHTML } from "next/dist/shared/lib/server-inserted-html.shared-runtime";
import extractStyle from "@ant-design/cssinjs/lib/extractStyle";

export default function AntdWrapper({ children }: { children: ReactNode }) {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  useServerInsertedHTML(() => (
    <style
      id="antd"
      dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
    />
  ));

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#a21caf" } }}>
      <StyleProvider cache={cache}>{children}</StyleProvider>
    </ConfigProvider>
  );
}
