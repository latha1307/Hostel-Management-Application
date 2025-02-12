const nodemailer = require('nodemailer');

const sendApprovalEmail = (student, rawPassword) => {
    const transporter = nodemailer.createTransport({
        secure: true,
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: 'tpgit.hostelmanagement@gmail.com', // Your email
            pass: 'zfwkbrkchtudcsho' // Your email password or app password
        }
    });

    const mailOptions = {
        from: 'tpgit.hostelmanagement@gmail.com',
        to: student.student_email_id,
        subject: 'Account Approved - Login Credentials',
        text: `Dear ${student.student_name},\n\nYour hostel account has been approved. You can log in using the following credentials:\n\nRoll Number: ${student.roll_no}\nPassword: ${rawPassword}\n\nPlease change your password after logging in.\n\nBest regards,\nHostel Management Team`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { sendApprovalEmail };
