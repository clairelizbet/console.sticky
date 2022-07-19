export class BasePreset {
    constructor(styles) {
        this.styles = styles;
    }
}
class ImportantMessagePreset extends BasePreset {
    constructor(styles) {
        super({ ...styles, padding: '20px', fontSize: '24px' });
    }
}
class ImportantNoticePreset extends ImportantMessagePreset {
    constructor() {
        super({
            color: 'white',
            backgroundColor: 'blue',
        });
    }
}
class ImportantWarningPreset extends ImportantMessagePreset {
    constructor() {
        super({
            color: 'white',
            backgroundColor: 'orange',
        });
    }
}
export const StickyPreset = Object.freeze({
    ImportantNotice: new ImportantNoticePreset(),
    ImportantWarning: new ImportantWarningPreset(),
});
