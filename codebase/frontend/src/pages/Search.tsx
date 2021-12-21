import React from "react";
import { useEffect, useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import Joblisting from "../types/Joblisting";
import { useAuth } from "../context/AuthContext";
import JobListings from "../components/JobListings";
import getjobsappliedlist from "./getjobsappliedlist";

const filterListingLoc = (joblistings: Joblisting[], query: any) => {
  if (!query) {
    return joblistings;
  }

  return joblistings.filter((joblisting: Joblisting) => {
    const jobLoc = joblisting.job_location.toLowerCase();
    const locs = query.toLowerCase().split(/[ ,]+/);
    return locs.some((x: string) => jobLoc.includes(x));
  });
};

const filterListingKeywords = (joblistings: Joblisting[], query: any) => {
  if (!query) {
    return joblistings;
  }

  return joblistings.filter((joblisting: Joblisting) => {
    const jobDesc = joblisting.job_description.toLowerCase();
    const jobTitle = joblisting.job_title.toLowerCase();
    const keywords = query.toLowerCase().split(/[ ,]+/);
    return (
      keywords.some((x: string) => jobDesc.includes(x)) ||
      keywords.some((x: string) => jobTitle.includes(x))
    );
  });
};
//Loading job listings
const Search = () => {
  //Aquire state and search parameters
  const [isLoading, setIsLoading] = useState(true);
  const { search } = window.location;
  const params = new URLSearchParams(search);
  //Checking auth/login
  const auth = useAuth();
  const authToken = auth.getAuthData().authToken;
  const authData = auth.getAuthData().authData;
  //Acquire Job listings

  const [joblistings, setListings] = useState<Joblisting[]>([]);

  useEffect(() => {
    const getAllJoblistings = async (setIsLoading: any, setlistings: any) => {
      var job_list = await getjobsappliedlist(authData);
      return axios
        .get(`${process.env.REACT_APP_API_URL}/api/joblistings`)
        .then((res) => {
          setIsLoading(false);
          const listing_list = [] as Joblisting[];
          for (const listing of res.data) {
            if (job_list.length !== 0 && job_list[0] !== -1) {
              if (job_list.includes(listing.listing_id)) {
                continue;
              }
            }
            listing_list.push({
              listing_id: listing.listing_id,
              employer_id: listing.employer_id,
              job_description: listing.job_description,
              job_location: listing.job_location,
              job_title: listing.job_title,
              date_posted: listing.date_posted,
              contact_name: listing.contact_name,
              contact_title: listing.contact_title,
              contact_address: listing.contact_address,
              number_applied: listing.number_applied,
              metadata: listing.metadata,
            });
          }
          setlistings(listing_list);
        });
    };
    if (isLoading) {
      getAllJoblistings(setIsLoading, setListings).then(() => {
        setIsLoading(false);
      });
    }
  }, [isLoading, authData]);

  let filteredListings = joblistings;
  //Filtering Location
  const locParam = params.get("location");
  const [searchLocQuery] = useState(locParam || "");
  if (searchLocQuery !== "") {
    filteredListings = filterListingLoc(filteredListings, searchLocQuery);
  }
  //Filtering Keywords
  const wordParam = params.get("keywords");
  const [searchWordQuery] = useState(wordParam || "");
  if (searchWordQuery !== "") {
    filteredListings = filterListingKeywords(filteredListings, searchWordQuery);
  }
  return (
    <div className="px-8 h-full min-h-screen bg-gray-100">
      <header></header>
      <main className="md:p-8 top-0">
        {authToken && authData ? (
          <>
            <div className="flex items-center bg-tiffany-blue opacity-75 text-white text-sm font-bold px-4 py-3 rounded-sm">
              <svg className="fill-current w-4 h-4 mr-2" stroke="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
              <p className="text-2xl">
                Hi There {JSON.parse(authData).payload.firstName}{" "}
                {JSON.parse(authData).payload.lastName}! Excited to find your next workplace?
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center bg-tiffany-blue opacity-75 text-white text-sm font-bold px-4 py-3 rounded-sm" role="alert">
            <svg className="fill-current w-4 h-4 mr-2" stroke="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" /></svg>
            <p>Please sign in or create an account to use auto search features!</p>
          </div>
        )}
        <SearchBar />
        <JobListings jobs={filteredListings} applied={false} />
      </main>
    </div>
  );
};

export default Search;
