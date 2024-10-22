import { useState } from "react";
import { BsChevronExpand } from "react-icons/bs";

const types = ["Full-Time", "Part-Time", "Contract", "Intern"];

export default function JobTypes({ jobTitle, setJobTitle }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type) => {
    setJobTitle(type);  // Update the state
    setIsOpen(false);   // Close dropdown after selection
  };

  return (
    <div className="w-full">
      <div className="relative">
        <button
          type="button"
          className="relative w-full cursor-default rounded bg-white py-2.5 pl-3 pr-10 text-left focus:outline-none border border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="block truncate">{jobTitle}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <BsChevronExpand className="h-5 w-5 text-gray-500" aria-hidden="true" />
          </span>
        </button>
        {isOpen && (
          <ul className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {types.map((type, index) => (
              <li
                key={index}
                className={`cursor-pointer select-none py-2 pl-10 pr-4 ${
                  jobTitle === type ? "bg-amber-100 text-amber-900" : "text-gray-900"
                }`}
                onClick={() => handleSelect(type)}
              >
                <span className={`block truncate ${jobTitle === type ? "font-medium" : "font-normal"}`}>
                  {type}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
