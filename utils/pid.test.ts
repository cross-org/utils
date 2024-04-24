import { test } from "@cross/test";
import { assertTrue } from "@std/assert";

import { pid } from "./pid.ts";

test("Aliases don't override original arguments", () => {
  assertTrue(pid() > 0);
});
