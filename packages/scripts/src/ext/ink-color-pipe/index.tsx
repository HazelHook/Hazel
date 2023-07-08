import React, { FunctionComponent, ReactNode } from "react";
import chalkPipe from "chalk-pipe";

import { Transform } from "../ink";

export type ColorProps = {
  styles?: string;
  children?: ReactNode;
};

const Color: FunctionComponent<ColorProps> = ({ styles = "", children }) => {
  return <Transform transform={chalkPipe(styles)}>{children}</Transform>;
};

export default Color;
