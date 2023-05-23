const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ to, subject, html }) => {
  const from = "ganna.shalia@gmail.com";
  const msg = {
    to,
    from,
    subject,
    html,
  };

  await sgMail.send(msg);
};

module.exports = sendMail;
