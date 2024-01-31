// Test framework
import { jest } from '@jest/globals'

// Main module to test
import {
  printSticky,
  printStyledSticky,
  getAllStickies,
  removeAllStickies,
} from '../index.mjs'
import { StickyPreset } from '../internals/presets.mjs'

// Internals used for test setup and teardown
import {
  attachConsoleListenerPassthrus,
  detachConsoleListenerPassthrus,
} from '../internals/sticky/glue.mjs'

const mockedConsoleLog = jest.fn()

const plainText = 'simple message'
const serializableObject = { aKey: 'aVal' }

function logCallCount() {
  return mockedConsoleLog.mock.calls.length
}

beforeAll(() => {
  jest.useFakeTimers()
  const key = attachConsoleListenerPassthrus()
  expect(typeof key).toBe('symbol')
  globalThis.console[key!] = mockedConsoleLog
})

describe('addConsoleSticky', () => {
  let prevLogCallCount: number
  let stickyCount: number

  beforeEach(() => {
    prevLogCallCount = logCallCount()
    stickyCount = getAllStickies().size
  })

  it('returns undefined and does not log when passed zero args', () => {
    expect(typeof printSticky()).toBe('undefined')
    expect(logCallCount()).toBe(prevLogCallCount)
  })

  it('returns a key symbol and logs when passed plain text', () => {
    expect(typeof printSticky(plainText)).toBe('symbol')
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(plainText)
  })

  it('returns a key symbol and logs serializable objects', () => {
    expect(typeof printSticky(serializableObject)).toBe('symbol')
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(serializableObject)
  })

  it('returns a key symbol and logs with CSS and format specifiers', () => {
    const message = `%c${plainText} %c${plainText}`
    expect(typeof printSticky(message, 'color:blue', 'color:red')).toBe(
      'symbol'
    )
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(
      message,
      'color:blue',
      'color:red'
    )
  })

  it('returns a key symbol and logs with preset styles', () => {
    expect(typeof printStyledSticky(plainText, StickyPreset.Notice)).toBe(
      'symbol'
    )
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(
      `%c${plainText}`,
      'color:white;background-color:blue;padding:20px;font-size:24px;'
    )
  })

  it('returns a key symbol and logs with preset styles and format specifier', () => {
    const message = `%c${plainText}`
    expect(typeof printStyledSticky(message, StickyPreset.Notice)).toBe(
      'symbol'
    )
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(
      message,
      'color:white;background-color:blue;padding:20px;font-size:24px;'
    )
  })

  it('returns a key symbol and logs with custom styles', () => {
    expect(
      typeof printStyledSticky(plainText, {
        color: 'white',
        fontSize: '24px',
        backgroundColor: 'red',
        padding: '20px',
      })
    ).toBe('symbol')
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(
      `%c${plainText}`,
      'color:white;font-size:24px;background-color:red;padding:20px;'
    )
  })

  it('logs after interval duration has been reached', () => {
    jest.advanceTimersToNextTimer()
    expect(logCallCount()).toBe(prevLogCallCount + stickyCount)
  })

  it('logs after call threshold has been reached', () => {
    jest.advanceTimersToNextTimer()
    expect(logCallCount()).toBe(prevLogCallCount + stickyCount)
    console.log()
    expect(logCallCount()).toBe(prevLogCallCount + stickyCount)
    console.log()
    expect(logCallCount()).toBe(prevLogCallCount + 2 * stickyCount)
  })
})

afterAll(() => {
  detachConsoleListenerPassthrus()

  removeAllStickies()
  expect(getAllStickies().size).toBe(0)

  jest.useRealTimers()
})
