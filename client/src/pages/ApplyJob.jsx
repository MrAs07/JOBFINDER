import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CustomButton, TextInput, Loading } from "../components";
import { apiRequest } from "../utils";

import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const ApplyJob = () => {
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { jobId } = useParams();  // Get jobId from the route

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const newData = {
      jobId: jobId,
      ...data,
    };

    setIsLoading(true);  // Start loading
    setErrMsg("");  // Clear previous error messages
    setSuccessMsg("");  // Clear previous success messages

    try {
      const res = await apiRequest({
        url: `/applications/apply/${jobId}`,
        token: user?.token,  
        data: newData,
        method: "POST",
      });

      if (res?.status === undefined || res?.status === "failed") {
        setIsLoading(false);
        setErrMsg(res.message);  // Set error message if request fails
        toast.error(res.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } 
      else if (res?.success === true) {
        setIsLoading(false);
        setErrMsg("");
        setSuccessMsg("Application submitted successfully!");  // Set success message
        toast.success("Application submitted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setErrMsg("Failed to submit application. Try again later.");  // Set generic error message on catch
      toast.error("Failed to submit application. Try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="container mx-auto p-5 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold">Apply for Job</h2>

      {successMsg && <p className="text-green-300">{successMsg}</p>}  {/* Show success message */}

      {errMsg && <p className="text-red-500">{errMsg}</p>}  {/* Show error message */}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
        <TextInput
          name="coverLetter"
          label="Cover Letter"
          placeholder="Write your cover letter here"
          type="textarea"
          register={register("coverLetter", { required: "Cover Letter is required" })}
          error={errors.coverLetter?.message}
        />

        <TextInput
          name="resumeUrl"
          label="Resume URL"
          placeholder="Link to your resume"
          type="url"
          register={register("resumeUrl", { required: "Resume URL is required" })}
          error={errors.resumeUrl?.message}
        />

        {isLoading ? (
          <Loading />
        ) : (
          <CustomButton
            type="submit"
            containerStyles="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-8 py-2 text-sm font-medium text-white hover:bg-[#1d4fd846] hover:text-[#1d4fd8] focus:outline-none"
            title="Submit Application"
          />
        )}
      </form>

      <ToastContainer />
    </div>
  );
};

export default ApplyJob;
