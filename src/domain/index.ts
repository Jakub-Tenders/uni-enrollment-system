type Brand<K, T> = K & { __brand: T }

type StudentId = Brand<string, "StudentId">
type CourseCode = Brand<string, "CourseCode">
type Email = Brand<string, "Email">
type Credits = Brand<number, "Credits">
type Semester = Brand<string, "Semester">
type EnrollmentId = Brand<string, "EnrollmentId">

const studentIdPattern = /^STU\d{6}$/
const courseCodePattern = /^[A-Za-z]{2,4}\d{3}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const semesterPattern = /^(Fall|Spring|Summer)\d{4}$/
const allowedCredits = new Set([1, 2, 3, 4, 6])

function createStudentId(value: string): StudentId | Error {
    if (!studentIdPattern.test(value)) return new Error("Invalid StudentId")
    return value as StudentId
}

function createCourseCode(value: string): CourseCode | Error {
    if (!courseCodePattern.test(value)) return new Error("Invalid CourseCode")
    return value as CourseCode
}

function createEmail(value: string): Email | Error {
    if (!emailPattern.test(value)) return new Error("Invalid Email")
    return value as Email
}

function createCredits(value: number): Credits | Error {
    if (!allowedCredits.has(value)) return new Error("Invalid Credits")
    return value as Credits
}

function createSemester(value: string): Semester | Error {
    if (!semesterPattern.test(value)) return new Error("Invalid Semester")
    return value as Semester
}

function createEnrollmentId(value: string): EnrollmentId | Error {
    if (!value.startsWith("ENR") || value.length <= 3) {
        return new Error("Invalid EnrollmentId")
    }
    return value as EnrollmentId
}

type Student = {
    id : StudentId
    name : string
    email : Email
    enrolledCredits : Credits
}

type Course = {
    code : CourseCode
    name : string
    credits : Credits
    capacity : number
    enrolledCount : number
}

type Enrollment = {
    id : EnrollmentId
    studentid : StudentId
    coursecode : CourseCode
    semester : Semester
    status: "active" | "cancelled"
}
