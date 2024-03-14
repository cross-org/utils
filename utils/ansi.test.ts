import { test } from "@cross/test";
import { assertEquals } from "@std/assert";

import { stripAnsi } from "./ansi.ts";

test("Strip ansi characters", () => {
  const text =
    "\x1b[31mThis is colored\x1b[0m and \x1b[2J\x1b[1;20Hsome more text";
  const strippedText = stripAnsi(text);
  assertEquals(strippedText, "This is colored and some more text");
});
