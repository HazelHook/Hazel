import React from "react";

import { Box, Text, useInput } from "../ext/ink";

export function Button({
  selected,
  name,
  onClick,
}: {
  selected?: boolean;
  name: string;
  onClick?: () => void;
}) {
  useInput((input, key) => {
    if (selected && (key.return || input === " ")) {
      onClick?.();
    }
  });

  return (
    <Box
      borderColor="#CC671B"
      borderDimColor={!selected}
      borderStyle="round"
      display="flex"
      flexDirection="column"
    >
      <Text bold color="#CC671B" dimColor={!selected}>
        {name}
      </Text>
    </Box>
  );
}
