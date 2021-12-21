
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import Joblisting from '../types/Joblisting';
import getjobsappliedlist from './getjobsappliedlist';
import JobListings from '../components/JobListings';

function Jobsapplied() {
  const auth = useAuth();
  const authToken = auth.getAuthData().authToken;
  const authData = auth.getAuthData().authData;


  const [isLoading, setIsLoading] = useState(true);
  const [applied, setApplied] = useState<Joblisting[]>([]);

  useEffect(() => {


    const getJobsapplied = async (setIsLoading: any, setApplied: React.Dispatch<React.SetStateAction<Joblisting[]>>) => {
      const listing_list = [] as Joblisting[]
      var job_list = await getjobsappliedlist(authData);
      await axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/joblistings/`
        )
        .then((res) => {
          setIsLoading(false);
          for (const listing of res.data) {
            if (job_list.length !== 0 && job_list[0] !== -1) {
              
              if (job_list.includes(listing.listing_id)) {
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
            }
          }
        }); await setApplied(listing_list)




    }

    if (isLoading && authData) {


      getJobsapplied(setIsLoading, setApplied).then(() => {
        setIsLoading(false);
      });


    }




  }, [isLoading, authData, applied]);



  return (
    <div>
      {authToken && authData ?
        <div className="px-8 h-full min-h-screen bg-gray-100">
          <JobListings jobs={applied} applied={true} />


        </div>
        :
        <></>
      }


    </div>
  );
}

export default Jobsapplied
