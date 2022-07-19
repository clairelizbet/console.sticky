export var AttachmentErrorReason;
(function (AttachmentErrorReason) {
    AttachmentErrorReason[AttachmentErrorReason["AlreadyExists"] = 0] = "AlreadyExists";
    AttachmentErrorReason[AttachmentErrorReason["BrowserRejected"] = 1] = "BrowserRejected";
    AttachmentErrorReason[AttachmentErrorReason["Other"] = 2] = "Other";
})(AttachmentErrorReason || (AttachmentErrorReason = {}));
class AttachmentError extends Error {
    constructor(message, reason) {
        super(message);
        this.name = 'AttachmentError';
        this.reason = reason;
    }
}
export { AttachmentError };
