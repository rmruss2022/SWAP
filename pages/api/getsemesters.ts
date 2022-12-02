import { NextApiRequest, NextApiResponse } from "next";
import { getSemesters } from "../../utils/courses";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method == "GET") {
    try {
      var semesters = await getSemesters();
      if (semesters) {
        res.status(200).send(semesters );
      } else {
        res.status(400).send({ message: "No semsesters found!" });
      }
    } catch (error: any) {
      // we'll proceed, but let's report it
      res.status(400).send({ message: error.message });
    }
  } else {
    res.status(404).send({ message: "Make a GET request" });
  }
}
