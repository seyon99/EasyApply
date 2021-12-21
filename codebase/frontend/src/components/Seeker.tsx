import React from "react";
import "tailwindcss/tailwind.css";
import JobseekerProfile from "../types/JobseekerProfile";
import Job from "../types/WorkExperience";
import PillButton from "./PillButton";
import { FaUserCircle, FaRegEnvelope } from "react-icons/fa";

interface jobseeker {
  seeker: JobseekerProfile;
}

const Seeker = (props: jobseeker) => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-x-20 p-8 text-gray-900 leading-normal bg-white border rounded">
        <div className="flex md:flex-shrink-0 w-1/3 flex-col items-center justify-center text-center gap-x-2">
          <FaUserCircle className="p-2 rounded-full bg-white w-32 h-32" />{" "}
          <div>
            <p className="text-2xl text-tiffany-blue font-semibold">
              {props?.seeker.firstName + " " + props?.seeker.lastName}
            </p>
            <div className="text-xl">
              <p className="inline">{props?.seeker.email}</p>
              <a href={"mailto:" + props?.seeker.email}>
                <FaRegEnvelope className="inline mx-4 text-tiffany-blue" />
              </a>
            </div>
            <p>{props?.seeker.address}</p>
          </div>
        </div>

        <section className="flex flex-auto flex-col items-center justify-center text-center">
          <div className="my-4">
            <p className="text-xl text-tiffany-blue font-bold">Summary</p>
            <p className="text-lg pt-2">{props?.seeker.summary}</p>
          </div>
          <div className="my-4 md:w-2/3">
            <p className="text-xl text-tiffany-blue font-bold">Skills</p>
            <div className="flex flex-row pt-4 md:overflow-x-auto md:w-auto">
              {props?.seeker.skills.map((skill) => (
                <div key={skill} className="mx-4 mb-4">
                  <PillButton
                    children={skill}
                    type="button"
                    disabled={true}
                    className="bg-tiffany-blue opacity-75"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="my-4">
            <p className="text-xl text-tiffany-blue font-bold">
              Work Experiences
            </p>
            <div className="flex flex-row w-full flex-wrap overflow-auto">
              {props?.seeker.workExperience.map((job: Job) => (
                <div
                  key={JSON.stringify(job)}
                  className="mx-4 mb-4 p-2 border-2 border-opacity-25 rounded-md shadow-sm flex flex-col"
                >
                  <div className="flex items-center">
                    <div className="left rounded-full bg-tiffany-blue opacity-50 w-16 h-16"></div>
                    <div className="left p-4">
                      <p className="my-0 text-tiffany-blue">{job.title}</p>
                      <p className="my-0">
                        {job.company} <br />
                        {job.start} - {job.end}
                        <br />
                        {job.location}
                      </p>
                    </div>
                  </div>
                  <p className="my-0 self-center">{job.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Seeker;
