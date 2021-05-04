let nodemailer = require('nodemailer');

let nodemailerTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: String(process.env.SENDER_EMAIL),
        pass: String(process.env.EMAIL_APPLICATION_PASSWORD)
    }
});


exports.sendEmail = function (email, subjectLine, slotDetails, callback) {
    let options = {
        from: String('Vaccine Checker ' + process.env.EMAIL),
        to: email,
        subject: subjectLine,
        text: 'Vaccine available. Details: \n\n' + slotDetails
    };
    nodemailerTransporter.sendMail(options, (error, info) => {
        if (error) {
            return callback(error);
        }
        callback(error, info);
    });
};
