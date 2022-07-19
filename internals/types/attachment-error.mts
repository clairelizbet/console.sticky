export enum AttachmentErrorReason {
  AlreadyExists,
  BrowserRejected,
  Other,
}

class AttachmentError extends Error {
  reason: AttachmentErrorReason

  constructor(message: string, reason: AttachmentErrorReason) {
    super(message)
    this.name = 'AttachmentError'
    this.reason = reason
  }
}

export { AttachmentError }
