// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { apiRequest } from "../utils"; // Assuming this utility is used for API requests
// import { Loading, JobCard, CustomButton } from "../components"; // Assuming you have components for job card, button, and loading spinner

// const Application = () => {
//   const { user } = useSelector((state) => state.user);
//   const [applications, setApplications] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const fetchApplications = async () => {
//     setIsLoading(true);
//     try {
//       const res = await apiRequest({
//         url: "/applications/my-applications", // Backend route to fetch user's applications
//         token: user?.token,
//         method: "GET",
//       });
//       setApplications(res.data);
//     } catch (error) {
//       console.error("Failed to fetch applications:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

// //   useEffect(() => {
// //     fetchApplications();
// //   }, []);

//   return (
//     <div className="container mx-auto p-5">
//       <h2 className="text-2xl font-semibold text-gray-800">My Job Applications</h2>
//       {isLoading ? (
//         <Loading />
//       ) : (
//         <div className="flex flex-col gap-5">
//           {applications?.length > 0 ? (
//             applications.map((application) => (
//               <JobCard
//                 key={application._id}
//                 job={{
//                   jobTitle: application.jobId.jobTitle,
//                   company: application.jobId.company,
//                   status: application.status, // assuming you have a status field in the application
//                   appliedAt: application.createdAt, // assuming createdAt tracks application time
//                 }}
//               />
//             ))
//           ) : (
//             <p className="text-gray-600">You have not applied to any jobs yet.</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Application;

import React, { useState, useEffect } from "react";
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { apiRequest } from '../utils';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Application = () => {
  const { user } = useSelector((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // Fetch user applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await apiRequest({
          url: `/applications/user-logged`, // API route to get user applications
          token: user?.token,
          method: 'GET',
        });
        console.log(response)
        
        if (response?.success) {
          setApplications(response.data);
          toast.success("Applications loaded successfully!");
        } else {
          setErrMsg("Failed to load applications");
          toast.error("Failed to load applications");
        }
      } catch (error) {
        setErrMsg("An error occurred while fetching applications.");
        toast.error("An error occurred while fetching applications.");
      }
      setIsLoading(false);
    };

    fetchApplications();
  }, [user?._id, user?.token]);

  if (isLoading) {
    toast.info("Loading applications...");
    return <p>Loading...</p>;
  }

  if (errMsg) {
    return <p>{errMsg}</p>;
  }

  return (
    <div className="w-full px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Your Applications</h2>
      {applications.length > 0 ? (
        <div className="w-full max-w-md p-2 mx-auto bg-white rounded-2xl shadow-md">
          {applications.map((application) => (
            <Disclosure key={application._id}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left my-1 text-blue-900 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                    <span>{application?.job?.jobTitle} at {application?.job?.company?.name}</span>
                    <ChevronUpIcon
                      className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-blue-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 ">
                    <p className="m-1"><strong>Location:</strong> {application.job.location}</p>
                    <p className="m-1"><strong>Salary:</strong> ${application.job.salary}</p>
                    <p className="m-1"><strong>Status:</strong> {application.status}</p>
                    <p className="m-1"><strong>Cover Letter:</strong> {application.coverLetter}</p>
                    <p className="m-1"><strong>Resume:</strong> <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer"><span className="text-blue-500">
                    {application.resumeUrl}
                    </span>
                    </a></p>
                    <p className="m-1"><strong>Applied At:</strong> {new Date(application.appliedAt).toLocaleDateString()}</p>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      ) : (
        <p>You have not applied for any jobs yet.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default Application;

