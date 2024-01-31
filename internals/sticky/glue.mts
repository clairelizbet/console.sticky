import { ZeroArgFunction } from '../types/zero-arg-fn.mjs'
import {
  Logger,
  makeConsolePassthru,
  removeConsolePassthrus,
} from '../util/console.mjs'

const DEFAULT_MAX_ACCUMULATED_CALLS = 2
let maxAccumulatedCalls = DEFAULT_MAX_ACCUMULATED_CALLS

const DEFAULT_INTERVAL_DURATION = 10
let intervalDuration = DEFAULT_INTERVAL_DURATION

let accumulatedCalls = 0
let listenersAttached = false
let interval: NodeJS.Timeout | string | number

const passthrus: Map<symbol, string> = new Map()
const stickyPrinters: Map<symbol, ZeroArgFunction> = new Map()

function runPrinters() {
  stickyPrinters.forEach((printStickyNotice) => printStickyNotice())
  accumulatedCalls = 0
}

function onConsoleLoggerCalled() {
  if (++accumulatedCalls > maxAccumulatedCalls) {
    runPrinters()
  }
}

export function getKeyForLogger(logger: Logger): symbol | undefined {
  let loggerKey: symbol | undefined

  for (const [key, loggerName] of passthrus) {
    if (logger === loggerName) {
      loggerKey = key
    }
  }

  return loggerKey
}

/**
 * Begins intercepting console logging calls and sets up the intervals
 *
 * @returns The key used to store the original log() function
 */
export function attachConsoleListenerPassthrus(): symbol | undefined {
  if (listenersAttached) return getKeyForLogger(Logger.Log)

  let logKey: symbol | undefined

  for (const logger in console) {
    const key = makeConsolePassthru(logger, onConsoleLoggerCalled)
    if (Logger.Log === logger) logKey = key
    passthrus.set(key, logger)
  }

  // We add an interval as well in case of console entries produced by native code
  interval = setInterval(runPrinters, intervalDuration * 1000)
  listenersAttached = true
  return logKey
}

export function detachConsoleListenerPassthrus(): boolean {
  clearInterval(interval)
  return removeConsolePassthrus([...passthrus.keys()])
}

export function addStickyPrinter(fn: ZeroArgFunction): symbol {
  const key = Symbol()
  stickyPrinters.set(key, fn)
  return key
}

export function getStickyPrinters(): Map<symbol, ZeroArgFunction> {
  return stickyPrinters
}

export function removeStickyPrinter(key: symbol | undefined): boolean {
  if (!key) return false

  const removalSucceeded = stickyPrinters.delete(key)

  // Clear the interval as a side effect to clean up when there are no printers
  if (stickyPrinters.size === 0) clearInterval(interval)

  return removalSucceeded
}
