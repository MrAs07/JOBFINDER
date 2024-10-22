import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  // console.log(job)
  return (
    <Link to={`/job-detail/${job?._id}`}>
      <div className="w-full md:w-[16rem] 2xl:w-[18rem] rounded-md px-3 py-5 text-white bg-slate-600">

        <div className="w-full h-full flex flex-col justify-between">
          <div className="flex gap-3">
            <img
              src={job?.logo}
              alt={job?.name}
              className="w-14 h-14" />
          </div>
          <div className="w-full h-16 flex flex-col justify-center">
            <p className="w-ful h-12 flex items-center text-lg font-semibold overflow-hidden leading-5">
              {job?.jobTitle}
            </p>
            <span className='flex gap-2 items-center'>
              <GoLocation className='text-slate-900 text-sm' />
              {job?.location}
            </span>
          </div>
          <div className='py-3 '>
            <p className='text-sm'>
              {job?.detail[0]?.desc?.slice(0, 150) + "..."}
            </p>
          </div>

          <div className='flex items-center justify-between'>
            <p className='bg-[#1d4fd826] text-indigo-400 py-0.5 px-1.5 rounded font-semibold text-sm'>
              {job?.jobType}
            </p>
            <span className='text-gray-500 text-sm'>
              {moment(job?.createdAt).fromNow()}
            </span>
          </div>

        </div>
      </div>
    </Link>
  )
}

export default JobCard
