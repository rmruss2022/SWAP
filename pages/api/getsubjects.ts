import { NextApiRequest, NextApiResponse } from "next";
import { getSubjects } from "../../utils/courses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    try {
      var subjects = await getSubjects();
      if (subjects) {
        res.status(200).send({ subjects: subjects });
      } else {
        res.status(400).send({ message: "No subjects found!" });
      }
    } catch (error: any) {
      // we'll proceed, but let's report it
      res.status(400).send({ message: error.message });
    }
  } else {
    res.status(404).send({ message: "Make a GET request" });
  }
}
