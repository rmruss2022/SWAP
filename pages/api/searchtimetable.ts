import { NextApiRequest, NextApiResponse } from "next";
import { searchTimetable } from "../../utils/courses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    // Available query parameters:
    // {
    //   year = new Date().getFullYear().valueOf(),
    //   semester = `${Semester.WINTER}`,
    //   campus = Campus.BLACKSBURG,
    //   pathway = Pathway.ALL,
    //   subject = "",
    //   section_type = SectionType.ALL,
    //   code = "",
    //   crn = "",
    //   status = Status.ALL,
    //   modality = Modality.ALL,
    // }

    const searchQuery = req.query;
    try {
      var course_list = await searchTimetable(searchQuery);
      if (course_list) {
        res.status(200).send({ course: course_list });
      } else {
        res.status(400).send({ message: "Course Not Found!" });
      }
    } catch (error: any) {
      // we'll proceed, but let's report it
      res.status(400).send({ message: error.message });
    }
  } else {
    res.status(404).send({ message: "Make a GET request" });
  }
}
