
const registerStudent = async (studentData, studentPhotoData,feesReceiptData) => {
  try {
    // Make sure the data and file are valid
    if (!studentData || !studentPhotoData || feesReceiptData) {
      throw new Error("Missing required data or file");
    }

    // Ensure the photo is provided
    if (!studentPhotoData || ! feesReceiptData) {
      throw new Error("Student photo or fees receipt is required");
    }

    // Open connection to the database
    const pool = await poolPromise;

    // Create query string dynamically for better readability
    const query = 
      INSERT INTO StudentRegister (
        roll_no, fees_receipt, course, year, student_name, student_photo, DOB, 
        gender, student_mobile_no, student_email_id, father_name, father_mobile_no, 
        mother_name, mother_mobile_no, guardian_name, guardian_mobile_no, permanent_address, 
        permanent_city, permanent_state, permanent_country, permanent_pincode
      )
      VALUES (
        @roll_no, @fees_receipt, @course, @year, @student_name, @student_photo, @DOB, 
        @gender, @student_mobile_no, @student_email_id, @father_name, @father_mobile_no, 
        @mother_name, @mother_mobile_no, @guardian_name, @guardian_mobile_no, @permanent_address, 
        @permanent_city, @permanent_state, @permanent_country, @permanent_pincode
      );
    ;

    // Prepare request to insert data into the database
    const request = pool.request()
      .input('roll_no', sql.Int, studentData.roll_no)
      .input('fees_receipt', sql.VarBinary, studentData.fees_receipt)
      .input('course', sql.VarChar, studentData.course)
      .input('year', sql.Int, studentData.year)
      .input('student_name', sql.VarChar, studentData.student_name)
      .input('student_photo', sql.VarBinary, studentPhotoData)  // Store photo as binary data
      .input('DOB', sql.Date, studentData.DOB)
      .input('gender', sql.VarChar, studentData.gender)
      .input('student_mobile_no', sql.BigInt, studentData.student_mobile_no)
      .input('student_email_id', sql.VarChar, studentData.student_email_id)
      .input('father_name', sql.VarChar, studentData.father_name)
      .input('father_mobile_no', sql.BigInt, studentData.father_mobile_no)
      .input('mother_name', sql.VarChar, studentData.mother_name)
      .input('mother_mobile_no', sql.BigInt, studentData.mother_mobile_no)
      .input('guardian_name', sql.VarChar, studentData.guardian_name)
      .input('guardian_mobile_no', sql.BigInt, studentData.guardian_mobile_no)
      .input('permanent_address', sql.Text, studentData.permanent_address)
      .input('permanent_city', sql.VarChar, studentData.permanent_city)
      .input('permanent_state', sql.VarChar, studentData.permanent_state)
      .input('permanent_country', sql.VarChar, studentData.permanent_country)
      .input('permanent_pincode', sql.Int, studentData.permanent_pincode);

    // Execute the query
    await request.query(query);

    // If all goes well, return a success response or do something else
    console.log("Student registered successfully");

  } catch (error) {
    // Log the error and rethrow for further handling
    console.error("Error registering student:", error.message);
    throw new Error(Error registering student: ${error.message});
  }
};
module.exports = registerStudent; 