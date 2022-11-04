//API to get the course information from va tech.

//Class for campus type.
var Campus = {
  BLACKSBURG: "0",
  VIRTUAL: "10"
};

//Class for day of the week course is.
var Day = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
  ARRANGED: "Arranged",
};

//Class for the modality of the course
var Modality = {
  ALL: "%",
  IN_PERSON: "A",
  HYBRID: "H",
  ONLINE_SYNC: "N",
  ONLINE_ASYNC: "O",
};

//Class for the pathways the course staisfies.
var Pathway = {
  ALL: "AR%",
  CLE_1: "AR01",
  CLE_2: "AR02",
  CLE_3: "AR03",
  CLE_4: "AR04",
  CLE_5: "AR05",
  CLE_6: "AR06",
  CLE_7: "AR07",
  PATH_1A: "G01A",
  PATH_1F: "G01F",
  PATH_2: "G02",
  PATH_3: "G03",
  PATH_4: "G02",
  PATH_5A: "G02",
  PATH_5F: "G02",
  PATH_6A: "G06A",
  PATH_6D: "G06D",
  PATH_7: "G07"
};

//Used to get information about the semester
var Semester = {
  SPRING: "01",
  SUMMER: "06",
  FALL: "09",
  WINTER: "12"
};

var SectionType = {
  ALL: "%",
  INDEPENDENT_STUDY: "%I%",
  LAB: "%B%",
  LECTURE: "%L%",
  RECITATION: "%C%",
  RESEARCH: "%R%",
  ONLINE: "ONLINE",
};

//Used to see if the class is open or not
<<<<<<< HEAD
class Status {
  ALL = "";
  OPEN = "on";
}

//Used as a container for information about vt courses
class Course {
  _section_type_dct = {
    I: SectionType.INDEPENDENT_STUDY,
    B: SectionType.LAB,
    L: SectionType.LECTURE,
    C: SectionType.RECITATION,
    R: SectionType.RESEARCH,
    O: SectionType.ONLINE,
  };

  _modality_dct = {
    "Face-to-Face Instruction": Modality.IN_PERSON,
    "Hybrid (F2F & Online Instruc.)": Modality.HYBRID,
    "Online with Synchronous Mtgs.": Modality.ONLINE_SYNC,
    "Online: Asynchronous": Modality.ONLINE_ASYNC,
  };

  _day_dct = {
    M: Day.MONDAY,
    T: Day.TUESDAY,
    W: Day.WEDNESDAY,
    R: Day.THURSDAY,
    F: Day.FRIDAY,
    S: Day.SATURDAY,
    U: Day.SUNDAY,
    "(ARR)": Day.ARRANGED,
  };

  /*
    Args:
        year:
            string representing the year in which the course is taking
            place.
        semester:
            `Semester` representing the semester in which the course is
            taking place.
        timetable_data:
            `pandas.Series` representing the data scraped from the
            timetable.
        extra_class_data:
            Optional `pandas.Series` representing the days and times of
            additional classes scraped from the timetable.
    */
  constructor(year, semester, timetable_data, extra_class_data) {
    const array = [...timetable_data[1].matchAll(/(.+)-(.+)/g)];
    subject, (code = array[0][1]), array[0][2];

    let name = "";

    if (semester == Semester.SUMMER) {
      const arraybreak = [
        ...timetable_data[2].matchAll(/- \d{2}-[A-Z]{3}-\d{4}(.+)$/g),
      ];
      name = arraybreak[0][1];
    } else {
      name = timetable_data[2];
    }

    let section_type = "";

    if (timetable_data[3].match(/'ONLINE COURSE'/)) {
      section_type = this._section_type_dct["O"];
    } else {
      const arrayBreak2 = timetable_data[3].match(/'[LBICR]'/);
      section_type = this._section_type_dct[arrayBreak2[0]];
    }

    let modality = null;

    if (timetable_data[4] in this._modality_dct) {
      modality = this._modality_dct[timetable_data[4]];
    } else {
      modality = null;
    }

    let class_dct = {};

    timetable_data[8].split(" ").forEach((d) => {
      let day = this._day_dct[d];
      if (day === Day.ARRANGED) {
      } else {
        class_dct[day] = [
          timetable_data[9],
          timetable_data[10],
          timetable_data[11],
        ];
      }
    });

    if (
      extra_class_data != null &&
      extra_class_data[4] == "* Additional Times *"
    ) {
      extra_class_data[8].split(" ").forEach((d) => {
        let day = this._day_dct[d];
        class_dct[day] = [
          extra_class_data[9],
          extra_class_data[10],
          extra_class_data[11],
        ];
      });
    }

    let _course_data = {
      year: year,
      semester: semester,
      crn: timetable_data[0].slice(0, 5),
      subject: subject,
      code: code,
      name: name,
      section_type: section_type,
      modality: modality,
      credit_hours: timetable_data[5],
      capacity: timetable_data[6],
      professor: timetable_data[7],
      schedule: class_dct,
    };

    //  def __str__(self):
    // return ''.join(
    //     f'{d}: {self._course_data[d]}, ' for d in self._course_data)[:-2]

    // def get_year(self) -> str:
    //     return self._course_data['year']

    // def get_semester(self) -> Semester:
    //     return self._course_data['semester']

    // def get_crn(self) -> str:
    //     return self._course_data['crn']

    // def get_subject(self) -> str:
    //     return self._course_data['subject']

    // def get_code(self) -> str:
    //     return self._course_data['code']

    // def get_name(self) -> str:
    //     return self._course_data['name']

    // def get_type(self) -> SectionType:
    //     return self._course_data['section_type']

    // def get_modality(self) -> Modality:
    //     return self._course_data['modality']

    // def get_credit_hours(self) -> str:
    //     return self._course_data['credit_hours']

    // def get_capacity(self) -> str:
    //     return self._course_data['capacity']

    // def get_professor(self) -> str:
    //     return self._course_data['professor']

    // def get_schedule(self) -> Dict[Day, Set[Tuple[str, str, str]]]:
    //     return self._course_data['schedule']

    // def has_open_spots(self) -> bool:
    //     return True if search_timetable(self.get_year(), self.get_semester(),
    //                                     crn=self.get_crn(),
    //                                     status=Status.OPEN) else False
  }
}

