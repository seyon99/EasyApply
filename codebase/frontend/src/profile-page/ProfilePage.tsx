import axios from "axios";
import { useEffect, useState } from "react";
import Profile from "./Profile";
import SettingsModal from "./settings/Settings";
import Skills from "./Skills";
import Summary from "./Summary";
import WorkExperiences from "./WorkExperiences";
/**
 * The profile page
 *
 * @returns JSX.Element content to be displayed
 */
const ProfilePage = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState([]);
  const [editModalTab, showEditModalTab] = useState(0);

  useEffect(() => {
    /**
     * Retrives the user summary from the database
     *
     * @returns Promise.
     */
    const getProfile = async () => {
      await axios
        .get(`${process.env.REACT_APP_API_URL}/api/jobseekerprofile`, {
          params: { email: props.email },
        })
        .then((res) => setProfile(res.data[0]));
    };
    getProfile();
  }, [props.email, profile]);
  const displayModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const updateGeneralContact = () => {
    displayModal();
    showEditModalTab(0);
  };
  const updateSummary = () => {
    showEditModalTab(3);
    displayModal();
  };
  const updateSkills = () => {
    displayModal();
    showEditModalTab(4);
  };
  const updateWorkExperiences = () => {
    displayModal();
    showEditModalTab(5);
  };

  if (profile === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:w-3/4 m-auto bg-gray-100">
      <div className="w-full float-left p-4 xl:w-1/3">
        <Profile profile={profile} authToken={props.authToken} />
        <div className="w-full flex flex-col items-center">
          <SettingsModal
            profile={profile}
            authToken={props.authToken}
            tab={editModalTab}
            openEditModal={updateGeneralContact}
            isOpen={showModal}
            displayModal={displayModal}
            closeModal={closeModal}
          />
        </div>
      </div>
      <div className="w-full float-left p-4 xl:w-2/3">
        <Summary
          summary={profile["summary"]}
          authToken={props.authToken}
          openEditModal={updateSummary}
        />
        <Skills
          skills={profile["skills"]}
          authToken={props.authToken}
          openEditModal={updateSkills}
        />
        <WorkExperiences
          workExperiences={profile["workExperience"]}
          authToken={props.authToken}
          openEditModal={updateWorkExperiences}
        />
      </div>
    </div>
    
    )
   
};

export default ProfilePage;
