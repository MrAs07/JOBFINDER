import React, { useState } from 'react'
import { BiBriefcaseAlt2 } from 'react-icons/bi';
import { BsStars } from "react-icons/bs";
import {MdOutlineKeyboardArrowDown} from "react-icons/md"
import { useLocation, useNavigate } from 'react-router-dom';
import { Header, JobCard, ListBox } from '../components';
import { experience, jobs, jobTypes } from '../utils/data';

const FindJobs = () => {

  const [sort, setSort] = useState("Newest");
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [filterJobTypes, setFilterJobTypes] = useState([]);
  const [filterExp, setFilterExp] = useState([]);

  const [isFetching, setIsFetching] = useState(false);
  const location = useLocation(false);
  const navigate = useNavigate();

  const filterJobs = (value) =>{
    if(filterJobTypes?.includes(value)){
      setFilterJobTypes(filterJobTypes.filter((el)=> el != value));
    }
    else{
      setFilterJobTypes([...filterJobTypes,value]);
    }
  }

  const filterExperience = async(e) =>{
    setFilterExp(e);
  }
  console.log(filterExp);
  // console.log(filterJobTypes);
  return (
    <div>
      <Header
        title="Find Your Dream Jobs with ease"
        type="home"
        handleClick={() => { }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={jobLocation}
        setLocation={setJobLocation}
      />

      <div className="container mx-auto flex gap-6 2xl:gap-10 md:px-5 py-0 md:py-6 ">
        <div className="hidden md:flex flex-col w-1/6 h-fit shadow-sm">
          <p className='text-lg font-semibold text-slate-200'>
            Filter Search
            </p>

            <div className='py-2 text-slate-200'>
              <div className='flex justify-between mb-3 bg-sky-950'>
                <p className='flex items-center gap-2 font-semibold'>
                  <BiBriefcaseAlt2 />
                  Job Type
                </p>

                <button>
                  <MdOutlineKeyboardArrowDown/>
                </button>

              </div>
              <div className='flex flex-col gap-2'>
                {jobTypes.map((jtype,index)=>(
                  <div 
                  key={index} 
                  className='flex items-center gap-2 bg-slate-800 md:text-base'
                  >
                  <input
                  type="checkbox"
                  value= {jtype}
                  className ="w-4 h-4"
                  onChange={(e)=>filterJobs(e.target.value)}
                  />
                  <span>{jtype}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='py-2 mt-4 text-slate-200'>
            <div className='flex justify-between mb-3 '>
                  <p className='flex items-center gap-2 font-semibold'>
                    <BsStars/>
                    Experience
                  </p>

                  <button>
                    <MdOutlineKeyboardArrowDown/>
                  </button>
            </div>

            <div className='flex flex-col gap-2 '>
              {experience.map((exp)=>(
                <div key ={exp.title} className="flex gap-3 bg-sky-950">
                  <input
                    type="checkbox"
                    value ={exp?.title}
                    className = "w-4 h-4"
                    onChange={(e)=> filterExperience(e.target.value)} 
                  />
                  <span>{exp.title}</span>
                </div>
              ))}
            </div>

            </div>

        </div>

        <div className=' w-full md:w-5/6 px-5 md:px-0'>
                <div className='flex items-centre justify-between mb-4'>
                    <p className='text-sm md:text-base'>
                      Showing: <span className='font-semibold'>1,902</span>
                      Jobs
                      Available
                    </p>

                    <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
                      <p className='text-sm md:text-base'>
                        Sort By:
                      </p>
                      <ListBox sort={sort} setSort={setSort}/>
                    </div>
                </div>

            <div className='w-full flex flex-wrap gap-4 text-white'>
                {jobs.map((job,index)=>(
                  <JobCard job ={job} key= {index}/>
                ))}
            </div>


            {numPage > page && !isFetching && (
            <div className='w-full flex items-center justify-center pt-16 text-white'>
              <CustomButton
                title='Load More'
                containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
              />
            </div>
          )}
            
        </div>        
      </div>
    </div>
  )
}

export default FindJobs
