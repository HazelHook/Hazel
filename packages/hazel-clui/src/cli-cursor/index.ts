import process from "node:process";
import { Writable } from "node:stream";
import signalExit from "signal-exit";

let isHidden = false;
let firstHide = true;

const cliCursor = {
    hide: (writableStream?: StreamType) => {},
    show: (writableStream?: StreamType) => {},
    toggle: (force?: boolean, writableStream?: StreamType) => {},
};

type StreamType = typeof process.stderr;

cliCursor.show = (writableStream = process.stderr) => {
  if (!writableStream.isTTY) {
    return;
  }

  isHidden = false;
  writableStream.write("\u001B[?25h");
};

cliCursor.hide = (writableStream = process.stderr) => {
  if (!writableStream.isTTY) {
    return;
  }

  if (firstHide) {
    signalExit.onExit(() => {
      process.stderr.write("\u001B[?25h");
    });
    firstHide = false;
  }
  isHidden = true;
  writableStream.write("\u001B[?25l");
};

cliCursor.toggle = (force?: boolean, writableStream?: StreamType) => {
  if (force !== undefined) {
    isHidden = force;
  }

  if (isHidden) {
    cliCursor.show(writableStream);
  } else {
    cliCursor.hide(writableStream);
  }
};

export default cliCursor;
