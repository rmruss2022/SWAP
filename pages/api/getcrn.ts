import { NextApiRequest, NextApiResponse } from "next";
import { getCRN } from "../../utils/courses";

// no chnge git push

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    // Available query parameters:
    // {
    //   year = new Date().getFullYear().valueOf(),
    //   semester = `${Semester.WINTER}`,
    //   crn = "",
    // }

    try {
      var course = await getCRN(req.query);
      if (course) {
        res.status(200).send({ course: course });
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
