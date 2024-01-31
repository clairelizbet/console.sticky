import { Styles } from './types/styles.mjs'

export class BasePreset {
  styles: Styles

  constructor(styles: Styles) {
    this.styles = styles
  }
}

class MessagePreset extends BasePreset {
  constructor(styles: Styles) {
    super({ ...styles, padding: '20px', fontSize: '24px' })
  }
}

class NoticePreset extends MessagePreset {
  constructor() {
    super({
      color: 'white',
      backgroundColor: 'blue',
    })
  }
}

class WarningPreset extends MessagePreset {
  constructor() {
    super({
      color: 'white',
      backgroundColor: 'orange',
    })
  }
}

export const StickyPreset = Object.freeze({
  Notice: new NoticePreset(),
  Warning: new WarningPreset(),
})
