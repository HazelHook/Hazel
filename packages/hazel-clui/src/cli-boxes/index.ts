/**
	Style of the box border.
	*/
export interface BoxStyle {
  readonly topLeft: string;
  readonly top: string;
  readonly topRight: string;
  readonly right: string;
  readonly bottomRight: string;
  readonly bottom: string;
  readonly bottomLeft: string;
  readonly left: string;
}

/**
	All box styles.
	*/
export interface Boxes {
  /**
		@example
		```
		┌────┐
		│    │
		└────┘
		```
		*/
  readonly single: BoxStyle;

  /**
		@example
		```
		╔════╗
		║    ║
		╚════╝
		```
		*/
  readonly double: BoxStyle;

  /**
		@example
		```
		╭────╮
		│    │
		╰────╯
		```
		*/
  readonly round: BoxStyle;

  /**
		@example
		```
		┏━━━━┓
		┃    ┃
		┗━━━━┛
		```
		*/
  readonly bold: BoxStyle;

  /**
		@example
		```
		╓────╖
		║    ║
		╙────╜
		```
		*/
  readonly singleDouble: BoxStyle;

  /**
		@example
		```
		╒════╕
		│    │
		╘════╛
		```
		*/
  readonly doubleSingle: BoxStyle;

  /**
		@example
		```
		+----+
		|    |
		+----+
		```
		*/
  readonly classic: BoxStyle;

  /**
		@example
		```
		↘↓↓↓↓↙
		→    ←
		↗↑↑↑↑↖
		```
		*/
  readonly arrow: BoxStyle;
}

/**
Boxes for use in the terminal.

@example
```
import cliBoxes = require('cli-boxes');

console.log(cliBoxes.single);
// {
// 	topLeft: '┌',
// 	top: '─',
// 	topRight: '┐',
// 	right: '│',
// 	bottomRight: '┘',
// 	bottom: '─',
// 	bottomLeft: '└',
// 	left: '│'
// }
```
*/
export const cliBoxes: Boxes = {
  single: {
    topLeft: "┌",
    top: "─",
    topRight: "┐",
    right: "│",
    bottomRight: "┘",
    bottom: "─",
    bottomLeft: "└",
    left: "│",
  },
  double: {
    topLeft: "╔",
    top: "═",
    topRight: "╗",
    right: "║",
    bottomRight: "╝",
    bottom: "═",
    bottomLeft: "╚",
    left: "║",
  },
  round: {
    topLeft: "╭",
    top: "─",
    topRight: "╮",
    right: "│",
    bottomRight: "╯",
    bottom: "─",
    bottomLeft: "╰",
    left: "│",
  },
  bold: {
    topLeft: "┏",
    top: "━",
    topRight: "┓",
    right: "┃",
    bottomRight: "┛",
    bottom: "━",
    bottomLeft: "┗",
    left: "┃",
  },
  singleDouble: {
    topLeft: "╓",
    top: "─",
    topRight: "╖",
    right: "║",
    bottomRight: "╜",
    bottom: "─",
    bottomLeft: "╙",
    left: "║",
  },
  doubleSingle: {
    topLeft: "╒",
    top: "═",
    topRight: "╕",
    right: "│",
    bottomRight: "╛",
    bottom: "═",
    bottomLeft: "╘",
    left: "│",
  },
  classic: {
    topLeft: "+",
    top: "-",
    topRight: "+",
    right: "|",
    bottomRight: "+",
    bottom: "-",
    bottomLeft: "+",
    left: "|",
  },
  arrow: {
    topLeft: "↘",
    top: "↓",
    topRight: "↙",
    right: "←",
    bottomRight: "↖",
    bottom: "↑",
    bottomLeft: "↗",
    left: "→",
  },
};
