import {
    Student,
    Course,
    Enrollment,
    Semester,
    createStudentId,
    createCourseCode,
    createEmail,
    createCredits,
    createSemester,
    unwrap
} from "./src/domain/index"
import { enroll, cancelEnrollment } from "./src/domain/enrollmentService"
import { domainEvents } from "./src/infrastructure/domainEvents"

function logScenario(title: string) {
    console.log(`\n=== ${title} ===`)
}

function registerEventLogs() {
    domainEvents.subscribe("StudentEnrolled", e =>
        console.log("Event: StudentEnrolled", {
            studentId: e.studentId,
            courseCode: e.courseCode,
            semester: e.semester,
            enrollmentId: e.enrollmentId
        })
    )
    domainEvents.subscribe("EnrollmentCancelled", e =>
        console.log("Event: EnrollmentCancelled", {
            enrollmentId: e.enrollmentId,
            studentId: e.studentId,
            courseCode: e.courseCode,
            semester: e.semester
        })
    )
    domainEvents.subscribe("CourseCapacityReached", e =>
        console.log("Event: CourseCapacityReached", {
            courseCode: e.courseCode,
            semester: e.semester,
            capacity: e.capacity,
            enrolledCount: e.enrolledCount
        })
    )
    domainEvents.subscribe("CourseFull", e =>
        console.log("Event: CourseFull", {
            courseCode: e.courseCode,
            semester: e.semester,
            capacity: e.capacity,
            enrolledCount: e.enrolledCount
        })
    )
}

function handleEnrollment(
    enrollments: Enrollment[],
    student: Student,
    course: Course,
    semester: Semester
) {
    const result = enroll(student, course, semester, enrollments)
    if (result instanceof Error) {
        console.log("Enroll failed:", result.message)
        return
    }
    enrollments.push(result)
}

function main() {
    registerEventLogs()

    const semester = unwrap(createSemester("Fall2024"))
    const enrollments: Enrollment[] = []

    logScenario("1. Successful enrollment -> StudentEnrolled")
    const student1 = Student.create(
        unwrap(createStudentId("STU000001")),
        "Alice",
        unwrap(createEmail("alice@example.com"))
    )
    const course1 = Course.create(
        unwrap(createCourseCode("CS101")),
        "Intro to CS",
        unwrap(createCredits(3)),
        30
    )
    handleEnrollment(enrollments, student1, course1, semester)

    logScenario("2. Course reaches 80% capacity -> CourseCapacityReached")
    const course2 = Course.create(
        unwrap(createCourseCode("MATH201")),
        "Discrete Math",
        unwrap(createCredits(3)),
        5
    )
    for (let i = 2; i <= 5; i++) {
        const student = Student.create(
            unwrap(createStudentId(`STU00000${i}`)),
            `Student${i}`,
            unwrap(createEmail(`student${i}@example.com`))
        )
        handleEnrollment(enrollments, student, course2, semester)
    }

    logScenario("3. Course becomes full -> CourseFull")
    const student6 = Student.create(
        unwrap(createStudentId("STU000006")),
        "Student6",
        unwrap(createEmail("student6@example.com"))
    )
    handleEnrollment(enrollments, student6, course2, semester)

    logScenario("4. Student exceeds 18 credits -> Fails, no event")
    const student7 = Student.create(
        unwrap(createStudentId("STU000007")),
        "Student7",
        unwrap(createEmail("student7@example.com"))
    )
    const course3 = Course.create(
        unwrap(createCourseCode("PHY301")),
        "Physics",
        unwrap(createCredits(6)),
        10
    )
    const course4 = Course.create(
        unwrap(createCourseCode("CHEM301")),
        "Chemistry",
        unwrap(createCredits(6)),
        10
    )
    const course5 = Course.create(
        unwrap(createCourseCode("BIO301")),
        "Biology",
        unwrap(createCredits(6)),
        10
    )
    handleEnrollment(enrollments, student7, course3, semester)
    handleEnrollment(enrollments, student7, course4, semester)
    handleEnrollment(enrollments, student7, course5, semester)

    logScenario("5. Enrollment cancellation -> EnrollmentCancelled")
    const enrollmentToCancel = enrollments.find(
        e => e.studentId === student1.id && e.courseCode === course1.code && e.isActive
    )
    if (!enrollmentToCancel) {
        console.log("No active enrollment found to cancel")
        return
    }
    const cancelResult = cancelEnrollment(enrollmentToCancel, student1, course1)
    if (cancelResult instanceof Error) {
        console.log("Cancel failed:", cancelResult.message)
    }
}

main()