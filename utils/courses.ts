import axios from "axios";
import cheerio from "cheerio";

//API to get the course information from va tech.
//Class for campus type.
let Campus = {
  BLACKSBURG: "0",
  VIRTUAL: "10",
};

//Class for day of the week course is.
let Day = {
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
let Modality = {
  ALL: "%",
  IN_PERSON: "A",
  HYBRID: "H",
  ONLINE_SYNC: "N",
  ONLINE_ASYNC: "O",
};

//Class for the pathways the course staisfies.
let Pathway = {
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
  PATH_7: "G07",
};

//Used to get information about the semester
let Semester = {
  SPRING: "01",
  SUMMER: "06",
  FALL: "09",
  WINTER: "12",
};

let SectionType = {
  ALL: "%",
  INDEPENDENT_STUDY: "%I%",
  LAB: "%B%",
  LECTURE: "%L%",
  RECITATION: "%C%",
  RESEARCH: "%R%",
  ONLINE: "ONLINE",
};

//Used to see if the class is open or not
let Status = {
  ALL: "",
  OPEN: "on",
};

//Used as a container for information about vt courses
class Course {
  _section_type_dct: any = {
    I: SectionType.INDEPENDENT_STUDY,
    B: SectionType.LAB,
    L: SectionType.LECTURE,
    C: SectionType.RECITATION,
    R: SectionType.RESEARCH,
    O: SectionType.ONLINE,
  };

  _modality_dct: any = {
    "Face-to-Face Instruction": Modality.IN_PERSON,
    "Hybrid (F2F & Online Instruc.)": Modality.HYBRID,
    "Online with Synchronous Mtgs.": Modality.ONLINE_SYNC,
    "Online: Asynchronous": Modality.ONLINE_ASYNC,
  };

  _day_dct: any = {
    M: Day.MONDAY,
    T: Day.TUESDAY,
    W: Day.WEDNESDAY,
    R: Day.THURSDAY,
    F: Day.FRIDAY,
    S: Day.SATURDAY,
    U: Day.SUNDAY,
    "(ARR)": Day.ARRANGED,
  };

  _course_data: any = {};

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
  constructor(
    year: any,
    semester: any,
    timetable_data: any[],
    extra_class_data: any[] | null
  ) {
    const array = [...timetable_data[1].matchAll(/(.+)-(.+)/g)];

    let subject = array[0][1];
    let code = array[0][2];

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

    if (timetable_data[3].match(/ONLINE COURSE/g)) {
      section_type = this._section_type_dct["O"];
    } else {
      const arrayBreak2 = timetable_data[3].match(/[LBICR]/g);
      section_type = this._section_type_dct[arrayBreak2[0]];
    }

    let modality = null;

    if (timetable_data[4] in this._modality_dct) {
      modality = this._modality_dct[timetable_data[4]];
    } else {
      modality = null;
    }

    let class_dct: any = {};

    let courseTimesSplit = timetable_data[8].split(" ");
    for (let i = 0; i < courseTimesSplit.length; i++) {
      let day = this._day_dct[courseTimesSplit[i]];

      if (day == Day.ARRANGED) {
        // Continue;
      } else {
        class_dct[day] = [
          timetable_data[9],
          timetable_data[10],
          timetable_data[11],
        ];
      }
    }

    if (
      extra_class_data != null &&
      extra_class_data[4] == "* Additional Times *"
    ) {
      let courseTimesSplit = extra_class_data[8].split(" ");

      for (let i = 0; i < courseTimesSplit.length; i++) {
        let day = this._day_dct[courseTimesSplit[i]];

        class_dct[day] = [
          extra_class_data[9],
          extra_class_data[10],
          extra_class_data[11],
        ];
      }
    }

    this._course_data = {
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
  }

  toString() {
    return JSON.stringify(this._course_data);
  }

  get_year() {
    return this._course_data["year"];
  }

  get_semester() {
    return this._course_data["semester"];
  }

  get_crn() {
    return this._course_data["crn"];
  }

  get_subject() {
    return this._course_data["subject"];
  }

  get_code() {
    return this._course_data["code"];
  }

  get_name() {
    return this._course_data["name"];
  }

  get_type() {
    return this._course_data["section_type"];
  }

  get_modality() {
    return this._course_data["modality"];
  }

  get_credit_hours() {
    return this._course_data["credit_hours"];
  }

  get_capacity() {
    return this._course_data["capacity"];
  }

  get_professor() {
    return this._course_data["professor"];
  }

  get_schedule() {
    return this._course_data["schedule"];
  }

  async has_open_spots() {
    if (
      await searchTimetable({
        year: this.get_year(),
        semester: this.get_semester(),
        crn: this.get_crn(),
        status: Status.OPEN,
      })
    ) {
      return true;
    } else {
      return false;
    }
  }
}

//Returns a single course if it exists with this crn otherwise nothing.
async function getCRN({
  year = undefined,
  semester = undefined,
  crn = undefined,
} = {}) {
  let crn_search = await searchTimetable({
    year: year,
    semester: semester,
    crn: crn,
  });
  if (crn_search) {
    return crn_search[0];
  }
}

async function getSemesters() {
  /** Fetches the semesters listed in the timetable.
  Returns:
      A set of length-2 tuples representing the semesters listed in the
      timetable. The first element of each tuple is the semester, and the
      second element of each tuple is the year.
  */
  let semester_dct: any = {
    Spring: Semester.SPRING,
    Summer: Semester.SUMMER,
    Fall: Semester.FALL,
    Winter: Semester.WINTER,
  };

  let semestersRegexMatches = [
    ...(await makeRequest()).matchAll(
      /<OPTION VALUE="\d{6}">([A-Z][a-z]+) (\d+)<\/OPTION>/g
    ),
  ];

  let semesters: any[] = [];
  semestersRegexMatches.forEach((e) => {
    semesters.push({
      semester: e[1],
      semesterNum: semester_dct[e[1]],
      year: e[2],
    });
  });

  return semesters;
}

async function getSubjects() {
  /** Fetches the course subjects listed in the timetable.
 Returns:
     A set of length-2 tuples representing the course subjects listed in the
     timetable. The first element of each tuple is the abbreviation of the
     subject name, and the second element of each tuple is is the full
     subject name.
 */

  let subjectRegexMatches = [
    ...(await makeRequest()).matchAll(/"([A-Z]+) - (.+?)"/g),
  ];

  let subjects: any[][] = [];
  subjectRegexMatches.forEach((e) => {
    subjects.push([e[1], e[2]]);
  });

  return subjects;
}

async function searchTimetable({
  year = new Date().getFullYear().valueOf(),
  semester = `${Semester.WINTER}`,
  campus = Campus.BLACKSBURG,
  pathway = Pathway.ALL,
  subject = "",
  section_type = SectionType.ALL,
  code = "",
  crn = "",
  status = Status.ALL,
  modality = Modality.ALL,
} = {}) {
  //Setting the correct term year
  let term_year: any = 0;
  if (semester == Semester.WINTER) {
    term_year = year - 1 + semester;
  } else {
    term_year = year + semester;
  }
  //Setting the correct subject
  if (subject == "" || subject == undefined) {
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

  let request = await makeRequest({ requestType: "post", data: data });

  //If there are no matches return empty list
  if (request == "") {
    return [];
  }

  let request_data = readHtml(request);

  let course_list = [];

  for (let i = 1; i < request_data.length; i++) {
    course_list.push(
      new Course(
        year,
        semester,
        request_data[i],
        request_data.length > i + 1 ? request_data[i + 1] : null
      )
    );
  }
  return course_list;
}

function readHtml(request: string | any[]) {
  // parse the html file into a DOM object and then use jQuery to select the table element
  const $ = cheerio.load(request);
  const table = $("table").get(4);

  // convert the table to a 2D array
  const data: any[][] = [];

  $(table)
    .find("tr")
    .each((i, row) => {
      const rowData: string[] = [];
      $(row)
        .find("td")
        .each((j, cell) => {
          rowData.push($(cell).text().trim());
        });
      data.push(rowData);
    });
  return data;
}

async function makeRequest({ requestType = "get", data = {} } = {}) {
  let url = "https://apps.es.vt.edu/ssb/HZSKVTSC.P_ProcRequest";

  let headers = {
    "User-Agent": `${axios.VERSION}`,
    "Accept-Encoding": "gzip, deflate",
    Accept: "*/*",
    Connection: "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  if (requestType == "post") {
    const response = await axios.post(url, data, {
      headers: headers,
    });

    let dataTextVal = response.data;

    if (dataTextVal.includes("THERE IS AN ERROR WITH YOUR REQUEST")) {
      throw new Error("The search parameters provided were invalid");
    }
    if (dataTextVal.includes("There was a problem with your request")) {
      if (dataTextVal.includes("NO SECTIONS FOUND FOR THIS INQUIRY")) {
        return "";
      } else {
        let course_not_found_message = [
          ...dataTextVal.matchAll(/<b class=red_msg><li>(.+)<\/b>/gi),
        ];
        throw new Error(course_not_found_message[0][1]);
      }
    }

    return dataTextVal;
  } else if (requestType == "get") {
    const response = await axios.get(url);
    return response.data;
  } else {
    throw new Error("Invalid request type");
  }
}

export { searchTimetable, getSemesters, getSubjects, getCRN };
