import { v4 as uuidv4 } from "uuid"
import { Student, Course, Enrollment, Semester, unwrap, createEnrollmentId } from "./index"
import { domainEvents } from "../infrastructure/domainEvents"

export function enroll(student: Student, course: Course, semester: Semester, existing: Enrollment[]): Enrollment | Error {
    const duplicate = existing.find(e =>
        e.studentId === student.id &&
        e.courseCode === course.code &&
        e.semester === semester &&
        e.isActive
    )
    if (duplicate) return new Error("Student is already enrolled in this course for this semester")

    if (!course.canEnroll()) return new Error("Course is full")

    if (!student.canEnroll(semester, course.credits)) {
        return new Error(
            `Student would exceed 18 credits for ${semester} ` +
            `(currently ${student.getCreditsForSemester(semester)}, course adds ${course.credits})`
        )
    }

    const enrollmentId = unwrap(createEnrollmentId("ENR" + uuidv4()))
    const enrollment = Enrollment.create(enrollmentId, student.id, course.code, semester)

    course.addStudent()
    student.addCredits(semester, course.credits)

    domainEvents.emit("StudentEnrolled", {
        studentId: student.id,
        courseCode: course.code,
        semester,
        enrollmentId
    })

    if (course.isFull) {
        domainEvents.emit("CourseFull", {
            courseCode: course.code,
            semester,
            capacity: course.capacity,
            enrolledCount: course.enrolledCount
        })
    } else if (course.isNearCapacity) {
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
    if (!enrollment.isActive) return new Error("Can only cancel an active enrollment")

    enrollment.cancel()
    course.removeStudent()
    student.removeCredits(enrollment.semester, course.credits)

    domainEvents.emit("EnrollmentCancelled", {
        enrollmentId: enrollment.id,
        studentId: enrollment.studentId,
        courseCode: enrollment.courseCode,
        semester: enrollment.semester
    })
}
