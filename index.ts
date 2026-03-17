import { EphemeralKeyInfo } from "node:tls"
import { v4 as uuidv4 } from "uuid"

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
    status: active|cancelled
}

const id = uuidv4()
console.log("running the application ... ", id)
