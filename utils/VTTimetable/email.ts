import NodeMailer from 'nodemailer'

export const sendMail = async (subject : String, recipients : String[], message: String) => {
    const transporter = NodeMailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NEXT_PUBLIC_MAIL,
          pass: "ieqicqvdgrfnxhig",
        },
    });

    const mailOptions = {
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

