export interface iRequest {
    _id: String, // reference request _id
    userid: String,
    alive: Boolean,
    drop_crn: String,
    add_crn: String,
    add_classtitle : String,
    drop_classtitle: String,
    add_course : String,
    drop_course : String
}

export interface iUser {
    _id : String,
    email : String,
    name : String,
    image : String,
    role : String
}

export interface iMatch {
    _id : String,
    alive : String,
    request_1: String,
    request_2: String,
    userid1: String,
    userid2: String,
    request1Object : [iRequest],
    request2Object: [iRequest]
}

export interface iFeedback {
    _id: String,
    request: String,
    requestObject : [iRequest]
    userid: String,
    message: String,
    submitted: Boolean,
    successfulSwap: Boolean
}

export interface iSwapTime {
    _id: String,
    userid : String,
    alive : Boolean,
    match: String
}

export interface iAdding {
    crn: String,
    title : String,
    course : String
}

export interface iDropping {
    crn: String,
    title : String,
    course : String
}
export interface iSemester {
    semester: String,
    semesterNum : String,
    year : String
}