export enum DoctorInforPayment {
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    ALL_PAYMENT_METHOD = 'ALL_PAYMENT_METHOD',
}

export enum DoctorInforPosition {
    NONE = 'NONE', // bác sĩ
    MASTER = 'MASTER', // Thạc sĩ
    DOCTOR = 'DOCTOR', // Tiến sĩ
    ASSOCIATE_PROFESSOR = 'ASSOCIATE_PROFESSOR', // phó giáo sư
    PROFESSOR = 'PROFESSOR', // giáo sư
}