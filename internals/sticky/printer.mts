import { addStickyPrinter, attachConsoleListenerPassthrus } from './glue.mjs'

let consolePassthruKey: symbol

function print(...args: unknown[]): void {
  const logger = globalThis.console[consolePassthruKey]

  if (typeof logger !== 'function') return
  return logger(...args)
}

export function printSticky(...args: unknown[]): symbol | undefined {
  if (!consolePassthruKey) {
    const key = attachConsoleListenerPassthrus()
    if (!key) return
    consolePassthruKey = key
  }

  print(...args)
  return addStickyPrinter(() => print(...args))
}
