import React from 'react'
import { HiOutlineMenuAlt2 } from "react-icons/hi"
import logo from "../assets/TPGIT_logo_created.png";
import { FaSun, FaMoon } from "react-icons/fa"

export const Header = ({ darkMode, toggleDarkMode, toggleSidebar }) => {
  return (
    <nav className='fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700'>
      <div className='px-3 py-3 lg-px-5 lg:pl-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center justify-start rtl:justify-end'>
            <button className='inline-flex items-center p-2 text-sm text-gray-500 rounded-lg  hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:bg-gray-700 dark:ring-gray-600'>
              <HiOutlineMenuAlt2 className='text-2xl' onClick={toggleSidebar} />
            </button>
            <a href='/' className='flex ms-2 md:me-24 dark:bg-white dark:rounded-[4px]'>
              <img src={logo} alt="TPGIT Logo" className="h-10 me-3 " />
            </a>
          </div>
          <button className='dark:bg-slate-50 dark:text-slate-700 rounded-full p-2' onClick={toggleDarkMode}>
            { darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  )
}
