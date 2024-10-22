import React, { useEffect, useState } from 'react';
import { BiBriefcaseAlt2 } from 'react-icons/bi';
import { BsStars } from "react-icons/bs";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { Header, JobCard, ListBox, Loading, CustomButton } from '../components';
import { apiRequest, updateURL } from '../utils';
import { experience, jobTypes } from '../utils/data';

const FindJobs = () => {
  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]); // Store selected job types
  const [filterExp, setFilterExp] = useState("");
  const [expVal, setExpVal] = useState([]);

  const [isFetching, setIsFetching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setIsFetching(true);

    // Log the current filter values
    // console.log("Current Filters:");
    // console.log("Sort:", sort);
    // console.log("Search Query:", searchQuery);
    // console.log("Job Location:", jobLocation);
    // console.log("Filter Job Types:", filterJobTypes);
    // console.log("Filter Experience:", filterExp);

    const newURL = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: jobLocation,
      sort: sort,
      navigate: navigate,
      location: location,
      jType: filterJobTypes, // Pass selected job types
      exp: filterExp, // Pass the experience range
    });

    try {
      const res = await apiRequest({
        url: "/jobs" + newURL,
        method: "GET",
      });
      // console.log(res);
      setNumPage(res?.numOfPage);
      setRecordCount(res?.totalJobs);
      setData(res?.data);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };


  const filterJobs = (value) => {
    if (filterJobTypes.includes(value)) {
      setFilterJobTypes(filterJobTypes.filter((el) => el !== value)); // Remove if already included
    } else {
      setFilterJobTypes([...filterJobTypes, value]); // Add the selected job type
    }
  };


  const filterExperience = (e) => {
    if (expVal.includes(e)) {
      setExpVal(expVal.filter((el) => el !== e)); // Remove if already included
    } else {
      setExpVal([...expVal, e]); // Add the selected experience
    }
  };

  useEffect(() => {
    if (expVal.length > 0) {
      let newExpVal = [];

      expVal.map((el) => {
        const newEl = el.split("-");
        newExpVal.push(Number(newEl[0]), Number(newEl[1]));
      });

      newExpVal.sort((a, b) => a - b);
      setFilterExp(`${newExpVal[0]}-${newExpVal[newExpVal.length - 1]}`); // Set the experience range
    } else {
      setFilterExp(""); // Clear the experience filter when none is selected
    }
  }, [expVal]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchJobs();
  };

  const handleShowMore = async (e) => {
    e.preventDefault();
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (expVal.length > 0) {
      let newExpVal = [];

      expVal.map((el) => {
        const newEl = el.split("-");
        newExpVal.push(Number(newEl[0]), Number(newEl[1]));
      });

      newExpVal.sort((a, b) => a - b);
      setFilterExp(`${newExpVal[0]}-${newExpVal[newExpVal.length - 1]}`); // Set the experience range
    }
  }, [expVal]);

  useEffect(() => {
    fetchJobs(); // Fetch jobs whenever the sorting, job type, experience, or page changes
  }, [sort, filterJobTypes, filterExp, page]);

  return (
    <div>
      <Header
        title="Find Your Dream Jobs With Ease"
        type="home"
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={jobLocation}
        setLocation={setJobLocation}
      />

      <div className="container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 ">
        <div className="hidden md:flex flex-col w-1/6 h-fit shadow-sm">
          <p className='text-lg font-semibold text-slate-200'>Filter Search</p>
          <div className='py-2 text-slate-200'>
            <div className='flex justify-between mb-3 bg-sky-950'>
              <p className='flex items-center gap-2 font-semibold'>
                <BiBriefcaseAlt2 />
                Job Type
              </p>
              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              {jobTypes.map((jtype, index) => (
                <div key={index} className='flex items-center gap-2 bg-slate-800 md:text-base'>
                  <input
                    type="checkbox"
                    value={jtype}
                    className="w-4 h-4"
                    onChange={(e) => filterJobs(e.target.value)}
                  />
                  <span>{jtype}</span>
                </div>
              ))}
            </div>
          </div>

          <div className='py-2 mt-4 text-slate-200'>
            <div className='flex justify-between mb-3 '>
              <p className='flex items-center gap-2 font-semibold'>
                <BsStars />
                Experience
              </p>
              <button>
                <MdOutlineKeyboardArrowDown />
              </button>
            </div>

            <div className='flex flex-col gap-2 '>
              {experience.map((exp) => (
                <div key={exp.title} className="flex gap-3 bg-sky-950">
                  <input
                    type="checkbox"
                    value={exp?.value}
                    className="w-4 h-4"
                    onChange={(e) => filterExperience(e.target.value)}
                  />
                  <span>{exp.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='w-full md:w-5/6 px-5 md:px-0'>
          <div className='flex items-center justify-between mb-4'>
            <p
              className="text-3xl md:text-4xl font-semibold cursor-pointer text-gray-200"
            >
              Showing:{" "}
              <span
                className="text-4xl font-bold text-blue-600"
              >
                {recordCount}{" "}
              </span>
              <span
                className="text-3xl font-semibold underline"
              >
                 Jobs Available
              </span>
            </p>
            <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
              <p className='text-sm md:text-base'>Sort By:</p>
              <ListBox sort={sort} setSort={setSort} />
            </div>
          </div>

          <div className='w-full flex flex-wrap gap-4 text-white'>
            {data?.map((job, index) => {
              const newJob = {
                name: job?.company?.name,
                logo: job?.company?.profileUrl,
                ...job,
              };

              return <JobCard job={newJob} key={index} />;
            })}
          </div>

          {isFetching && (
            <div className='py-10'>
              <Loading />
            </div>
          )}

          {numPage > page && !isFetching && (
            <div className='w-full flex items-center justify-center pt-16 text-white'>
              <CustomButton
                title='Load More'
                onClick={handleShowMore}
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FindJobs;
