import * as React from "react";
import { highlight, Theme } from "cli-highlight";

import { Text } from "../ink";

export interface Props {
  code: string;
  language?: string;
  theme?: Theme;
}
/**
 * SyntaxHighlight.
 */
const SyntaxHighlight: React.FC<Props> = ({ code, language, theme }) => {
  const highlightedCode = React.useMemo(() => {
    return highlight(code, { language, theme });
  }, [code, language, theme]);

  return <Text>{highlightedCode}</Text>;
};

export default SyntaxHighlight;
