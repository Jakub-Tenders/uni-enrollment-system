import { StudentId, CourseCode, Semester, EnrollmentId } from "./types"

export type StudentEnrolledEvent = {
    studentId: StudentId
    courseCode: CourseCode
    semester: Semester
    enrollmentId: EnrollmentId
}

export type EnrollmentCancelledEvent = {
    enrollmentId: EnrollmentId
    studentId: StudentId
    courseCode: CourseCode
    semester: Semester
}

export type DomainEvent =
    | { type: "StudentEnrolled"; payload: StudentEnrolledEvent }
    | { type: "EnrollmentCancelled"; payload: EnrollmentCancelledEvent }
