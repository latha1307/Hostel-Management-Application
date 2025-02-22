const sql = require('mssql/msnodesqlv8');
const bcrypt = require('bcrypt');
const { openPool } = require('../database');
const { sendApprovalEmail } = require('../utils/mailUtils');
const upload = require('../utils/fileUtils');
const registerStudent = async (req, res) => {
  upload(req, res, async (err) => {
      if (err) {
          return res.status(400).json({ message: err });
      }

      let feesReceiptBuffer = null;
      let studentPhotoBuffer = null;

      if (req.files && req.files.fees_receipt && req.files.fees_receipt.length > 0) {
          feesReceiptBuffer = req.files.fees_receipt[0].buffer;
      }

      if (req.files && req.files.student_photo && req.files.student_photo.length > 0) {
          studentPhotoBuffer = req.files.student_photo[0].buffer;
      }

      try {
          const pool = await openPool(); 

          const query = `INSERT INTO [student].[dbo].[RegisteredStudents] 
              (application_no, roll_no, fees_receipt, course, year, student_name, student_photo, DOB, blood_group, other_BG, gender, nationality, religion, community, caste, differently_abled, student_mobile_no, student_email_id, annual_income, father_name, father_occupation, father_mobile_no, father_email_id, mother_name, mother_occupation, mother_mobile_no, mother_email_id, guardian_name, guardian_occupation, guardian_mobile_no, guardian_email_id, permanent_address, permanent_city, permanent_state, permanent_country, permanent_pincode, communication_address, communication_city, communication_state, communication_country, communication_pincode)
              VALUES (@application_no, @roll_no, @fees_receipt, @course, @year, @student_name, @student_photo, @DOB, @blood_group, @other_BG, @gender, @nationality, @religion, @community, @caste, @differently_abled, @student_mobile_no, @student_email_id, @annual_income, @father_name, @father_occupation, @father_mobile_no, @father_email_id, @mother_name, @mother_occupation, @mother_mobile_no, @mother_email_id, @guardian_name, @guardian_occupation, @guardian_mobile_no, @guardian_email_id, @permanent_address, @permanent_city, @permanent_state, @permanent_country, @permanent_pincode, @communication_address, @communication_city, @communication_state, @communication_country, @communication_pincode)`;

          const request = pool.request();

          // Map request inputs from body
          request.input('application_no', sql.VarChar, req.body.application_no);
          request.input('roll_no', sql.BigInt, req.body.roll_no);
          request.input('fees_receipt', sql.VarBinary, feesReceiptBuffer);
          request.input('course', sql.VarChar, req.body.course);
          request.input('year', sql.VarChar, req.body.year);
          request.input('student_name', sql.VarChar, req.body.student_name);
          request.input('student_photo', sql.VarBinary, studentPhotoBuffer);
          request.input('DOB', sql.Date, req.body.DOB);
          request.input('blood_group', sql.VarChar, req.body.blood_group);
          request.input('other_BG', sql.VarChar, req.body.other_BG);
          request.input('gender', sql.VarChar, req.body.gender);
          request.input('nationality', sql.VarChar, req.body.nationality);
          request.input('religion', sql.VarChar, req.body.religion);
          request.input('community', sql.VarChar, req.body.community);
          request.input('caste', sql.VarChar, req.body.caste);
          request.input('differently_abled', sql.VarChar, req.body.differently_abled);
          request.input('student_mobile_no', sql.VarChar, req.body.student_mobile_no);
          request.input('student_email_id', sql.VarChar, req.body.student_email_id);
          request.input('annual_income', sql.Int, req.body.annual_income); 
          request.input('father_name', sql.VarChar, req.body.father_name);
          request.input('father_occupation', sql.VarChar, req.body.father_occupation);
          request.input('father_mobile_no', sql.VarChar, req.body.father_mobile_no);
          request.input('father_email_id', sql.VarChar, req.body.father_email_id);
          request.input('mother_name', sql.VarChar, req.body.mother_name);
          request.input('mother_occupation', sql.VarChar, req.body.mother_occupation);
          request.input('mother_mobile_no', sql.VarChar, req.body.mother_mobile_no);
          request.input('mother_email_id', sql.VarChar, req.body.mother_email_id);
          request.input('guardian_name', sql.VarChar, req.body.guardian_name);
          request.input('guardian_occupation', sql.VarChar, req.body.guardian_occupation);
          request.input('guardian_mobile_no', sql.VarChar, req.body.guardian_mobile_no);
          request.input('guardian_email_id', sql.VarChar, req.body.guardian_email_id);
          request.input('permanent_address', sql.VarChar, req.body.permanent_address);
          request.input('permanent_city', sql.VarChar, req.body.permanent_city);
          request.input('permanent_state', sql.VarChar, req.body.permanent_state);
          request.input('permanent_country', sql.VarChar, req.body.permanent_country);
          request.input('permanent_pincode', sql.VarChar, req.body.permanent_pincode);
          request.input('communication_address', sql.VarChar, req.body.communication_address);
          request.input('communication_city', sql.VarChar, req.body.communication_city);
          request.input('communication_state', sql.VarChar, req.body.communication_state);
          request.input('communication_country', sql.VarChar, req.body.communication_country);
          request.input('communication_pincode', sql.VarChar, req.body.communication_pincode);

          // Execute query to insert student details
          await request.query(query);

          res.status(200).json({ success: "Student added successfully" });
      } catch (error) {
          console.error('Error processing request:', error);
          return res.status(500).json({ message: "Server error: " + error.message });
      }
  });
};

