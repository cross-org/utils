import { test } from "@cross/test";
import { assertEquals } from "@std/assert";

import { Colors, Cursor, stripAnsi } from "./ansi.ts";

test("Strip ansi characters", () => {
  const text =
    "\x1b[31mThis is colored\x1b[0m and \x1b[2J\x1b[1;20Hsome more text";
  const strippedText = stripAnsi(text);
  assertEquals(strippedText, "This is colored and some more text");
});

test("Apply bold formatting", () => {
  assertEquals(Colors.bold("hello"), "\x1b[1mhello\x1b[0m");
});

test("Set foreground color (RGB)", () => {
  assertEquals(
    Colors.rgb(255, 128, 0, "orange"),
    "\x1b[38;2;255;128;0morange\x1b[0m",
  );
});

test("Set background color (green)", () => {
  assertEquals(Colors.bgGreen("grass"), "\x1b[42mgrass\x1b[0m");
});

test("Move cursor up", () => {
  assertEquals(Cursor.up(3), "\x1b[3A");
});
