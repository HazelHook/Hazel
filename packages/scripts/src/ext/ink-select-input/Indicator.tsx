import React from "react";
import figures from "figures";

import { Box, Text } from "../ink";

export type Props = {
  isSelected?: boolean;
};

function Indicator({ isSelected = false }: Props) {
  return (
    <Box marginRight={1}>
      {isSelected ? (
        <Text color="blue">{figures.pointer}</Text>
      ) : (
        <Text> </Text>
      )}
    </Box>
  );
}

export default Indicator;
