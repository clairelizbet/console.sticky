import { logSticky } from './internals/sticky/logger.mjs'
import {
  getStickyPrinters,
  removeStickyPrinter,
} from './internals/sticky/glue.mjs'
import { BasePreset } from './internals/presets.mjs'
import { Styles } from './internals/types/styles.mjs'

/**
 * Immediately logs a message to the console and continues to log the message at a
 * regular interval and after reaching a threshold of accumulated console messages
 *
 * @param message String to log
 * @param styles An object full of camelCased CSS rules
 */
export function printStyledSticky<Preset extends BasePreset>(
  message: string,
  styles: Styles
): symbol | undefined

/**
 * Immediately logs a message to the console and continues to log the message at a
 * regular interval and after reaching a threshold of accumulated console messages
 *
 * @param message String to log
 * @param preset Style preset to use for styling output
 */
export function printStyledSticky<Preset extends BasePreset>(
  message: string,
  preset: Preset
): symbol | undefined

export function printStyledSticky<Preset extends BasePreset>(
  message: string,
  presetOrStyles: Preset | Styles
): symbol | undefined {
  if (!message.includes('%c')) message = `%c${message}`
  return logSticky(
    message,
    presetOrStyles instanceof BasePreset
      ? presetOrStyles.styles
      : presetOrStyles
  )
}

export function removeAllStickies() {
  return [...getStickyPrinters()]
    .map(([printerKey]) => removeStickyPrinter(printerKey))
    .every((successful) => successful)
}

export { removeStickyPrinter as removeSticky }
export { getStickyPrinters as getAllStickies }
export { logSticky as printSticky }
export { StickyPreset } from './internals/presets.mjs'
