export interface ICurrentUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

export interface ILoginResponse {
    message: string;
    fullName: string;
    role: string;
}

export interface IRegisterResponse {
    message: string;
}

export interface IMessageResponse {
    message: string;
}

export interface ICourse {
    id: number;
    title: string;
    description: string;
    instructorName: string;
    videoCount: number;
    classroomNumber: number;
    status: string;
    floorId: number | null;
}

export interface ICreateCourse {
    title: string;
    description: string;
    floorId: number;
    classroomNumber: number;
}

export interface IVideo {
    id: number;
    title: string;
    order: number;
}

export interface IFloor {
    id: number;
    number: number;
    name: string;
    description: string;
    classroomCount: number;
}

export interface IFloorClassroom {
    id: number;
    title: string;
    description: string;
    classroomNumber: number;
    status: string;
    instructorName: string;
    videoCount: number;
}

export interface IFloorWithClassrooms {
    id: number;
    number: number;
    name: string;
    description: string;
    classrooms: IFloorClassroom[];
}

export interface ILiveSession {
    id: number;
    title: string;
    status: string;
    startedAt: string | null;
}

export interface ILiveSessionDetail {
    id: number;
    title: string;
    courseId: number;
    instructorId: string;
    status: string;
    startedAt: string;
    endedAt: string | null;
}

export interface ICreateLiveSession {
    courseId: number;
    title: string;
}

export interface ICheckoutRequest {
    purpose: number;
    courseId: number | null;
    studyFileId: number | null;
}

export interface ICheckoutResponse {
    paymentId: number;
    amount: number;
    currency: string;
    description: string;
}

export interface IConfirmResponse {
    message: string;
    paymentId: number;
    status: string;
    transactionId: string;
    completedAt: string;
}

export interface IPayment {
    id: number;
    description: string;
    amount: number;
    currency: string;
    status: number;
    purpose: number;
    teacherName: string | null;
    courseTitle: string | null;
    studyFileName: string | null;
    createdAt: string;
    completedAt: string | null;
}

export interface IPaymentDetail {
    id: number;
    description: string;
    amount: number;
    currency: string;
    status: number;
    purpose: number;
    teacherId: string | null;
    teacherName: string | null;
    courseId: number | null;
    studyFileId: number | null;
}

export interface ICreateReview {
    targetType: number;
    targetId: number;
    rating: number;
    comment: string;
}

export interface IReview {
    id: number;
    authorName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

export interface IRatingSummary {
    averageRating: number;
    totalReviews: number;
}

export interface ICreateStudyFile {
    title: string;
    description: string;
    price: number;
    isFree: boolean;
    courseId: number;
}

export interface IStudyFile {
    id: number;
    title: string;
    description: string;
    originalFileName: string;
    contentType: string;
    fileSizeBytes: number;
    price: number;
    isFree: boolean;
    courseId: number;
    courseTitle: string;
    teacherName: string;
    createdAt: string;
}

export interface IMonthlyEarning {
    month: string;
    amount: number;
    salesCount: number;
}

export interface ITeacherStatistics {
    totalEarnings: number;
    totalStudents: number;
    totalCourses: number;
    averageRating: number;
    totalReviews: number;
    topCourseTitle: string | null;
    topCourseSales: number;
    monthlyEarnings: IMonthlyEarning[];
}

export interface ISubscriptionStatus {
    isActive: boolean;
    expiresAt: string | null;
}

export interface IWatchProgress {
    videoId: number;
    lastPositionSeconds: number;
}

export interface ITeacherWallet {
    id: number;
    provider: string;
    walletNumber: string;
    accountName: string;
    instructions: string;
    isDefault: boolean;
}

export interface ISaveTeacherWallet {
    provider: string;
    walletNumber: string;
    accountName: string;
    instructions: string;
    isDefault: boolean;
}

export interface ICheckPurchaseResponse {
    hasPurchased: boolean;
}

export interface ICanReviewResponse {
    canReview: boolean;
    alreadyReviewed: boolean;
}