//Returns a single course if it exists with this crn otherwise nothing.
function getCRN(year, semester, crn) {
  crn_search = search_timetable(year, semester, crn);
  if (crn_search) {
    return crn_search[0];
  }
}

function search_timetable(
  year,
  semester,
  campus,
  pathway,
  subject,
  section_type,
  code,
  crn,
  status,
  modality
) {
  semester = Semester;
  campus = Campus.BLACKSBURG;
  pathway = Pathway.ALL;
  section_type = SectionType.ALL;
  status = Status.ALL;
  modality = Modality.ALL;

  //Setting the correct term year
  if (semester == Semester.WINTER) {
    term_year = str(int(year) - 1) + semester.value;
  } else {
    term_year = year + semester.value;
  }
  //Setting the correct subject
  if (subject == "") {
    subject = "%";
  } else {
    subject = subject;
  }

  var data = {
    CAMPUS: campus,
    TERMYEAR: term_year,
    CORE_CODE: pathway,
    subj_code: subject,
    SCHDTYPE: section_type,
    CRSE_NUMBER: code,
    crn: crn,
    open_only: status,
    sess_code: modality,
  };

  var request = makeRequest("post", data);

  //If there are no matches return empty list
  if (request == "") {
    return [];
  }

  request_data = readHtml(request)[4];
  course_list = [];
  // for i in range(1, request_data.shape[0]) {
  //     if isinstance(request_data.iloc[i][0], str){
  //         course_list.append(Course(year, semester, request_data.iloc[i], request_data.iloc[i + 1] if request_data.shape[0] > i + 1 else None))
  //     }
  // }
  return course_list;
  //Need to read html tables, not sure what to use in js library
}

