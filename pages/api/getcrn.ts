import { NextApiRequest, NextApiResponse } from "next";
import { getCRN } from "../../utils/courses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    const { year, semester, crn } = req.query;
    try {
      var course = await getCRN(year, semester, crn);
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