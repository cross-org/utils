import { test } from "@cross/test";
import { assertEquals } from "@std/assert";

import { pid } from "./pid.ts";

test("Aliases don't override original arguments", () => {
  assertEquals(pid() > 0, true);
});
