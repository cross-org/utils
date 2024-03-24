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
    rest: "",
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
    rest: "",
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
    rest: "",
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
    rest: "",
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
    rest: "",
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
    rest: "",
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
    rest: "",
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

  assertEquals(parser.getArray("v"), ["", ""]);
  assertEquals(parser.get("port"), "8080");
  assertEquals(parser.count("config-file"), 1);
  assertEquals(parser.count("nonexistent"), 0);

  // Add a method to get loose arguments for completeness (optional)
  assertEquals(parser.getLoose(), ["file.txt"]);
});

test("Handle everything after '--' as the rest command", () => {
  const cmdArgs = ["--port", "8080", "--", "run", "server", "--debug"];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      port: ["8080"],
    },
    loose: [],
    rest: "run server --debug",
  });

  const parser = new ArgsParser(cmdArgs);
  assertEquals(parser.getRest(), "run server --debug");
  assertEquals(parser.hasRest(), true);
});

test("Handle multiple '--' delimiters", () => {
  const cmdArgs = ["--flag", "--", "start", "--", "build"];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      flag: [true],
    },
    loose: [],
    rest: "start -- build",
  });

  const parser = new ArgsParser(cmdArgs);
  assertEquals(parser.getRest(), "start -- build");
  assertEquals(parser.hasRest(), true);
});

test("Handle the '--' delimiter at the end", () => {
  const cmdArgs = ["--flag", "--"];
  const parsedArgs = ArgsParser.parseArgs(cmdArgs);

  assertEquals(parsedArgs, {
    args: {
      flag: [true],
    },
    loose: [],
    rest: "",
  });

  const parser = new ArgsParser(cmdArgs);
  assertEquals(parser.getRest(), "");
  assertEquals(parser.hasRest(), false);
});

test("Test Boolean Conversion with true values", () => {
  const parser = new ArgsParser(["--enabled", "Yes", "-t", "1"]);
  assertEquals(parser.getBoolean("enabled"), true);
  assertEquals(parser.getBoolean("t"), true);
});

test("Test Boolean Conversion with false values", () => {
  const parser = new ArgsParser(["--foo", "NO", "-d", "0"]);
  assertEquals(parser.getBoolean("foo"), false);
  assertEquals(parser.getBoolean("d"), false);
});

test("Test Boolean Conversion with case sensitivity", () => {
  const parser = new ArgsParser(["--Debug", "tRuE", "-e", "No"]);
  assertEquals(parser.getBoolean("Debug"), true);
  assertEquals(parser.getBoolean("e"), false);
});

test("Test String with case sensitivity", () => {
  const parser = new ArgsParser(["--Debug", "tRuE", "-E", "No"]);
  assertEquals(parser.get("debug"), undefined);
  assertEquals(parser.get("e"), undefined);
});

test("Handle argument aliases", () => {
  const cmdArgs = ["--db-host", "localhost", "-p", "3306"];
  const options = { aliases: { "db-host": "host", "p": "port" } }; // Define aliases
  const parsedArgs = ArgsParser.parseArgs(cmdArgs, options);

  assertEquals(parsedArgs, {
    args: {
      host: ["localhost"],
      port: ["3306"],
    },
    loose: [],
    rest: "",
  });

  const parser = new ArgsParser(cmdArgs, options);
  assertEquals(parser.get("host"), "localhost");
  assertEquals(parser.get("port"), "3306");
});

test("Aliasing long and short arguments", () => {
  const cmdArgs = ["--file", "config.txt", "-d"];
  const options = { aliases: { "f": "file", "debug": "d" } };
  const parsedArgs = ArgsParser.parseArgs(cmdArgs, options);

  assertEquals(parsedArgs, {
    args: {
      file: ["config.txt"],
      d: [true],
    },
    loose: [],
    rest: "",
  });

  const parser = new ArgsParser(cmdArgs, options);
  assertEquals(parser.get("f"), "config.txt");
  assertEquals(parser.getBoolean("d"), true);
});

test("Aliases don't override original arguments", () => {
  const cmdArgs = ["--file", "config.txt", "-f", "other.txt"];
  const options = { aliases: { "f": "file" } };
  const parsedArgs = ArgsParser.parseArgs(cmdArgs, options);

  assertEquals(parsedArgs, {
    args: {
      file: ["config.txt", "other.txt"],
    },
    loose: [],
    rest: "",
  });

  const parser = new ArgsParser(cmdArgs, options);
  assertEquals(parser.getArray("file").length, 2);
});
