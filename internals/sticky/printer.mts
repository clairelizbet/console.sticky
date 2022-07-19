import { addStickyPrinter, attachConsoleListenerPassthrus } from './glue.mjs'

let consolePassthruKey: symbol

function print(...args: unknown[]): void {
  const logger = globalThis.console[consolePassthruKey]

  if (typeof logger !== 'function') return
  return logger(...args)
}

export function printSticky(...args: unknown[]): symbol | undefined {
  // Convert non-circular objects to JSON strings
  const convertedArgs: unknown[] = args.map((arg) => {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg)
      } catch (e) {}
    }

    return arg
  })

  if (!consolePassthruKey) {
    const key = attachConsoleListenerPassthrus()
    if (!key) return
    consolePassthruKey = key
  }

  print(...convertedArgs)
  return addStickyPrinter(() => print(...convertedArgs))
}
