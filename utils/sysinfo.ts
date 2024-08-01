import { CurrentRuntime, Runtime } from "@cross/runtime";
import { freemem, loadavg, totalmem, uptime as nodeUptime } from "node:os";

/**
 * Provides information about the memory usage of the current process.
 */
export interface ProcessMemoryInfo {
  /**
   * (Optional) The amount of memory, in bytes, that is not part of the heap and is used by the process for other purposes.
   * This might include memory used for stack, code, or external resources.
   * Not available in all runtimes (e.g., not directly provided in Node.js).
   */
  external?: number;

  /**
   * The total size of the heap, in bytes, that is available to the process. This includes both used and unused heap space.
   */
  heapTotal: number;

  /**
   * The amount of heap memory, in bytes, that is currently being used by the process.
   */
  heapUsed: number;

  /**
   * (Node.js, Bun) Resident Set Size (RSS): The total amount of memory, in bytes, occupied by the process in RAM. This includes both the heap and other memory used by the process.
   * (Deno) The amount of memory, in bytes, used by the process's resident set (portion of memory held in RAM).
   */
  rss: number;
}

/** Based on Deno.SystemMemoryInfo */
export interface SystemMemoryInfo {
  /** Total installed memory in bytes. */
  total: number;
  /** Unused memory in bytes. */
  free: number;
  /** Estimation of how much memory, in bytes, is available for starting new
   * applications, without swapping. Unlike the data provided by the cache or
   * free fields, this field takes into account page cache and also that not
   * all reclaimable memory will be reclaimed due to items being in use.
   */
  available: number;
  /** Memory used by kernel buffers. */
  buffers: number;
  /** Memory used by the page cache and slabs. */
  cached: number;
  /** Total swap memory. */
  swapTotal: number;
  /** Unused swap memory. */
  swapFree: number;
}

/**
 * Provides information about the overall system memory usage.
 */
export function memoryUsage(): ProcessMemoryInfo {
  let memoryUsageResult: ProcessMemoryInfo;
  if (CurrentRuntime === Runtime.Deno) {
    //@ts-ignore cross-runtime
    const { external, heapTotal, heapUsed, rss } = Deno.memoryUsage();
    memoryUsageResult = { external, heapTotal, heapUsed, rss };
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    //@ts-ignore cross-runtime
    const { external = 0, heapTotal, heapUsed, rss } = process.memoryUsage();
    memoryUsageResult = { external, heapTotal, heapUsed, rss };
  } else {
    memoryUsageResult = { external: 0, heapTotal: 0, heapUsed: 0, rss: 0 };
  }
  return memoryUsageResult;
}

/**
 * Retrieves the system load averages.
 *
 * Load averages represent the average system load over a period of time (typically 1, 5, and 15 minutes).
 * They give an indication of how busy the system is and whether it's overloaded.
 *
 * @returns {number[]} An array containing three load average values (1, 5, and 15 minutes), or an empty array if the runtime is unsupported.
 */
export function loadAvg(): number[] {
  let loadAvgResult: number[];
  if (CurrentRuntime === Runtime.Deno) {
    loadAvgResult = Deno.loadavg();
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    // Node.js and Bun provide os module for loadAvg
    loadAvgResult = loadavg();
  } else {
    // Unsupported runtime
    loadAvgResult = [];
  }
  return loadAvgResult;
}

/**
 * Retrieves the system uptime.
 *
 * Uptime is the amount of time, in seconds, that the system has been running since it was last booted.
 *
 * @returns {number} The system uptime in seconds, or -1 if the runtime is unsupported.
 */
export function uptime(): number {
  let uptimeResult: number;
  if (CurrentRuntime === Runtime.Deno) {
    uptimeResult = Deno.osUptime();
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    // Node.js and Bun provide os module for uptime
    uptimeResult = nodeUptime();
  } else {
    uptimeResult = -1;
  }
  return uptimeResult;
}

/**
 * Retrieves information about the system memory usage.
 *
 * Provides details about the total, free, and (in some cases) additional memory statistics.
 *
 * Note: The information returned depends on the current JavaScript runtime:
 *
 *   - **Deno:**  Returns a complete `SystemMemoryInfo` object with all fields populated.
 *   - **Node.js/Bun:** Returns a `SystemMemoryInfo` object with `total` and `free` fields accurately filled. Other fields are estimated or unavailable (-1).
 *   - **Unsupported Runtimes:**  Returns a `SystemMemoryInfo` object with all fields set to -1.
 *
 * @returns {SystemMemoryInfo} An object containing details about system memory usage.
 */
export function systemMemoryInfo(): SystemMemoryInfo {
  let memoryInfoResult: SystemMemoryInfo;
  if (CurrentRuntime === Runtime.Deno) {
    memoryInfoResult = Deno.systemMemoryInfo();
  } else if (
    CurrentRuntime === Runtime.Node || CurrentRuntime === Runtime.Bun
  ) {
    // Node.js and Bun don't have a direct equivalent to Deno.systemMemoryInfo
    // We can try to approximate values using os module (limited information)
    memoryInfoResult = {
      total: totalmem(),
      free: freemem(),
      available: -1, // Not directly available
      buffers: -1, // Not directly available
      cached: -1, // Not directly available
      swapTotal: -1, // Approximate swap total
      swapFree: -1, // Not directly available
    };
  } else {
    // Unsupported runtime
    memoryInfoResult = {
      total: -1,
      free: -1,
      available: -1,
      buffers: -1,
      cached: -1,
      swapTotal: -1,
      swapFree: -1,
    };
  }
  return memoryInfoResult;
}
