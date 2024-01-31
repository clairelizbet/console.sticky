import { Styles } from '../types/styles.mjs'
import { formatSticky } from './formatter.mjs'
import { printSticky } from './printer.mjs'

/**
 * This implementation is built on top of log(), so we rely on
 * its implementation to support the styling of messages, but
 * we try to follow the spec for loggers
 *
 * @link https://console.spec.whatwg.org/#logger
 */

/**
 * Immediately logs a message to the console and continues to log the message at a
 * regular interval and after reaching a threshold of accumulated console messages
 *
 * @param message String containing one or more format specifiers (e.g. "%c")
 * @param styles Each remaining arg is interpreted as CSS style strings (e.g. "color: white; background: purple;")
 *
 * @returns Key of the sticky printer, which can be used to remove it later
 */
export function logSticky(
  message: string,
  ...styles: string[]
): symbol | undefined

/**
 * Immediately logs a message to the console and continues to log the message at a
 * regular interval and after reaching a threshold of accumulated console messages
 *
 * @param message String containing one or more format specifiers (e.g. "%c")
 * @param styles Each remaining arg is an object full of camelCased CSS rules
 *
 * @returns Key of the sticky printer, which can be used to remove it later
 */
export function logSticky(
  message: string,
  ...styles: Styles[]
): symbol | undefined

/**
 * Immediately logs a message to the console and continues to log the message at a
 * regular interval and after reaching a threshold of accumulated console messages
 *
 * @param messages Strings that will be logged
 *
 * @returns Key of the sticky printer, which can be used to remove it later
 */
export function logSticky(...messages: string[]): symbol | undefined

/**
 * Immediately logs a message to the console and continues to log the message at a
 * regular interval and after reaching a threshold of accumulated console messages
 *
 * @param objects Objects that will be logged
 *
 * @returns Key of the sticky printer, which can be used to remove it later
 */
export function logSticky(...objects: unknown[]): symbol | undefined

export function logSticky(...args: unknown[]): symbol | undefined {
  // Nothing to do
  if (args.length === 0) return

  // Split args into first and everything else
  const [first, ...rest] = args

  // If we only have one arg, just print
  if (rest.length === 0) return printSticky(first)

  // If the first arg is a string containing format specifiers, we need to format it
  if (
    typeof first === 'string' &&
    first.includes('%c') &&
    rest.every((arg) => typeof arg === 'object')
  ) {
    return printSticky(...formatSticky(first, ...(rest as Styles[])))
  } else {
    return printSticky(...args)
  }
}
