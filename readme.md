# 📌 console.sticky

Automatically and repeatedly log important console messages like self-XSS
warnings.

Of course, this isn't true "sticky" messages, but it's about the closest
approximation available.

## Usage

```sh
npm install console.sticky
```

### Example

```js
import { printStyledSticky, removeSticky } from 'console.sticky'

// Print a sticky message and store its key
const messageKey = printStyledSticky('Important message!', StickyPreset.Notice)

// You can use the key to clean up when the sticky is no longer needed
removeSticky(messageKey)
```

## API

### printSticky

Immediately logs a message to the console and continues to log the message at a
regular interval and after reaching a threshold of accumulated console messages.

Supports being called in the same way as the standard `console.log` function,
including formatting specifiers (e.g. `%c`).

**Returns** `symbol | undefined`

If the call is successful, a `symbol` key is returned that can be used to later
remove the sticky with `removeSticky(key)`.

Otherwise, `undefined` is returned.

```js
import { printSticky } from 'console.sticky'

// Basic usage
let messageKey = printSticky('Important message!')

// Prints "Important" in red and "message" in blue
messageKey = printSticky('%cImportant %cmessage!', 'color:red', 'color:blue')
```

### printStyledSticky

Same as `printSticky`, but using style objects or built-in style presets.

```js
import { printStyledSticky, StickyPreset } from 'console.sticky'

// Use a camelCased object of CSS rules to style the entire message
printStyledSticky('Important Message!', {
  color: 'white',
  backgroundColor: 'purple',
})

// Generic orange "warning" style
printStyledSticky('Message!', StickyPreset.Warning)

// Generic blue "notice" style
printStyledSticky('Message!', StickyPreset.Notice)
```

### removeSticky

Removes a sticky.

Accepts a `symbol | undefined` key parameter obtained from calling `printSticky`
or `printStyledSticky`.

**Returns** `true` if sticky exists and was able to be removed, otherwise false.

### getAllStickies

**Returns** `Map<Symbol, Function>` of all active stickies

### removeAllStickies

Removes all stickies.

**Returns** `true` if all stickies were able to be removed, otherwise false.

## License

This project has zero dependencies and is licensed under the
[Apache 2.0 License](license.md).
