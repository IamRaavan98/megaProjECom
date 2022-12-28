
const nodemailer = require("nodemailer");
  async function mailHelper(options) {
  const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER, // generated ethereal user
      pass: process.env.SMTP_PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const message = await transporter.sendMail({
    from: "Rohanagrawal1798@gmail.com", // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
    html:` <b>
        <div>
        <button >
            <a href=${options.message}>click here to reset your password</a>
        </button>
    </div>
    </b>`, 
  });
 
}
module.exports = mailHelper;




