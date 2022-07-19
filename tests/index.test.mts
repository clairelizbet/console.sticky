// Test framework
import { jest } from '@jest/globals'

// Main module to test
import {
  addConsoleSticky,
  addStyledConsoleSticky,
  getAllConsoleStickies,
  removeAllConsoleStickies,
} from '../index.mjs'
import { StickyPreset } from '../presets.mjs'

// Internals used for test setup and teardown
import {
  attachConsoleListenerPassthrus,
  detachConsoleListenerPassthrus,
} from '../internals/sticky/glue.mjs'

const mockedConsoleLog = jest.fn()

const plainText = 'simple message'
const serializableObject = { aKey: 'aVal' }
const makeCircularObject = () => {
  const targetObject = { circularRef: {} }
  const referencingObject = { circularRef: targetObject }
  targetObject.circularRef = referencingObject
  return referencingObject
}

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
    stickyCount = getAllConsoleStickies().size
  })

  it('returns undefined and does not log when passed zero args', () => {
    expect(typeof addConsoleSticky()).toBe('undefined')
    expect(logCallCount()).toBe(prevLogCallCount)
  })

  it('returns a key symbol and logs when passed plain text', () => {
    expect(typeof addConsoleSticky(plainText)).toBe('symbol')
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(plainText)
  })

  it('returns a key symbol and logs serializable objects as strings', () => {
    expect(typeof addConsoleSticky(serializableObject)).toBe('symbol')
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(
      JSON.stringify(serializableObject)
    )
  })

  it('returns a key symbol and logs without throwing when passed a circular object', () => {
    const circularObject = makeCircularObject()
    expect(typeof addConsoleSticky(circularObject)).toBe('symbol')
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(circularObject)
  })

  it('returns a key symbol and logs with preset styles', () => {
    expect(
      typeof addStyledConsoleSticky(plainText, StickyPreset.ImportantNotice)
    ).toBe('symbol')
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(
      `%c${plainText}`,
      'color:white;background-color:blue;padding:20px;font-size:24px;'
    )
  })

  it('returns a key symbol and logs with preset styles and format specifier', () => {
    const message = `%c${plainText}`
    expect(
      typeof addStyledConsoleSticky(message, StickyPreset.ImportantNotice)
    ).toBe('symbol')
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(
      message,
      'color:white;background-color:blue;padding:20px;font-size:24px;'
    )
  })

  it('returns a key symbol and logs with multiple presets', () => {
    const message = `%c${plainText} %c${plainText}`
    expect(
      typeof addStyledConsoleSticky(
        message,
        StickyPreset.ImportantNotice,
        StickyPreset.ImportantWarning
      )
    ).toBe('symbol')
    expect(logCallCount()).toBe(prevLogCallCount + 1)
    expect(mockedConsoleLog).toHaveBeenLastCalledWith(
      message,
      'color:white;background-color:blue;padding:20px;font-size:24px;',
      'color:white;background-color:orange;padding:20px;font-size:24px;'
    )
  })

  it('returns a key symbol and logs with custom styles', () => {
    expect(
      typeof addStyledConsoleSticky(plainText, {
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
  removeAllConsoleStickies()
  jest.useRealTimers()
})
