import React from "react";
import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import JobseekerProfile from "../types/JobseekerProfile";
import Seeker from "../components/Seeker";
import axios from "axios";
import ProfileSearchBar from "../components/ProfileSearchBar";
import { useAuth } from "../context/AuthContext";
import { Carousel } from "react-responsive-carousel";
import { useWindowSize } from "@react-hook/window-size/throttled";
const filterSeekerSkills = (seekers: JobseekerProfile[], query: any) => {
  if (!query) {
    return seekers;
  }

  return seekers.filter((seeker: JobseekerProfile) => {
    const lower = seeker.skills.map((skill) => skill.toLowerCase());
    const keywords = query.toLowerCase().split(/[ ,]+/);
    return keywords.some((x: string) => lower.includes(x));
  });
};

const SearchProfiles = () => {
  const [width] = useWindowSize({ fps: 0 });
  //Aquire state and search parameters
  const [isLoading, setIsLoading] = useState(true);
  const { search } = window.location;
  const params = new URLSearchParams(search);
  const [Seekers, setSeekers] = useState<JobseekerProfile[]>([]);
  //Checking auth/login
  const auth = useAuth();
  const authToken = auth.getAuthData().authToken;
  const authData = auth.getAuthData().authData;

  useEffect(() => {
    const getAllJoblistings = async (setIsLoading: any, setlistings: any) => {
      return axios
        .get(`${process.env.REACT_APP_API_URL}/api/allseekerprofiles`)
        .then((res) => {
          setIsLoading(false);
          const seeker_list = [] as JobseekerProfile[];
          for (const seeker of res.data) {
            seeker_list.push({
              user: seeker.user,
              profile_picture: seeker.profile_picture,
              email: seeker.email,
              firstName: seeker.firstName,
              lastName: seeker.lastName,
              socials: seeker.socials,
              resumeUrl: seeker.resumeUrl,
              summary: seeker.summary,
              address: seeker.address,
              workExperience: seeker.workExperience,
              education: seeker.education,
              skills: seeker.skills,
              metadata: seeker.metadata,
            });
          }
          setlistings(seeker_list);
        });
    };
    if (isLoading) {
      getAllJoblistings(setIsLoading, setSeekers).then(() => {
        setIsLoading(false);
      });
    }
  }, [isLoading]);
  let filteredSeekers = Seekers;
  const wordParam = params.get("skills");
  const [searchWordQuery] = useState(wordParam || "");
  if (searchWordQuery !== "") {
    filteredSeekers = filterSeekerSkills(filteredSeekers, searchWordQuery);
  }
  const listSeekers = filteredSeekers.map((s) => {
    return <Seeker seeker={s} />;
  });
  return (
    <div className="px-8 h-full min-h-screen bg-gray-100">
      <header></header>
      <main className="p-8 top-0">
        {authToken && authData ? (
          <>
            <div className="flex items-center bg-tiffany-blue opacity-75 text-white text-sm font-bold px-4 py-3 rounded-sm">
              <svg
                className="fill-current w-4 h-4 mr-2"
                stroke="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                ></path>
              </svg>
              <p className="text-2xl">
                Let's help you find your next qualified member of the team!
              </p>
            </div>
          </>
        ) : (
          <div
            className="flex items-center bg-tiffany-blue opacity-75 text-white text-sm font-bold px-4 py-3 rounded-sm"
            role="alert"
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              stroke="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
            </svg>
            <p>Please sign in or create an account to use these features.</p>
          </div>
        )}
        <ProfileSearchBar />
        {filteredSeekers ? (
          width < 1024 ? (
            <Carousel showIndicators={false} showThumbs={false}>
              {listSeekers}
            </Carousel>
          ) : (
            <div>{listSeekers}</div>
          )
        ) : (
          <>None matching criteria found.</>
        )}
      </main>
    </div>
  );
};

export default SearchProfiles;
