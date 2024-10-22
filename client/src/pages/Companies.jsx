import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Header, ListBox, CustomButton, CompanyCard, Loading } from "../components";
import { apiRequest, updateURL } from '../utils';
import { companies,experience,jobTypes,jobs } from '../utils/data';


const Companies = () => {
  const [sort, setSort] = useState("Newest");  // Initial state is 'Newest'
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordCount, setRecordCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cmpLocation, setCmpLocation] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setIsFetching(true);

    const newURL = updateURL({
      pageNum: page,
      query: searchQuery,
      cmpLoc: cmpLocation,
      sort: sort,  // Sorting is passed here
      navigate: navigate,
      location: location,
    });

    try {
      const res = await apiRequest({
        url: newURL,
        method: "GET",
      });

      // console.log(res);
      setNumPage(res?.numOfPage);
      setRecordCount(res?.total);
      setData(res?.data);

      setIsFetching(false);

    } catch (error) {
      console.log(error);
    }
  }

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchCompanies();
  };

  const handleShowMore = () => {};

  useEffect(() => {
    fetchCompanies();
  }, [page, sort]);  // Re-fetch companies whenever 'sort' changes

  // Debugging: log sort value whenever it changes
  useEffect(() => {
    // console.log("Current sort value:", sort);
  }, [sort]);

  // console.log("Total records:", recordCount);

  return (
    <div className='w-full'>
      <Header
        title='Find Your Dream Company'
        handleClick={handleSearchSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={cmpLocation}
        setLocation={setCmpLocation}
      />

      <div className='container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 md:px-0 py-6 bg-[#f7fdfd]'>
        <div className='flex items-center justify-between mb-4'>
          <p className='text-sm md:text-base'>
            Showing: <span className='font-semibold'>{recordCount}</span> Companies Available
          </p>

          <div className='flex flex-col md:flex-row gap-0 md:gap-2 md:items-center'>
            <p className='text-sm md:text-base'>Sort By:</p>

            {/* Pass sort and setSort to ListBox */}
            <ListBox sort={sort} setSort={setSort}/>
            {/* <div className='flex flex-col gap-2'>
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
              </div> */}
          </div>
        </div>

        <div className='w-full flex flex-col gap-6'>
          {data?.map((cmp, index) => (
            <CompanyCard cmp={cmp} key={index} />
          ))}

          {isFetching && (
            <div className='mt-10'>
              <Loading />
            </div>
          )}

          <p className='text-sm text-right'>
            {data?.length} records out of {recordCount}
          </p>
        </div>
        {numPage > page && !isFetching && (
          <div className='w-full flex items-center justify-center pt-16'>
            <CustomButton
              onClick={handleShowMore}
              title='Load More'
              containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
