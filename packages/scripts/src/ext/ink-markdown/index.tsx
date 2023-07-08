import React from "react";
import marked from "marked";
import TerminalRenderer, { TerminalRendererOptions } from "marked-terminal";

import { Text } from "../ink";

type Props = TerminalRendererOptions & {
  children: string;
};

export default function Markdown({ children, ...options }: Props) {
  marked.setOptions({ renderer: new TerminalRenderer(options) });
  return <Text>{marked(children).trim()}</Text>;
}
