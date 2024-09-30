import React, { useState, Fragment } from 'react'

import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { HiMenuAlt3 } from "react-icons/hi";
import { AiOutlineClose, AiOutlineLogout } from "react-icons/ai";
import { Link } from "react-router-dom";
import { users } from "../utils/data";
import CustomButton from './CustomButton';

function MenuList({ user }) {
  const handleLogOut = () => { }

  return (
    <div>
      {/* // using headless ui component */}
      <Menu as='div' className="">
        <div className='flex'>
          <Menu.Button className="inline-flex  items-center  py-2 text-sm font-medium
        text-gray-500 hover:bg-gray-50 hover:text-gray-900
        group
        rounded-md
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
        ">
            <div className="leading[80px] flex flex-col items-start">
              <p className='text-sm font-semibold'>
                {user?.firstName ?? user?.name}
              </p>
              <span className='text-sm text-blue'>{user?.jobTitle ?? user?.email}</span>
            </div>
            <img
              src={user?.profileUrl}
              alt='user profile'
              className='w-10 h-10 rounded-full object-cover'
            />
            <BiChevronDown
              className="ml-2 -mr-1 h-8 w-8 text-gray-500"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter='transition ease-out duration-100'
          enterFrom='transform opacity-0 scale-95'
          enterTo='transform opacity-100 scale-100'
          leave='transition ease-in duration-75'
          leaveFrom='transform opacity-100 scale-100'
          leaveTo='transform opacity-0 scale-95'
        >
          <Menu.Items className=" absolute right-45 mt-2 w-52 rounded divide-fuchsia-200 bg-zinc-700 shadow-lg focus:outline-none">
            <div className="p-1">
              <Menu.Item>
                {
                  ({ active }) => (
                    <Link
                      to={`${user?.accountType ? "user-profile" : "company-profile"}`}
                      className={`${active ? "block px-4 py-2 text-sm text-white hover:bg-fuchsia-500"
                          : " text-gray-500"}
                  group flex w-full items-center rounded-md p-2 text-sm` }
                    // onClick={onClick}
                    >
                      <CgProfile
                        className={
                          `${active ? "text-white" : "text-gray-500"
                          } mr-2 h-5 w-5`
                        }
                        aria-hidden="true"
                      />
                      {user?.accountType ? "User Profile" : "Company Profile"}

                    </Link>
                  )}
              </Menu.Item>


              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => handleLogout()}
                    className={`${active ? "block px-4 py-2 text-sm text-white hover:bg-fuchsia-500"
                        : " text-gray-500"}
                  group flex w-full items-center rounded-md p-2 text-sm` }
                  >
                    <AiOutlineLogout
                      className={`${active ? "text-white" : "text-gray-600"
                        } mr-2 h-5 w-5  `}
                      aria-hidden='true'
                    />
                    Log Out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

const Navbar = () => {
  const user = users[1];
  const [isOpen, setIsOpen] = useState(false);
  console.log(user)
  const handleCloseNavbar = () => {
    setIsOpen((prev) => !prev);

  };
  return (
    <>
      <div className='relative bg-gray-900 z-50'>
        <nav className=' container mx-auto flex items-center justify-between p-5'>
          <div className=''>
            <Link to="/" className='text-indigo-500 text-2xl hover:text-violet-700'>
              Job<span className='text-violet-300 hover:text-violet-700'>Finder</span>
            </Link>
          </div>

          <ul className='hidden lg:flex gap-10 text-base'>
            <li className='text-gray-400 text-lg font-bold hover:text-violet-700'>
              <Link to="/">Find Job</Link>
            </li>

            <li className='text-gray-400 text-lg font-bold hover:text-violet-700'>
              <Link to="/companies">Companies</Link>
            </li>

            <li className='text-gray-400 text-lg font-bold hover:text-violet-700'>
              <Link to="/upload-job">UploadJob</Link>
            </li>

            <li className='text-gray-400 text-lg font-bold hover:text-violet-700'>
              <Link to="/about-us">About</Link>
            </li>
          </ul>

          {/* small menu that appear after user login */}
          <div className=' hidden lg:block'>
            {
              !user?.token ? (
                <Link to="/user-auth">
                  <CustomButton title="Sign In"
                    containerStyles='text-pink-600 py-1.5 px-5 focus:outline-none text-2xl hover:bg-blue-700 hover:text-white rounded-full text-base border border-purple-600'
                  />
                </Link>
              ) : (
                <div>
                  <MenuList user={user} />
                </div>
              )
            }
          </div>
          <button
            className='block lg:hidden text-orange-200' onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? <AiOutlineClose size={26} /> : <HiMenuAlt3 size={26} />}
          </button>
        </nav>

        {/* Mobile menu */}
        <div className={
          `${isOpen ? "absolute flex bg-fuchsia-300"
            : "hidden"} container  lg:hidden flex-col pl-8 gap-1 py-5`
        }>
          <Link to='/' onClick={handleCloseNavbar}>
            Find Job
          </Link>
          <Link to='/companies' onClick={handleCloseNavbar}>
            Companies
          </Link>
          <Link
            onClick={handleCloseNavbar}
            to={
              user?.accountType === "seeker" ? "Applications" : "Upload Job"
            }
          >
            {user?.accountType === "seeker" ? "Applications" : "Upload Job"}
          </Link>

          <Link to='/about-us' onClick={handleCloseNavbar}>
            About
          </Link>
          <div className='w-full py-10'>
            {!user?.token ? (
              <a href='/user-auth'>
                <CustomButton
                  title="Sign In"
                  containerStyles={'text-pink-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-purple-600'}
                />
              </a>
            ) : (
              <div>
                <MenuList user={user} onClick={handleCloseNavbar} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
