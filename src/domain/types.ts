export type Brand<K, T> = K & { __brand: T }

export type StudentId = Brand<string, "StudentId">
export type CourseCode = Brand<string, "CourseCode">
export type Email = Brand<string, "Email">
export type Credits = Brand<number, "Credits">
export type Semester = Brand<string, "Semester">
export type EnrollmentId = Brand<string, "EnrollmentId">

const STUDENT_ID_RE = /^STU\d{6}$/
const COURSE_CODE_RE = /^[A-Za-z]{2,4}\d{3}$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SEMESTER_RE = /^(Fall|Spring|Summer)\d{4}$/
const VALID_CREDITS = new Set([1, 2, 3, 4, 6])

export function createStudentId(value: string): StudentId | Error {
    if (!STUDENT_ID_RE.test(value)) return new Error(`Invalid StudentId "${value}"`)
    return value as StudentId
}

export function createCourseCode(value: string): CourseCode | Error {
    if (!COURSE_CODE_RE.test(value)) return new Error(`Invalid CourseCode "${value}"`)
    return value as CourseCode
}

export function createEmail(value: string): Email | Error {
    if (!EMAIL_RE.test(value)) return new Error(`Invalid Email "${value}"`)
    return value as Email
}

export function createCredits(value: number): Credits | Error {
    if (!VALID_CREDITS.has(value)) return new Error(`Credits must be one of 1, 2, 3, 4, 6`)
    return value as Credits
}

export function createSemester(value: string): Semester | Error {
    if (!SEMESTER_RE.test(value)) return new Error(`Invalid Semester "${value}"`)
    return value as Semester
}

export function createEnrollmentId(value: string): EnrollmentId | Error {
    if (!value.startsWith("ENR") || value.length <= 3) return new Error(`Invalid EnrollmentId "${value}"`)
    return value as EnrollmentId
}

export function unwrap<T>(result: T | Error): T {
    if (result instanceof Error) throw result
    return result
}