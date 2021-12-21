import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import DateTimePicker from "react-datetime-picker";
/**
 * Applicant type
 *
 * The fields in this type are the fields that are returned from the API
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
    profile: {
      user: string;
      profile_picture: string;
      socials: [any];
      resumeUrl: string;
      summary: string;
      skills: [string];
      workExperience: [
        {
          location: string;
        }
      ];
      education: [any];
    };
    pitchData: {
      userId: string;
      videoUrl: string;
      videoName: string;
      processingStatus: string;
      transcription: string;
    };
  };
};

type RenderHighlightedSkillsProps = {
  skill: string;
  index: number;
  highlightedSkills: string[];
};

const RenderHighlightedSkills = ({
  skill,
  index,
  highlightedSkills,
}: RenderHighlightedSkillsProps) => {
  return (
    <span key={index} className={`pr-2`}>
      {/* Highlight the skill where a match occurs */}
      {highlightedRange(skill, highlightedSkills)[1] !== 0 ? (
        <span>
          <span>
            {skill.substring(0, highlightedRange(skill, highlightedSkills)[0])}
          </span>
          <span
            className={`${
              highlightedRange(skill, highlightedSkills)[1] === skill.length
                ? "text-green-600"
                : "text-blue-500"
            } font-bold`}
            style={{
              backgroundColor: "rgba(0,0,0,0.1)",
              padding: "0.1rem 0.2rem 0.1rem 0.2rem",
              borderRadius: "0.2rem",
            }}
          >
            {skill.substring(
              highlightedRange(skill, highlightedSkills)[0],
              highlightedRange(skill, highlightedSkills)[1]
            )}
          </span>
          <span>
            {skill.substring(
              highlightedRange(skill, highlightedSkills)[1],
              skill.length
            )}
          </span>
        </span>
      ) : (
        <span>{skill}</span>
      )}
    </span>
  );
};

const highlightedRange = (
  skill: string,
  highlightedSkills: string[]
): number[] => {
  for (let i = 0; i < highlightedSkills.length; i++) {
    let highlightedSkill = highlightedSkills[i].toLowerCase();
    let formattedSkill = skill.toLowerCase();
    if (highlightedSkill === formattedSkill) {
      return [0, formattedSkill.length];
    }
    if (formattedSkill.indexOf(highlightedSkill) !== -1) {
      return [
        formattedSkill.indexOf(highlightedSkill),
        formattedSkill.indexOf(highlightedSkill) + highlightedSkill.length,
      ];
    }
  }
  return [0, 0];
};

