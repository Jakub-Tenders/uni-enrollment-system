import { StudentId, CourseCode, Semester, EnrollmentId } from "./index"

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

export type CourseCapacityReachedEvent = {
    courseCode: CourseCode
    semester: Semester
    capacity: number
    enrolledCount: number
}

export type CourseFullEvent = {
    courseCode: CourseCode
    semester: Semester
    capacity: number
    enrolledCount: number
}

export type DomainEvent =
    | { type: "StudentEnrolled"; payload: StudentEnrolledEvent }
    | { type: "EnrollmentCancelled"; payload: EnrollmentCancelledEvent }
    | { type: "CourseCapacityReached"; payload: CourseCapacityReachedEvent }
    | { type: "CourseFull"; payload: CourseFullEvent }
