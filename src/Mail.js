require('dotenv').config({path: "../.env"})
const nodemailer = require('nodemailer');
const { options } = require('pdfkit');
const mailService =( toEmail, subject, content, copyTo) =>
{ 
   const transporter = nodemailer.createTransport({
      service:"gmail",  
       host: "smtp.gmail.com", 
       port: "587", 
       secure: false,
       requireTLS: true, 
      service: 'gmail',
      auth: {
         user: 'spectraiquat@gmail.com',
         pass: 'zxjjnbxcjcdqszze'         
      },
      tls: {ciphers:'SSLv3',rejectUnauthorized: false}
    });
		
   const mailOptions = {
       from:'"SpectraIQ Team " <mahendrandeepa@gmail.com>',
         to: 'mahendrandeepa@gmail.com',
         cc:copyTo,
         subject: subject,
         html: content
 };
   const newTransportPromise = new Promise((resolve, reject) => {
    console.log('mailOptions '+mailOptions)
 transporter.sendMail(mailOptions, function (err, info) { 
 if (err) { 
console.log(err); 
 } else { 
console.log('sent', info); } });
 });
 console.log('Mail Sent Successfully...!!!');
 return newTransportPromise;
}
module.exports = mailService;