import nodemailer from 'nodemailer'

interface iMailOptions {
    from : string | undefined,
    to : (string | any)[],
    subject : string,
    text : string
}

export const sendMail = async (subject : string, recipients : String[], message: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NEXT_PUBLIC_MAIL,
          pass: "ieqicqvdgrfnxhig",
        },
    });

    const mailOptions : iMailOptions = {
        from: process.env.NEXT_PUBLIC_MAIL,
        to: recipients,
        subject: subject,
        text: message,
      };

    await new Promise((rsv, rjt) => {
        transporter.sendMail(
          mailOptions,
          function (error: any, info: { response: string }) {
            if (error) {
              return error
            } else {
              return 'success email sent'
            }
          }
        );
      });
}  

