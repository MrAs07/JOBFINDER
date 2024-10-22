import axios from "axios";
const API_URL ="http://localhost:8800/api-v1/";

export const API = axios.create({
    baseURL: API_URL,
    responseType : "json",

})

export const apiRequest = async({url, token, data, method}) =>{
    try{
        const result = await API(url,{
            method:method,
            data:data,
            headers:{
                "Content-Type":"application/json",
            Authorization: token ? `Bearer ${token}`:"",
        }
    });
    return result?.data;
    }
    catch(error){
        const err= error.response.data;
        console.log(err);
        return {
            status :err.success, message:err.message
        };
    }
}

export  const handleFileUpload = async(uploadFile) =>{
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset","jobfinder")

    // Add transformation parameters for compression
    // formData.append("transformation", JSON.stringify({
    //     quality: "auto",  // Automatically adjust quality
    //     fetch_format: "auto",  // Automatically select optimal format (e.g., WebP)
    //     width: 400,  // Optional resizing (width of 800px)
    //     crop: "scale"  // Resize without cropping
    // }));

    try{
        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/deuydr6b9/image/upload",
            formData,{
                 // Optionally, add timeout
                timeout : 20000,
            }
        );
         // Ensure response and data are properly checked
         if (response && response.data && response.data.secure_url) {
            return response.data.secure_url;
        } else {
            throw new Error('Failed to upload file, response format is invalid');
        }
        
    }
    catch(error){
        const err = error.response?.data || error.message;
        console.log('Upload error:', err);
        return {
            status: 'failed',
            message: err
        };
    }
}

export const updateURL = ({
    pageNum,
    query,
    cmpLoc,
    sort,
    navigate,
    location,
    jType,
    exp
}) => {
    const params = new URLSearchParams();

    // Log the parameters being set
    console.log("Updating URL with params:");
    console.log("PageNum:", pageNum);
    console.log("Query:", query);
    console.log("Location:", cmpLoc);
    console.log("Sort:", sort);
    console.log("Job Types:", jType);
    console.log("Experience:", exp);

    if (pageNum && pageNum > 1) {
        params.set("page", pageNum);
    }
    if (query) {
        params.set("query", query);
    }
    if (cmpLoc) {
        params.set("location", cmpLoc);
    }
    if (sort) {
        params.set("sort", sort);
    }
    if (jType && jType.length > 0) {
        params.set("jType", jType.join(",")); // Join array into a comma-separated string
    }
    if (exp && exp.trim() !== "") {
        params.set("exp", exp);
    }

    const newURL = `${location.pathname}?${params.toString()}`;
    console.log("Constructed URL:", newURL); // Log the constructed URL
    navigate(newURL, { replace: true });

    return newURL;
};

