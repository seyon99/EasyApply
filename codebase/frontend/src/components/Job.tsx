import React from "react";
import "tailwindcss/tailwind.css";
import Joblisting from "../types/Joblisting";

interface JobPosting {
  job: Joblisting;
  setMoreDetails: Function;
  moreDetails: Number;
}

const Job = (props: JobPosting) => {
  return (
    <div
      onClick={() => props.setMoreDetails(props.job.listing_id)}
      className="rounded hover:border-black border-2"
    >
      <div className="p-8 text-gray-900 leading-normal bg-white border rounded">
        <img
          className="object-scale-down h-9 place-items-start"
          alt="sample logo"
          src="https://images.theconversation.com/files/93616/original/image-20150902-6700-t2axrz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip"
        ></img>
        <span className="text-2xl text-left font-bold">
          {props?.job.job_title}
        </span>
        <div className="text-xl">{props?.job.employer_id}</div>

        <section>{props?.job.job_location}</section>
        <section className=" font-extralight">
          - {props?.job.job_description}
        </section>
      </div>
    </div>
  );
};

export default Job;