function makeRequest(requestType, data) {
  let url = "https://apps.es.vt.edu/ssb/HZSKVTSC.P_ProcRequest";

  let headers = {
    "User-Agent": "Axios 0.21.1",
    "Accept-Encoding": "gzip, deflate",
    Accept: "*/*",
    Connection: "keep-alive",
    "Content-Length": "115",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (requestType == "post") {
    axios
      .post(url, data, {
        headers: headers,
      })
      .then(
        (response) => {
          console.log(response.data);
        },
        (error) => {
          throw new Error(`${error}`);
        }
      );

    return request.text();
  } else if (requestType == "get") {
    axios.get(url).then(
      (response) => {
        console.log(response.data);
      },
      (error) => {
        throw new Error(`${error}`);
      }
    );

    return getRequest.text();
  } else {
    throw new Error("Invalid request type");
=======
var Status = {
  ALL: "",
  OPEN: "on"
};
 
  //Used as a container for information about vt courses
  class Course {
    _section_type_dct = {
      I: SectionType.INDEPENDENT_STUDY,
      B: SectionType.LAB,
      L: SectionType.LECTURE,
      C: SectionType.RECITATION,
      R: SectionType.RESEARCH,
      O: SectionType.ONLINE,
    };
  
    _modality_dct = {
      "Face-to-Face Instruction": Modality.IN_PERSON,
      "Hybrid (F2F & Online Instruc.)": Modality.HYBRID,
      "Online with Synchronous Mtgs.": Modality.ONLINE_SYNC,
      "Online: Asynchronous": Modality.ONLINE_ASYNC,
    };
  
    _day_dct = {
      M: Day.MONDAY,
      T: Day.TUESDAY,
      W: Day.WEDNESDAY,
      R: Day.THURSDAY,
      F: Day.FRIDAY,
      S: Day.SATURDAY,
      U: Day.SUNDAY,
      "(ARR)": Day.ARRANGED,
    };
  
    /*
      Args:
          year:
              string representing the year in which the course is taking
              place.
          semester:
              `Semester` representing the semester in which the course is
              taking place.
          timetable_data:
              `pandas.Series` representing the data scraped from the
              timetable.
          extra_class_data:
              Optional `pandas.Series` representing the days and times of
              additional classes scraped from the timetable.
      */
    constructor(year, semester, timetable_data, extra_class_data) {
      subject, (code = timetable_data[1].match("(.+)-(.+)").group(1, 2));
      semester = this.Semester;
  
      //Stuck here --------------------------------------------------------
    }
  }
  
  //Returns a single course if it exists with this crn otherwise nothing.
  function getCRN(year, semester, crn) {
    crn_search = search_timetable(year, semester, crn);
    if (crn_search) {
      return crn_search[0];
    }
  }
  
  function search_timetable(
    year,
    semester,
    crn,
    pathway,
    subject,
    section_type,
    code,
    campus,
    status,
    modality
  ) {
    semester = semester;
    campus = Campus.BLACKSBURG;
    pathway = Pathway.ALL;
    section_type = SectionType.ALL;
    status = Status.ALL;
    modality = Modality.ALL;
  
    //Setting the correct term year
    var term_year = 0;
    if (semester == Semester.WINTER) {
      term_year = year - 1 +(semester);
    } else {
      term_year = year + (semester);
    }
    //Setting the correct subject
    if (subject == "" || subject == undefined) {
      subject = "%";
    } else {
      subject = subject;
    }
     //Setting the correct subject
     if (code == undefined) {
      code = "";
    } else {
      code = code;
    }
  
    var request_data = {
      CAMPUS: campus,
      TERMYEAR: term_year,
      CORE_CODE: pathway,
      subj_code: subject,
      SCHDTYPE: section_type,
      CRSE_NUMBER: code,
      crn: crn,
      open_only: status,
      sess_code: modality,
    };
  
    var request = makeRequest("post", request_data);
  
    //If there are no matches return empty list
    if (request == "") {
      return [];
    }
  
    request_data = readHtml(request)[4];
    course_list = [];
    // for i in range(1, request_data.shape[0]) {
    //     if isinstance(request_data.iloc[i][0], str){
    //         course_list.append(Course(year, semester, request_data.iloc[i], request_data.iloc[i + 1] if request_data.shape[0] > i + 1 else None))
    //     }
    // }
    return course_list;
    //Need to read html tables, not sure what to use in js library
  }
  
  function makeRequest(requestType, requestData) {
    var url = "https://apps.es.vt.edu/ssb/HZSKVTSC.P_ProcRequest";
    if (requestType == "post") {
      // for (r in requestData) {
      //   request_data[r] = request_data[r].value;
      // }
  
      const postRequest = fetch(url, {
        method: "post",
        payload: requestData,
      });
      // if the request contains an error, throw an error
      if (postRequest.status_code != 200) {
        throw new Error("Request failed");
      }
      // if (request.text() == "THERE IS AN ERROR WITH YOUR REQUEST") {
      //   exit("There was an error with your request. Please try again.");
      // }
      // if (request.text()  "There was a problem with your request") {
      //   exit("There was an error with your request. Please try again.");
      // }
      // if (request.text() == "NO SECTIONS FOUND FOR THIS INQUIRYs") {
      //   exit("There was an error with your request. Please try again.");
      // }
      return request.text();
    } else if (requestType == "get") {
      const getRequest = fetch(url, { method: "get" });
      // if the request contains an error, throw an error
      if (getRequest.status_code != 200) {
        throw new Error("Request failed");
      }
      return getRequest.text();
    } else {
      throw new Error("Invalid request type");
    }
>>>>>>> 138ece8557b028eabdc2674cacd20789c35c8b8d
  }
  
  export { getCRN, Semester };
