// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const nodemailer = require("nodemailer");
import type { NextApiRequest, NextApiResponse } from "next";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NEXT_PUBLIC_MAIL,
    pass: "ieqicqvdgrfnxhig",
  },
});

/**
 * Sends an email from company's gmail account, found in environment variables,
 * to the email mentioned in the request.
 *
 * req.body {
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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, CRN1, CRN2 } = req.body;
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_MAIL,
    to: email,
    subject: "Match Found",
    text: `A new match for request (${CRN1}, ${CRN2}) was found`,
  };

  await new Promise((rsv, rjt) => {
    transporter.sendMail(
      mailOptions,
      function (error: any, info: { response: string }) {
        if (error) {
          res.status(552).json({ error: error });
        } else {
          res.status(200).json({ success: "Email Sent!" });
        }
      }
    );
  });
}
