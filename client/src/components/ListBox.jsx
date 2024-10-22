import React, { useState } from 'react';
import { BsChevronExpand, BsCheck2 } from 'react-icons/bs';

const options = ["Newest", "Oldest", "A-Z", "Z-A"];

const ListBox = ({ sort, setSort }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    setSort(value);  // Update sort state when an option is clicked
    setIsOpen(false);  // Close the dropdown after selection
  };

  return (
    <div className='w-[8rem] md:w-[10rem] relative'>
      <button
        className='w-full bg-white border rounded-lg py-2 px-3 text-left shadow-md focus:outline-none'
        onClick={() => setIsOpen(!isOpen)}  // Toggle dropdown visibility
      >
        <span className='block truncate'>{sort}</span>
        <span className='absolute inset-y-0 right-0 flex items-center pr-2'>
          <BsChevronExpand className='h-5 w-5 text-gray-500' />
        </span>
      </button>

      {isOpen && (
        <ul className='absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg'>
          {options.map((option, index) => (
            <li
              key={index}
              className={`cursor-pointer select-none py-2 px-3 hover:bg-gray-100 ${
                sort === option ? 'bg-gray-200 font-medium' : 'font-normal'
              }`}
              onClick={() => handleOptionClick(option)}  // Call handleOptionClick when an option is clicked
            >
              {sort === option && (
                <span className='inline-block mr-2 text-blue-500'>
                  <BsCheck2 className='inline h-5 w-5' />
                </span>
              )}
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ListBox;
