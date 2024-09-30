import { useSelector } from "react-redux";
import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Footer, Navbar } from "./components";
import { About, AuthPage, Companies, CompanyProfile, FindJobs, JobDetail, UploadJob, UserProfile } from "./pages";

function Layout() {
  const {user} = useSelector((state)=> state.user);
  console.log(user)
  const location = useLocation();

  // if user is loggedin then we send into desired page that user want otherwise it can send to login page

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="user-auth" state={{ from: location }} replace />
  );
}
function App() {
  const user ={};
  return (
    <main className="">
      <Navbar />
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Navigate to="/find-jobs" replace={true} />}
          />
          <Route
            path="/find-jobs" 
            element={<FindJobs/>} />
          <Route
            path="/companies" 
            element={<Companies />} />
          <Route
            path={
              user?.user?.accountType === "seeker"
                ? "/user-profile"
                : "/user-profile/:id"
            }
            element={<UserProfile />}
          />
          <Route
            path={"/company-profile"}
            element={<CompanyProfile />}
            />
          <Route
            path={"/company-profile/:id"}
            element={<CompanyProfile />}
            />
          <Route
            path={"/upload-job"}
            element={<UploadJob />}
            />
          <Route
            path={"/job-detail/:id"}
            element={<JobDetail />}
            />
          

        </Route>

        {/* if user not logged in still it can these routes write down below */}
        <Route
          path = "/about-us"
          element = {<About/>}
        />
        <Route
        path = "/user-auth"
        element = {<AuthPage />}
        />
      </Routes>
       {user && <Footer />}
       {/* // Footer will be rendered if user is truthy */}
       
      
    </main>
  );
}

export default App;
