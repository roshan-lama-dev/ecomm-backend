//install and use the nodemailer
// configure the email server
// whom and what to sendemail , make the email body
// user the previous config to sent the email

import nodemailer from "nodemailer";

const emailProcessing = async (emailInfo) => {
  try {
    //config here
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    //send email here

    const info = await transporter.sendMail(emailInfo);

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.log(error);
  }
};

// email tempelating

export const adminSignUpEmailVerification = ({ email, fName }, url) => {
  // send mail with defined transport object
  let info = {
    from: `"Register Form" <${email}>`, // sender address
    to: process.env.SMTP_USER, // list of receivers
    subject: "New account confirmation - action required!", // Subject line
    text: `Hi ${fName}, please follow the link ${url} to verify your account.`, // plain text body
    html: `
    <p>Hi ${fName}</p>,
    <br />
    <br />
    Please follow the link below to verify you account:
    <br />
    <br />
<a href="${url}" style="color: red; font-weight: bolder;">Verify Now </a>
<br />
<br />

<p>
----------- <br />
Customer care team <br />
Coding Shop
</p>

`, // html body
  };

  emailProcessing(info);
};
