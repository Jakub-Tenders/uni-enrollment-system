import { v4 as uuidv4 } from "uuid"
import { Student, Course, Enrollment, Credits, Semester, unwrap, createEnrollmentId } from "./index"
import { domainEvents } from "../infrastructure/domainEvents"

export function enroll(student: Student, course: Course, semester: Semester, existing: Enrollment[]): Enrollment | Error {
    const duplicate = existing.find(e =>
        e.studentId === student.id &&
        e.courseCode === course.code &&
        e.semester === semester &&
        e.status === "active"
    )
    if (duplicate) return new Error("Student is already enrolled in this course for this semester")

    if (course.enrolledCount >= course.capacity) return new Error("Course is full")

    if (student.enrolledCredits + course.credits > 18) return new Error("Student would exceed the 18 credit limit")

    const enrollmentId = unwrap(createEnrollmentId("ENR" + uuidv4()))
    const enrollment = new Enrollment(enrollmentId, student.id, course.code, semester, "active")

    course.enrolledCount++
    student.enrolledCredits = (student.enrolledCredits + course.credits) as Credits

    domainEvents.emit("StudentEnrolled", {
        studentId: student.id,
        courseCode: course.code,
        semester,
        enrollmentId
    })

    const fill = course.enrolledCount / course.capacity
    if (fill >= 1) {
        domainEvents.emit("CourseFull", {
            courseCode: course.code,
            semester,
            capacity: course.capacity,
            enrolledCount: course.enrolledCount
        })
    } else if (fill >= 0.8) {
        domainEvents.emit("CourseCapacityReached", {
            courseCode: course.code,
            semester,
            capacity: course.capacity,
            enrolledCount: course.enrolledCount
        })
    }

    return enrollment
}

export function cancelEnrollment(enrollment: Enrollment, student: Student, course: Course): void | Error {
    if (enrollment.status !== "active") return new Error("Can only cancel an active enrollment")

    enrollment.status = "cancelled"
    course.enrolledCount--
    student.enrolledCredits = (student.enrolledCredits - course.credits) as Credits

    domainEvents.emit("EnrollmentCancelled", {
        enrollmentId: enrollment.id,
        studentId: enrollment.studentId,
        courseCode: enrollment.courseCode,
        semester: enrollment.semester
    })
}