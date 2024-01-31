/**
 * Stores a mapping of loggers and their interceptors
 */
const passthrus: Map<symbol, string> = new Map()

/**
 * Global Console declaration override
 */
declare global {
  interface Console {
    // Allow new properties to be set on console
    [property: string | number | symbol]: unknown
  }
}

/**
 * Global Console logging functions
 */
export enum Logger {
  Assert = 'assert',
  Clear = 'clear',
  Count = 'count',
  CountReset = 'countReset',
  Debug = 'debug',
  Dir = 'dir',
  Dirxml = 'dirxml',
  Error = 'error',
  Group = 'group',
  GroupCollapsed = 'groupCollapsed',
  GroupEnd = 'groupEnd',
  Info = 'info',
  Log = 'log',
  Table = 'table',
  Time = 'time',
  TimeEnd = 'timeEnd',
  TimeLog = 'timeLog',
  TimeStamp = 'timeStamp',
  Trace = 'trace',
  Warn = 'warn',
}

/**
 * Check if the given logger exists on the global console
 *
 * @param logger
 * @returns {boolean}
 */
export function consoleLoggerExists(logger: Logger): boolean {
  if (typeof globalThis.console !== 'object') return false
  return typeof globalThis.console[logger] === 'function'
}

/**
 * Constraints for evaluating function names. Each property defaults to false (disallow)
 *
 * @property {boolean} allowAnonymous Allow anonymous functions with the name "anonymous" that usually created using Function()
 */
type FunctionNameConstraints = {
  allowAnonymous?: boolean
}

/**
 * Attempts to produce or validate a name for the given function.
 * If passing an anonymous function, a name needs to be explicitly provided.
 *
 * @param fn The "name" property of this function will be read and validated
 * @param name When passed, the "name" property of the function is ignored in favor of this name. Must not be empty
 * @param constraints FunctionNameConstraints options object (e.g. { allowAnonymous: boolean })
 *
 * @throws {Error} Throws if the function's default name (or proposed name, if provided) is not usable
 * @returns {string} The validated function name
 */
function tryGetNameForFn(
  fn: Function,
  name?: string,
  constraints?: FunctionNameConstraints
): string {
  if (typeof name === 'string') {
    // A proposed name was provided, we should ignore the function's default name

    // If the proposed name is empty, we can't use it
    if (!name) throw new Error('If a name is provided, it must not be empty')

    return name
  } else {
    // We must read the name from the function itself as one was not explicitly provided

    // If the function name is empty, we can't use it
    if (!fn.name)
      throw new Error('Name is required for anonymous functions with no name')

    // If the function was created using Function() and the allowAnonymous flag is not set, we must throw
    if (fn.name === 'anonymous' && !constraints?.allowAnonymous)
      throw new Error('Name is required for anonymous functions')

    return fn.name
  }
}

export function consoleHasProperty(name: string | number | symbol): boolean {
  return name in globalThis.console
}

/**
 * Replaces the given logger on the global console with a new one that will
 * intercept the call or property read, pass the arguments to the provided onLog
 * handler, before passing along the return value from the original logger
 *
 * @param logger Name of the logger to intercept
 * @param onLog Function that will be passed the args that the logger is called with
 *
 * @returns {symbol} Key of the console property being used to store the original logger
 */
export function makeConsolePassthru(
  logger: string,
  onLog: (...args: unknown[]) => unknown
): symbol {
  const key = Symbol()
  const destination = globalThis.console[logger]

  globalThis.console[key] = destination
  passthrus.set(key, logger)

  if (typeof destination === 'function') {
    globalThis.console[logger] = (...args: unknown[]) => {
      onLog(...args)
      return destination(...args)
    }
  } else {
    const dynamic = {
      get passthruProp() {
        onLog()
        return globalThis.console[key]
      },
    }

    globalThis.console[logger] = dynamic.passthruProp
  }

  return key
}

/**
 * Replaces the intercepting function for the given logger with the original
 *
 * @param key Key of the console property being used to store the original logger
 *
 * @returns {boolean} Whether the removal was successful
 */
export function removeConsolePassthru(key: symbol): boolean {
  const original = passthrus.get(key)
  passthrus.delete(key)

  if (!(original && consoleHasProperty(key))) return false

  globalThis.console[original] = globalThis.console[key]
  globalThis.console[key] = undefined
  return true
}

/**
 * Replaces all intercepted loggers (or just the specified ones if provided) with the originals
 *
 * @param keys Keys of the console properties being used to store the original loggers
 *
 * @returns {boolean} Whether all removals were successful
 */
export function removeConsolePassthrus(keys?: symbol[]): boolean {
  const detachOperations: boolean[] = []
  const passthruKeys = keys ?? [...passthrus.keys()]

  passthruKeys.forEach((key) =>
    detachOperations.push(removeConsolePassthru(key))
  )

  return detachOperations.every((successful) => successful)
}
