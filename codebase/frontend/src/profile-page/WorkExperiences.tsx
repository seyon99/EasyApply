import React, { useEffect, useState } from "react";
import Job from "../types/WorkExperience";
import Section from "./Section";

/**
 * Work Experiences section in profile page
 *
 * @returns JSX.Element content to be displayed
 */
const WorkExperiences = (props) => {
  const [workExperiences, setWorkExperience] = useState<Job[]>([]);

  useEffect(
    () => setWorkExperience(props.workExperiences),
    [props.workExperiences]
  );

  const work_experiences = (
    <div className="flex flex-row w-full flex-wrap overflow-auto">
      {workExperiences &&
        workExperiences.map((job: Job) => (
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
  );
  return (
    <Section
      name="Work Experiences"
      content={work_experiences}
      openEditModal={props.openEditModal}
    />
  );
};

export default WorkExperiences;
