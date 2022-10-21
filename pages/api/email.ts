// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { SMTPClient } from "emailjs";
import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Sends an email from company's gmail account, found in environment variables,
 * to the email mentioned in the request.
 *
 * req {
 *     email: email@gmail.com
 *     CRN1: 124654
 *     CRN2: 546343
 * }
 *
 * if success
 * res {
 *     message: send mail
 * }
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, CRN1, CRN2 } = req.body;
  // console.log(process.env)

  const client = new SMTPClient({
    user: process.env.MAIL,
    password: process.env.MAIL_PASSWORD,
    host: "smtp.gmail.com",
    ssl: true,
  });

  try {
    client.send(
      {
        text: `A new match for request (${CRN1}, ${CRN2}) was found`,
        from: `${process.env.MAIL}`,
        to: email,
        subject: `A new match found`,
      },
      (err, message) => {
        console.log(err || message);
      }
    );
  } catch (e) {
    res.status(400).end(JSON.stringify({ message: "Error" }));
    return;
  }

  res.status(200).end(JSON.stringify({ message: "Send Mail" }));
}
