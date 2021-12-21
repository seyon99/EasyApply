import axios from "axios";
import React, { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import { useAuth } from "../context/AuthContext";
import JobseekerProfile from "../types/JobseekerProfile";

const SearchBar = () => {
  const [isLoadingp, profIsLoading] = useState(true);
  //Checking auth/login
  const auth = useAuth();
  const authData = auth.getAuthData().authData;
  const signedIn = auth.getAuthData().authToken.length > 0;
  let authEmail: null = null;
  if (signedIn) {
    authEmail = JSON.parse(authData).payload.email;
  }
  //Loading Profile data

  const [profileData, setprofdata] = useState<JobseekerProfile[]>([]);

  useEffect(() => {
    const getProfileData = async (profIsLoading: any, setProfileData: any) => {
      return axios
        .get(`${process.env.REACT_APP_API_URL}/api/jobseekerprofile`, {
          params: { email: authEmail },
        })
        .then((res) => {
          profIsLoading(false);
          const profileData = [] as JobseekerProfile[];
          for (const data of res.data) {
            profileData.push({
              user: data.user,
              profile_picture: data.profile_picture,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              socials: data.socials,
              resumeUrl: data.resumeUrl,
              summary: data.summary,
              address: data.address,
              workExperience: data.workExperience,
              education: data.education,
              skills: data.skills,
              metadata: data.metadata
            });
          }
          setProfileData(profileData);
        });
    };
    if (isLoadingp) {
      getProfileData(profIsLoading, setprofdata).then(() => {
        profIsLoading(false);
      });
    }
  }, [authEmail, isLoadingp]);

  let profLoc = "";
  let profSkills = "";
  if (profileData[0]) {
    profLoc = profileData[0].address;
    profSkills = profileData[0].skills.toString();
  }
  return (
    <div>
      <form
        className="bg-white flex flex-row items-center rounded-sm w-full"
        method="get"
      >
        <input
          className="rounded-l-auto w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
          id="ser-keywords"
          type="text"
          placeholder="Keywords (Software Developer, Python, Marketing, etc.)"
          name="keywords"
        ></input>
        <input
          className="rounded-l-auto w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none"
          id="ser-location"
          type="text"
          placeholder="Location (Toronto, Ottawa, etc.)"
          name="location"
        ></input>
        <div className="p-4">
          <button
            className="bg-tiffany-blue text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center"
            type="submit"
          >
            Go
          </button>
        </div>
      </form>
      {signedIn ? (
        <div className="flex flex-row w-full bg-gray-100">
          <form method="get"
            className="flex-grow p-1">
            <input
              id="ser-keywords-auto"
              type="hidden"
              name="keywords"
              value={profSkills}
            ></input>
            <input
              id="ser-location-auto"
              type="hidden"
              name="location"
              value={profLoc}
            ></input>
            <button
              className="bg-tiffany-blue text-white rounded-sm p-1 hover:bg-blue-400 focus:outline-none w-full h-8 items-center justify-center"
              type="submit"
            >
              Auto All
            </button>
          </form>
          <form method="get"
            className="flex-grow p-1">
            <input
              id="ser-keywords-auto"
              type="hidden"
              name="keywords"
              value={profSkills}
            ></input>
            <button
              className="bg-tiffany-blue text-white rounded-sm p-1 hover:bg-blue-400 focus:outline-none w-full h-8 items-center justify-center"
              type="submit"
            >
              Auto Skills
            </button>
          </form>
          <form method="get"
            className="flex-grow p-1">
            <input
              id="ser-location-auto"
              type="hidden"
              name="location"
              value={profLoc}
            ></input>
            <button
              className="bg-tiffany-blue text-white rounded-sm p-1 hover:bg-blue-400 focus:outline-none w-full h-8 items-center justify-center"
              type="submit"
            >
              Auto Location
            </button>
          </form>
        </div>
      ) : (
        <>
        </>)}
    </div>
  );
};

export default SearchBar;
