# 📌 console.sticky

Automatically and repeatedly log important console messages like self-XSS warnings.

The logger uses a timer and listens for console log calls. Once the time or call threshold is reached, the sticky messages are logged.

## ℹ Usage

In this basic example, we call `addConsoleSticky` to create a sticky

```js
import { addConsoleSticky } from 'console.sticky'

// addConsoleSticky can be called in the same manner as console.log
addConsoleSticky('Important message!')

// Including full support for message styling
addConsoleSticky('%cImportant %cmessage!', 'color:red', 'color:blue')
```

Stickies can be styled using Presets

```js
import { addStyledConsoleSticky, StickyPreset } from 'console.sticky'

/* StickyPreset has two options available:
 * ImportantNotice
 * ImportantWarning
 */
addStyledConsoleSticky('Important message!', StickyPreset.ImportantNotice)
```

The `addConsoleSticky` function can be attached globally as `console.sticky`

```js
import {
  addConsoleSticky,
  attachConsoleSticky,
  attachConsoleStickySync,
  AttachmentError,
  AttachmentErrorReason,
} from 'console.sticky'

// You can optionally attach it to the global scope as console.sticky
attachConsoleSticky()
  .then(() => {
    console.sticky('Important message!')
  })
  .catch((e) => {
    // Try again, this time overriding any existing console.sticky
    if (
      e instanceof AttachmentError &&
      e.reason === AttachmentErrorReason.AlreadyExists
    )
      return attachConsoleSticky(true)
  })
  .catch((e) => {
    /* Couldn't attach to global scope, even with override */
  })

// This can also be done synchronously
const attached = attachConsoleStickySync()

if (attached) {
  console.sticky('Important message!')
} else {
  /* Failed to attach */
}
```

You can also remove stickies later if you no longer need them

```js
import { getAllConsoleStickies } from 'console.sticky'

// Creating a sticky returns a Symbol key that can be used to manage it
const key = addConsoleSticky('Important message!')

// You remove a sticky later
removeConsoleSticky(key)

// Or, you can remove them all with a single call
removeAllConsoleStickies()

// Returns a Map<Symbol, Function> of all active stickies
getAllConsoleStickies()
```

## 📄 License

This project has zero dependencies and is permissively licensed.

[![MIT License](https://raw.githubusercontent.com/clairelizbet/licenses/main/mit/mit.svg)](license.md)
