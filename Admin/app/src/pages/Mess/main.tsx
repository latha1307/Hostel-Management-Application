import React from 'react';
import { Link } from 'react-router-dom';
import staffSalariesImage from '../../assets/staffSalaries.png';
import groceriesImage from '../../assets/groceries.png';
import attendanceImage from '../../assets/attendance.png';
import billDistributionImage from '../../assets/billDistribution.png';
import { useParams } from 'react-router-dom';

const Main = () => {
  const { hostel } = useParams();
  return (
    <div className="max-h-screen bg-pageBg p-1 -mt-10 w-[100vh]">

      <div className="flex items-center mt-8 mb-4">
        <span className=" text-primary text-xl font-bold">{hostel === 'Boys' ? 'Boys' : 'Girls'} Hostel</span>
      </div>
      <p className="text-tertiary font-medium mb-4">Manage mess / {hostel === 'Boys' ? 'Boys' : 'Girls'} Hostel</p>

      {/* Full-Screen Grid Section */}
      <div className="grid grid-cols-2 gap-6 content-center ">
        {/* Staff Salaries Card */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <img src={staffSalariesImage} alt="Staff Salaries" className="w-32 h-32 mb-3 mt-2" />
          <div className='flex m-3 w-full px-4 justify-between items-center'>
          <span className="text-lg font-semibold mt-3">Staff Salaries</span>
          <Link
            to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}/staffsalary`}
            className="text-primary font-extrabold text-4xl transform transition-transform duration-300 hover:scale-150"
          >
            →
          </Link>
          </div>
        </div>

        {/* Groceries Card */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <img src={groceriesImage} alt="Groceries" className="w-32 h-32 mb-4 mt-2" />
          <div className='flex m-3 w-full px-4 justify-between items-center'>
          <span className="text-lg font-semibold mt-3">Groceries</span>
          <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}/groceries`} className="text-primary font-extrabold text-4xl transform transition-transform duration-300 hover:scale-150">→</Link>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <img src={attendanceImage} alt="Attendance" className="w-32 h-32 mb-3" />
          <div className='flex m-4 w-full px-4 justify-between items-center'>
          <span className="text-lg font-semibold mt-3">Student Attendance</span>
          <Link to="/attendance" className="text-primary font-extrabold text-4xl transform transition-transform duration-300 hover:scale-150">→</Link>
          </div>
        </div>

        {/* Bill Distribution Card */}
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300">
          <img src={billDistributionImage} alt="Bill Distribution" className="w-32 h-32 mb-3 mt-2" />
          <div className='flex m-4 w-full px-4 justify-between items-center'>
          <span className="text-lg font-semibold mt-3">Bill Distribution</span>
          <Link to={`/manage-mess/${hostel === 'Boys' ? 'Boys' : 'Girls'}/bill-distribution`} className="text-primary font-extrabold text-4xl transform transition-transform duration-300 hover:scale-150">→</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