const ViewApplicant = ({ match }: any) => {
  const authToken = useAuth().getAuthData().authToken;
  const [applicant, setApplicant] = useState({} as Applicant);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilteringModal, setShowFilteringModal] = useState(false);
  const [highlightedSkills, setHighlightedSkills] = useState([] as string[]);
  const [skillInput, setSkillInput] = useState("");
  const [showCalModal, setShowCalModal] = useState(false);
  const [value, onChange] = useState(new Date());
  /* Session storage variable storing highlighted skills */
  const highlightedSkillsSessionStorage =
    sessionStorage.getItem("highlightedSkills") || "[]";
  const highlightedSkillsSessionStorageParsed = JSON.parse(
    highlightedSkillsSessionStorage
  );  
  const auth = useAuth();
    
  const authData = auth.getAuthData().authData;

  useEffect(() => {
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/api/recruiter/application/?applicationId=${
          match && match.params && match.params.id ? match.params.id : "none"
        }`,
        {
          headers: {
            Authorization: `${authToken}`,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setApplicant(response.data.application);
          console.log(response.data.application);
        } else {
          setError(response.data.message);
        }
      })
      .catch((error) => {
        setError(error.response.data.message);
      })
      .finally(() => {
        setHighlightedSkills(highlightedSkillsSessionStorageParsed);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, authToken]);

  const renderFilteringModal = () => {
    /* TailwindCSS */
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="fixed inset-0 h-full px-4 md:px-0 w-auto flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl px-6 py-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Filter skills</h2>
              <button
                className=""
                onClick={() => {
                  setShowFilteringModal(false);
                }}
              >
                Close
              </button>
            </div>
            <div className="mt-4">
              <p className="text-gray-600">
                Enter the skills you want to highlight. They will be saved for
                your current session (will be cleared when you close the
                tab/window).
              </p>
              <p className="text-gray-600">
                They should be inputted in a list separated by commas.
              </p>
              <div className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const skills = skillInput.split(",");
                    sessionStorage.setItem(
                      "highlightedSkills",
                      JSON.stringify(skills)
                    );
                    setHighlightedSkills(skills);
                    setShowFilteringModal(false);
                  }}
                >
                  <input
                    type="text"
                    className="w-full bg-gray-100 py-2 px-3 rounded-md focus:outline-none focus:bg-gray-200"
                    placeholder="Enter skills"
                    onChange={(e) => setSkillInput(e.target.value)}
                    defaultValue={highlightedSkills.join(",")}
                  />
                  <button className="mt-4 bg-blue-500 hover:bg-blue-600 transition transition-all px-4 py-1 text-white rounded-md">
                    Update
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const rejectApplicant = async () => {
  
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/recruiter/reject`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        applicantEmail: applicant.email,
      },
    });
  };

  const acceptApplicant = async (start) => {
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/recruiter/accept`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        applicantEmail: applicant.email,
        start: start,
      },
    });
  };
  const renderCalModal = () => {
    /* TailwindCSS */
    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="fixed inset-0 h-full px-4 md:px-0 w-auto flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl px-6 py-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Schedule Interview</h2>
              <button
                className=""
                onClick={() => {
                  setShowCalModal(false);
                }}
              >
                Close
              </button>
            </div>
            <div className="mt-4">
              <div className="mt-4">
                <form
                  className="flex flex-col"
                  onSubmit={(e) => {
                    e.preventDefault();
                    acceptApplicant(value.toDateString())
                    setShowCalModal(false);
                  }}
                >
                  <DateTimePicker onChange={onChange} value={value} />

                  <button className="mt-4 bg-blue-500 hover:bg-blue-600 transition transition-all px-4 py-1 text-white rounded-md">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };



  // Display the applicant's information in cards (TailwindCSS 2.0)
  return (
    <div className="w-full">
      {showFilteringModal && renderFilteringModal()}
      {showCalModal && renderCalModal()}
      {error && !loading && (
        <h3 className="text-red-500 text-lg text-center">{error}</h3>
      )}
      {!error && applicant && !loading && (
        <div className="md:flex md:flex-row">
          <div className="w-full md:w-1/5 md:flex-shrink-0 pl-8 md:h-screen pt-4 bg-gray-100 pb-8 md:pb-0  overflow-y-scroll h-full">
            <h1 className="text-2xl font-bold">Applicant Information</h1>
            <h2 className="text-xl text-gray-800 font-bold pt-4">
              {applicant.firstName} {applicant.lastName}
            </h2>
            <p className="text-gray-600 mt-2">
              <span className="font-bold">Email:</span> {applicant.email}
            </p>
            {/* Location */}
            <p className="text-gray-600 mt-2">
              <span className="font-bold">Location:</span> {applicant.city},{" "}
              {applicant.province} {applicant.zip}
            </p>
            {/* Show actions (accept/reject) */}
            <div className="mt-4 flex flex-row gap-2 pr-8">
              <button
                className="bg-green-500 hover:bg-green-700 w-full rounded-md text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setShowCalModal(true);
                }}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-700 w-full rounded-md text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  rejectApplicant();
                }}
              >
                Reject
              </button>
            </div>
            {/* Show filtering modal */}
            <div className="mt-4 flex flex-row gap-2 pr-8">
              <button
                className="bg-blue-500 hover:bg-blue-700 w-full rounded-md text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  setShowFilteringModal(true);
                }}
              >
                Filter
              </button>
            </div>
            {/* Skills */}
            <div className="mt-4 w-full pr-8 text-gray-600">
              <span className="font-bold">Skills:</span>{" "}
              <pre className="w-full overflow-x-auto">
                {applicant &&
                  applicant.additionalData &&
                  applicant.additionalData.profile.skills &&
                  applicant.additionalData.profile.skills.map(
                    (skill: string, index: number) => {
                      // Check if the current skill matches (or is a substring) any of the highlighted skills

                      return (
                        <RenderHighlightedSkills
                          index={index}
                          skill={skill}
                          highlightedSkills={highlightedSkills}
                        />
                      );
                    }
                  )}
              </pre>
            </div>
            {/* Pitch Video */}
            <p className="text-gray-600 mt-4 w-full pr-8 z-0">
              {applicant &&
                applicant.additionalData &&
                applicant.additionalData.pitchData &&
                applicant.additionalData.pitchData.videoUrl && (
                  <div>
                    <span className="font-bold">Pitch Video:</span>{" "}
                    <video controls>
                      <source
                        src={applicant.additionalData.pitchData.videoUrl}
                      />
                    </video>
                  </div>
                )}
            </p>
            {/* Transcription of pitch video */}
            <p className="text-gray-600 mt-4 w-full pr-8">
              {applicant &&
                applicant.additionalData &&
                applicant.additionalData.pitchData && (
                  <div>
                    <span className="font-bold">Transcription:</span>{" "}
                    <p
                      className=""
                      style={{
                        backgroundColor: "white",
                        borderRadius: "5px",
                        padding: "10px",
                        fontSize: "1rem",
                        overflowWrap: "break-word",
                        wordWrap: "break-word",
                        lineBreak: "auto",
                        maxWidth: "100%",
                        overflowX: "auto",
                        maxHeight: "200px",
                      }}
                    >
                      {!applicant.additionalData.pitchData.transcription &&
                        "Transcription is being processed or could not recognize any words"}
                      {applicant.additionalData.pitchData.transcription &&
                        JSON.parse(
                          applicant.additionalData.pitchData.transcription
                        )
                          .results.transcripts[0].transcript.split(" ")
                          .map((el, index) => {
                            return (
                              <RenderHighlightedSkills
                                index={index}
                                skill={el}
                                highlightedSkills={highlightedSkills}
                              />
                            );
                          })}
                    </p>
                  </div>
                )}
            </p>
          </div>
          <div
            className="w-full md:flex-grow pt-4 bg-gray-200 md:h-screen md:flex md:flex-col"
            style={{ minHeight: "300px" }}
          >
            <h3 className="text-2xl px-8 pb-4 font-bold">Resume</h3>
            {/* iFrame for resume */}

            {!loading &&
              applicant.additionalData &&
              applicant.additionalData.profile.resumeUrl && (
                <iframe
                  src={applicant.additionalData.profile.resumeUrl}
                  width="100%"
                  height="100%"
                  title="resume"
                  style={{
                    minHeight: "600px",
                  }}
                />
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewApplicant;
