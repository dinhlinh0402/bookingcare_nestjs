export enum BookingStatus {
    WAITING = 'WAITING',
    CONFIRMED = 'CONFIRMED',
    DONE = 'DONE',
    CANCEL = 'CANCEL',
    EXPIRED = 'EXPIRED',
    NOT_COME = 'NOT_COME', // không đến
    UNABLE_CONTACT = 'UNABLE_CONTACT', // không liên lạc được

}

export enum BookingType {
    FOR_MYSELF = 'FOR_MYSELF',
    FOR_RELATIVES = 'FOR_RELATIVES',
}