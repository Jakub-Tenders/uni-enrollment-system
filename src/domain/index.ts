export type Brand<K, T> = K & { __brand: T }

export type StudentId = Brand<string, "StudentId">
export type CourseCode = Brand<string, "CourseCode">
export type Email = Brand<string, "Email">
export type Credits = Brand<number, "Credits">
export type Semester = Brand<string, "Semester">
export type EnrollmentId = Brand<string, "EnrollmentId">

const studentIdPattern = /^STU\d{6}$/
const courseCodePattern = /^[A-Za-z]{2,4}\d{3}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const semesterPattern = /^(Fall|Spring|Summer)\d{4}$/
const allowedCredits = new Set([1, 2, 3, 4, 6])

export function createStudentId(value: string): StudentId | Error {
    if (!studentIdPattern.test(value)) return new Error("Invalid StudentId")
    return value as StudentId
}

export function createCourseCode(value: string): CourseCode | Error {
    if (!courseCodePattern.test(value)) return new Error("Invalid CourseCode")
    return value as CourseCode
}

export function createEmail(value: string): Email | Error {
    if (!emailPattern.test(value)) return new Error("Invalid Email")
    return value as Email
}

export function createCredits(value: number): Credits | Error {
    if (!allowedCredits.has(value)) return new Error("Invalid Credits")
    return value as Credits
}

export function createSemester(value: string): Semester | Error {
    if (!semesterPattern.test(value)) return new Error("Invalid Semester")
    return value as Semester
}

export function createEnrollmentId(value: string): EnrollmentId | Error {
    if (!value.startsWith("ENR") || value.length <= 3) return new Error("Invalid EnrollmentId")
    return value as EnrollmentId
}

export function unwrap<T>(result: T | Error): T {
    if (result instanceof Error) throw result
    return result
}

export class Student {
    public readonly id: StudentId
    public readonly name: string
    public readonly email: Email
    private creditsBySemester: Map<string, number>

    private constructor(id: StudentId, name: string, email: Email) {
        this.id = id
        this.name = name
        this.email = email
        this.creditsBySemester = new Map()
    }

    static create(id: StudentId, name: string, email: Email): Student {
        if (name.trim().length === 0) throw new Error("Student name cannot be empty")
        return new Student(id, name, email)
    }

    getCreditsForSemester(semester: Semester): number {
        return this.creditsBySemester.get(semester) ?? 0
    }

    canEnroll(semester: Semester, additionalCredits: Credits): boolean {
        return this.getCreditsForSemester(semester) + additionalCredits <= 18
    }

    addCredits(semester: Semester, credits: Credits): void {
        const current = this.getCreditsForSemester(semester)
        this.creditsBySemester.set(semester, current + credits)
    }

    removeCredits(semester: Semester, credits: Credits): void {
        const current = this.getCreditsForSemester(semester)
        this.creditsBySemester.set(semester, Math.max(0, current - credits))
    }
}

export class Course {
    constructor(
        public code: CourseCode,
        public name: string,
        public credits: Credits,
        public capacity: number,
        public enrolledCount: number
    ) {
        if (capacity < 1 || capacity > 200) throw new Error("Invalid Course capacity")
        if (enrolledCount < 0 || enrolledCount > capacity) throw new Error("Invalid enrolled count")
    }
}

export class Enrollment {
    constructor(
        public id: EnrollmentId,
        public studentId: StudentId,
        public courseCode: CourseCode,
        public semester: Semester,
        public status: "active" | "cancelled"
    ) {
        if (status !== "active" && status !== "cancelled")
            throw new Error("Invalid Enrollment status")
    }
}
