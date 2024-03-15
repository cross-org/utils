import { test } from "@cross/test";
import { assertEquals } from "@std/assert";

import { ArgsParser } from "./args.ts";

test("Parse arguments using space as separator", () => {
  const cmdArgs = ["--port", "8080", "-v", "--configFile", "app.config"];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      port: ["8080"],
      v: [true],
      configFile: ["app.config"],
    },
    loose: [],
  });
});

test("Parse arguments using equal sign as separator", () => {
  const cmdArgs = ["--arg=asd"];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      arg: ["asd"],
    },
    loose: [],
  });
});

test("Handle flags with no values", () => {
  const cmdArgs = ["-v", "--debug"];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      v: [true],
      debug: [true],
    },
    loose: [],
  });
});

test("Handle an argument at the end", () => {
  const cmdArgs = ["--port", "8080", "app.config"];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      port: ["8080"],
    },
    loose: ["app.config"],
  });
});

test("Handle empty arguments", () => {
  const cmdArgs = ["--flag", ""];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      flag: [""],
    },
    loose: [],
  });
});

test("Handle arguments with embedded equals signs", () => {
  const cmdArgs = ["--path", "/my/path=with/equals"];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      path: ["/my/path=with/equals"],
    },
    loose: [],
  });
});

test("Handle multiple occurrences of a flag", () => {
  const cmdArgs = ["-v", "-v", "--config", "prod.config"];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      v: [true, true],
      config: ["prod.config"],
    },
    loose: [],
  });
});

test("Test ArgsParser methods", () => {
  const cmdArgs = [
    "-v",
    "-v",
    "--port",
    "8080",
    "--config-file",
    "prod.config",
    "file.txt",
  ];
  const parser = new ArgsParser(cmdArgs);

  assertEquals(parser.getArray("v"), [true, true]);
  assertEquals(parser.get("port"), "8080");
  assertEquals(parser.count("config-file"), 1);
  assertEquals(parser.count("nonexistent"), 0);

  // Add a method to get loose arguments for completeness (optional)
  assertEquals(parser.getLoose(), ["file.txt"]);
});
