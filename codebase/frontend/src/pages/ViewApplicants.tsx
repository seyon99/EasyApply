import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

/**
 * For recruiters, this component displays a list of applicants for their jobs posted.
 */

type Applicant = {
  _id: string;
  city: string;
  education: [any];
  email: string;
  extra_fields: [any];
  firstName: string;
  lastName: string;
  listing_id: number;
  province: string;
  user_id: string;
  zip: string;
  additionalData: {
    profile: any;
    pitchData: any;
  };
};

const ViewApplicants = () => {
  //const authData = JSON.parse(useAuth().getAuthData().authData || "{ payload: {} }").payload;
  const authToken = useAuth().getAuthData().authToken || "";
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [showVideoUrl, setShowVideoUrl] = useState<string>("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/recruiter/applications`, {
        headers: {
          Authorization: `${authToken}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          const fetched_applicants: Applicant[] = [];
          res.data.applications.forEach((applicant) => {
            fetched_applicants.push(applicant);
          });
          setApplicants(fetched_applicants);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [authToken]);

  return (
    <>
      {showVideoUrl.length > 0 && (
        <div
          style={{
            position: "fixed",
            top: "10%",
            left: "20%",
            right: "20%",
            padding: "40px",
            backgroundColor: "rgb(0, 0, 0, 0.8)",
            zIndex: 9999,
          }}
          className="rounded-lg"
        >
          {/* Close button */}
          <div
            style={{
              position: "absolute",
              top: "5px",
              right: "15px",
              cursor: "pointer",
              zIndex: 10000,
            }}
            className="text-white"
            onClick={() => setShowVideoUrl("")}
          >
            Close
          </div>
          <video controls autoPlay style={{ width: "100%" }}>
            <source src={showVideoUrl} type="video/mp4" />
          </video>
        </div>
      )}
      <div className="pt-8 mx-auto w-full px-4 md:px-0 md:w-1/2">
        {/* Show applicant table (Tailwindcss) */}
        {/* No applicants */}
        {applicants.length === 0 && (
          <div className="text-center">
            <h1 className="text-3xl font-bold">No applicants yet</h1>
            <p className="text-xl">
              You have not yet received any applications.
            </p>
          </div>
        )}
        {applicants.map((applicant) => {
          return (
            <div key={applicant._id} className="py-4 px-6 rounded-md shadow-md">
              <div className="mb-2">
                <h1 className="text-2xl">
                  {applicant.firstName} {applicant.lastName}
                </h1>
              </div>
              <div className="mb-3 rounded-md bg-gray-200 pt-3 pb-5 px-4">
                <h3 className="text-xl mb-2">Quick Info</h3>
                {/* Show contact email */}
                <button
                  className="rounded-sm w-full md:w-auto mt-2 md:mt-0 px-4 py-1 bg-tiffany-blue text-white cursor-pointer"
                  onClick={() => {
                    window.open(`mailto:${applicant.email}`, "_blank");
                  }}
                >
                  Contact email: {applicant.email}
                </button>
                <button className="rounded-sm w-full md:w-auto mt-2 md:mt-0 px-4 py-1 md:ml-2 bg-tiffany-blue text-white cursor-default">
                  Location:{" "}
                  {applicant.city +
                    ", " +
                    applicant.province +
                    ", " +
                    applicant.zip}
                </button>
                {/* Show pitch video modal */}
                {applicant.additionalData.pitchData &&
                  applicant.additionalData.pitchData.videoUrl && (
                    <button
                      className="rounded-sm w-full md:w-auto mt-2 md:mt-0 px-4 py-1 md:ml-2 bg-tiffany-blue text-white cursor-pointer"
                      onClick={(e) => {
                        setShowVideoUrl(
                          applicant.additionalData.pitchData.videoUrl
                        );
                      }}
                    >
                      View pitch video
                    </button>
                  )}
              </div>
              {/* Show applicant's summary */}
              <div className="mb-3 rounded-sm bg-gray-200 pt-3 pb-4 px-4">
                <h3 className="text-xl mb-2">Summary</h3>
                {applicant.additionalData.profile.summary && (
                  <pre
                    className="text-sm bg-gray-300 px-2 py-1 rounded-md"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      maxHeight: "100px",
                      overflow: "auto",
                    }}
                  >
                    {applicant.additionalData.profile.summary}
                  </pre>
                )}
              </div>
              {/* Show extended actions: Accept, Reject, Quick Message */}
              <div className="mb-3 rounded-md bg-gray-200 pt-3 pb-4 px-4">
                <h3 className="text-xl mb-2">Actions</h3>
                <Link
                  to={`/messages/start/${applicant.user_id}`}
                  className="rounded-sm bg-tiffany-blue hover:bg-blue-400 text-white px-3 py-1"
                >
                  Quick message
                </Link>
                {/* Show 'more info' button */}
                <Link
                  className="rounded-sm bg-tiffany-blue hover:bg-blue-400 text-white px-3 py-1 cursor-pointer ml-2"
                  to={`/my_applicants/${applicant._id}`}
                >
                  More info
                </Link>
                {/* Show accept button */}
               
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export { ViewApplicants };