const getStudentRequests = async (req, res) => {
    // Fetching student requests logic (same as in your original code)
};

const approveStudent = async (req, res) => {
    const { roll_no } = req.body;

    try {
        const pool = await openPool();
        const getStudentQuery = 'SELECT * FROM [HostelManagementDB].[dbo].[RegisteredStudents] WHERE roll_no = @roll_no';
        const studentResult = await pool.request()
            .input('roll_no', sql.BigInt, roll_no)
            .query(getStudentQuery);

        const student = studentResult.recordset[0];
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Generate password and hash it
        const generatePassword = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
            let password = '';
            for (let i = 0; i < 10; i++) {
                password += chars[Math.floor(Math.random() * chars.length)];
            }
            return password;
        };

        const rawPassword = generatePassword();
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const insertStudentQuery = `INSERT INTO [HostelManagementDB].[dbo].[StudentDetails]
            (application_no, roll_no, fees_receipt, course, year, student_name, student_photo, DOB, blood_group, other_BG, gender, nationality, religion, community, caste, differently_abled, student_mobile_no, student_email_id, annual_income, father_name, father_occupation, father_mobile_no, father_email_id, mother_name, mother_occupation, mother_mobile_no, mother_email_id, guardian_name, guardian_occupation, guardian_mobile_no, guardian_email_id, permanent_address, permanent_city, permanent_state, permanent_country, permanent_pincode, communication_address, communication_city, communication_state, communication_country, communication_pincode, Password)
            VALUES (@application_no, @roll_no, @fees_receipt, @course, @year, @student_name, @student_photo, @DOB, @blood_group, @other_BG, @gender, @nationality, @religion, @community, @caste, @differently_abled, @student_mobile_no, @student_email_id, @annual_income, @father_name, @father_occupation, @father_mobile_no, @father_email_id, @mother_name, @mother_occupation, @mother_mobile_no, @mother_email_id, @guardian_name, @guardian_occupation, @guardian_mobile_no, @guardian_email_id, @permanent_address, @permanent_city, @permanent_state, @permanent_country, @permanent_pincode, @communication_address, @communication_city, @communication_state, @communication_country, @communication_pincode, @Password)`;

        const request = pool.request();
        request.input('application_no', sql.VarChar, student.application_no);
        request.input('roll_no', sql.BigInt, student.roll_no);
        request.input('fees_receipt', sql.VarBinary, student.fees_receipt);
        request.input('course', sql.VarChar, student.course);
        request.input('year', sql.VarChar, student.year);
        request.input('student_name', sql.VarChar, student.student_name);
        request.input('student_photo', sql.VarBinary, student.student_photo);
        request.input('DOB', sql.Date, student.DOB);
        request.input('blood_group', sql.VarChar, student.blood_group);
        request.input('other_BG', sql.VarChar, student.other_BG);
        request.input('gender', sql.VarChar, student.gender);
        request.input('nationality', sql.VarChar, student.nationality);
        request.input('religion', sql.VarChar, student.religion);
        request.input('community', sql.VarChar, student.community);
        request.input('caste', sql.VarChar, student.caste);
        request.input('differently_abled', sql.VarChar, student.differently_abled);
        request.input('student_mobile_no', sql.VarChar, student.student_mobile_no);
        request.input('student_email_id', sql.VarChar, student.student_email_id);
        request.input('annual_income', sql.Int, student.annual_income);
        request.input('father_name', sql.VarChar, student.father_name);
        request.input('father_occupation', sql.VarChar, student.father_occupation);
        request.input('father_mobile_no', sql.VarChar, student.father_mobile_no);
        request.input('father_email_id', sql.VarChar, student.father_email_id);
        request.input('mother_name', sql.VarChar, student.mother_name);
        request.input('mother_occupation', sql.VarChar, student.mother_occupation);
        request.input('mother_mobile_no', sql.VarChar, student.mother_mobile_no);
        request.input('mother_email_id', sql.VarChar, student.mother_email_id);
        request.input('guardian_name', sql.VarChar, student.guardian_name);
        request.input('guardian_occupation', sql.VarChar, student.guardian_occupation);
        request.input('guardian_mobile_no', sql.VarChar, student.guardian_mobile_no);
        request.input('guardian_email_id', sql.VarChar, student.guardian_email_id);
        request.input('permanent_address', sql.VarChar, student.permanent_address);
        request.input('permanent_city', sql.VarChar, student.permanent_city);
        request.input('permanent_state', sql.VarChar, student.permanent_state);
        request.input('permanent_country', sql.VarChar, student.permanent_country);
        request.input('permanent_pincode', sql.VarChar, student.permanent_pincode);
        request.input('communication_address', sql.VarChar, student.communication_address);
        request.input('communication_city', sql.VarChar, student.communication_city);
        request.input('communication_state', sql.VarChar, student.communication_state);
        request.input('communication_country', sql.VarChar, student.communication_country);
        request.input('communication_pincode', sql.VarChar, student.communication_pincode);
        request.input('Password', sql.VarChar, hashedPassword);

        await request.query(insertStudentQuery);

        const deleteQuery = 'DELETE FROM [HostelManagementDB].[dbo].[RegisteredStudents] WHERE roll_no = @roll_no';
        await pool.request().input('roll_no', sql.BigInt, roll_no).query(deleteQuery);

        // Send approval email
        await sendApprovalEmail(student, rawPassword);

        return res.status(200).json({ success: "Student approved successfully. Email sent with login credentials." });
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ message: "Server error: " + error.message });
    }
};

const rejectStudent = async (req, res) => {
    const { roll_no } = req.body;

    try {
        const pool = await openPool();
        const getStudentQuery = 'SELECT * FROM [HostelManagementDB].[dbo].[RegisteredStudents] WHERE roll_no = @roll_no';
        const studentResult = await pool.request()
            .input('roll_no', sql.BigInt, roll_no)
            .query(getStudentQuery);

        const student = studentResult.recordset[0];
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Delete the student from 'RegisteredStudents' as part of the rejection
        const deleteQuery = 'DELETE FROM [HostelManagementDB].[dbo].[RegisteredStudents] WHERE roll_no = @roll_no';
        await pool.request().input('roll_no', sql.BigInt, roll_no).query(deleteQuery);

        return res.status(200).json({ success: "Student rejected successfully" });
    } catch (error) {
        console.error('Error processing rejection:', error);
        return res.status(500).json({ message: "Server error: " + error.message });
    }
};

const studentLogin = async (req, res) => {
    // Login logic (same as in your original code)
};

module.exports = { registerStudent};