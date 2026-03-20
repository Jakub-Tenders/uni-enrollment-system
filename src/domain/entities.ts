import type { StudentId, CourseCode, Email, Credits, Semester, EnrollmentId } from "./index"

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
    public readonly code: CourseCode
    public readonly name: string
    public readonly credits: Credits
    public readonly capacity: number
    private _enrolledCount: number

    private constructor(code: CourseCode, name: string, credits: Credits, capacity: number) {
        this.code = code
        this.name = name
        this.credits = credits
        this.capacity = capacity
        this._enrolledCount = 0
    }

    static create(code: CourseCode, name: string, credits: Credits, capacity: number): Course {
        if (capacity < 1 || capacity > 200) throw new Error(`Course capacity must be between 1 and 200, got ${capacity}`)
        if (name.trim().length === 0) throw new Error("Course name cannot be empty")
        return new Course(code, name, credits, capacity)
    }

    get enrolledCount(): number {
        return this._enrolledCount
    }

    get isFull(): boolean {
        return this._enrolledCount >= this.capacity
    }

    get isNearCapacity(): boolean {
        return this._enrolledCount / this.capacity >= 0.8
    }

    get capacityPercentage(): number {
        return Math.round((this._enrolledCount / this.capacity) * 100)
    }

    canEnroll(): boolean {
        return !this.isFull
    }

    addStudent(): void {
        if (this.isFull) throw new Error(`Course ${this.code} is full`)
        this._enrolledCount++
    }

    removeStudent(): void {
        if (this._enrolledCount <= 0) throw new Error(`Course ${this.code} has no enrolled students`)
        this._enrolledCount--
    }
}

export type EnrollmentStatus = "active" | "cancelled"

export class Enrollment {
    public readonly id: EnrollmentId
    public readonly studentId: StudentId
    public readonly courseCode: CourseCode
    public readonly semester: Semester
    private _status: EnrollmentStatus

    private constructor(id: EnrollmentId, studentId: StudentId, courseCode: CourseCode, semester: Semester) {
        this.id = id
        this.studentId = studentId
        this.courseCode = courseCode
        this.semester = semester
        this._status = "active"
    }

    static create(id: EnrollmentId, studentId: StudentId, courseCode: CourseCode, semester: Semester): Enrollment {
        return new Enrollment(id, studentId, courseCode, semester)
    }

    get status(): EnrollmentStatus {
        return this._status
    }

    get isActive(): boolean {
        return this._status === "active"
    }

    cancel(): void {
        if (this._status !== "active") throw new Error(`Cannot cancel enrollment ${this.id}: status is "${this._status}"`)
        this._status = "cancelled"
    }
}