import {
  attachFnToConsole,
  attachFnToConsoleSync,
} from './internals/util/console.mjs'
import { logSticky } from './internals/sticky/logger.mjs'
import {
  getStickyPrinters,
  removeStickyPrinter,
} from './internals/sticky/glue.mjs'
import { BasePreset } from './presets.mjs'
import { Styles } from './internals/types/styles.mjs'

const stickyPrinterKeys: symbol[] = []

interface Options {
  override?: boolean
}

export function attachConsoleSticky(override?: boolean): Promise<boolean>
export function attachConsoleSticky(options: Options): Promise<boolean>
export function attachConsoleSticky(
  options: boolean | Options = false
): Promise<boolean> {
  const override = typeof options === 'boolean' ? options : options.override
  return attachFnToConsole(logSticky, 'sticky', override)
}

export function attachConsoleStickySync(override?: boolean): boolean
export function attachConsoleStickySync(options: Options): boolean
export function attachConsoleStickySync(
  options: boolean | Options = false
): boolean {
  const override = typeof options === 'boolean' ? options : options.override
  return attachFnToConsoleSync(logSticky, 'sticky', override)
}

export function detachConsoleSticky(): boolean {
  if (typeof globalThis.console.sticky !== typeof logSticky) return false

  globalThis.console.sticky = undefined
  return true
}

/**
 * Immediately logs a message to the console and continues to log the message at a
 * regular interval and after reaching a threshold of accumulated console messages
 *
 * @param message String to log
 * @param styles Each remaining arg is an object full of camelCased CSS rules
 */
export function addStyledConsoleSticky(
  message: string,
  ...styles: Styles[]
): void

/**
 * Immediately logs a message to the console and continues to log the message at a
 * regular interval and after reaching a threshold of accumulated console messages
 *
 * @param message String to log
 * @param preset Style preset to use for styling output
 */
export function addStyledConsoleSticky<Preset extends BasePreset>(
  message: string,
  preset: Preset
): void

/**
 * Immediately logs a message to the console and continues to log the message at a
 * regular interval and after reaching a threshold of accumulated console messages
 *
 * @param message String to log
 * @param presets Style presets to use for styling output
 */
export function addStyledConsoleSticky<Preset extends BasePreset>(
  message: string,
  ...presets: Preset[]
): void

export function addStyledConsoleSticky<Preset extends BasePreset>(
  message: string,
  ...rest: Preset[] | Styles[]
): symbol | undefined {
  if (!message.includes('%c')) message = `${'%c'}${message}`

  if ((rest as Preset[]).every((arg: Preset) => arg instanceof BasePreset)) {
    const stickyKey = logSticky(
      message,
      ...(rest as Preset[]).map((preset) => preset.styles)
    )
    if (stickyKey) stickyPrinterKeys.push(stickyKey)
    return stickyKey
  }

  const stickyKey = logSticky(message, ...rest)
  if (stickyKey) stickyPrinterKeys.push(stickyKey)
  return stickyKey
}

export function removeConsoleSticky(key: symbol) {
  return removeStickyPrinter(key)
}

export function getAllConsoleStickies() {
  return getStickyPrinters()
}

export function removeAllConsoleStickies() {
  return stickyPrinterKeys
    .map((key) => removeStickyPrinter(key))
    .every((successful) => successful)
}

export { logSticky as addConsoleSticky }
export {
  AttachmentError,
  AttachmentErrorReason,
} from './internals/types/attachment-error.mjs'
export { StickyPreset } from './presets.mjs'
