import { useEffect, useState } from "react";
import { FaCog } from "react-icons/fa";
import Modal from "react-modal";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PitchVideo from "../../pages/PitchVideo";
import UpdateGeneralContact from "./UpdateGeneralContact";
import UpdateSkills from "./UpdateSkills";
import UpdateSocials from "./UpdateSocials";
import UpdateSummary from "./UpdateSummary";
import UpdateWorkExperiences from "./UpdateWorkExperiences";
import { isMobile } from "react-device-detect";

const SettingsModal = (props) => {
  const [modalTab, setModalTab] = useState(0);
  /**
   * CSS for the modal
   */
  const width = isMobile ? "90vw" : "50vw"
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      width: width,
      height: "50vh",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      overflow: "auto"
    },
  };

  const updatedProfile = () => props.closeModal();

  useEffect(() => setModalTab(props.tab), [props.isOpen, props.tab]);

  return (
    <>
      <FaCog
        className="cursor-pointer text-3xl text-tiffany-blue"
        onClick={() => props.openEditModal()}
      />
      <Modal
        isOpen={props.isOpen}
        ariaHideApp={false}
        onRequestClose={() => props.closeModal()}
        style={customStyles}
      >
        <Tabs defaultIndex={modalTab}>
          <TabList className="text-tiffany-blue text-lg">
            <Tab>General Contact</Tab>
            <Tab>Pitch Video</Tab>
            <Tab>Socials</Tab>
            <Tab>Summary</Tab>
            <Tab>Skills</Tab>
            <Tab>Work Experience</Tab>
          </TabList>
          <TabPanel>
            <UpdateGeneralContact
              firstName={props.profile.firstName}
              lastName={props.profile.lastName}
              email={props.profile.email}
              address={props.profile.address}
              resume={props.profile.resume}
              authToken={props.authToken}
              close={updatedProfile}
            />
          </TabPanel>
          <TabPanel>
            <PitchVideo />
          </TabPanel>
          <TabPanel>
            <UpdateSocials
              socials={props.profile.socials}
              authToken={props.authToken}
              close={updatedProfile}
            />
          </TabPanel>
          <TabPanel>
            <UpdateSummary
              summary={props.profile.summary}
              authToken={props.authToken}
              close={updatedProfile}
            />
          </TabPanel>
          <TabPanel>
            <UpdateSkills
              skills={props.profile.skills}
              authToken={props.authToken}
              close={updatedProfile}
            />
          </TabPanel>
          <TabPanel>
            <UpdateWorkExperiences
              workExperience={props.profile.workExperience}
              authToken={props.authToken}
              close={updatedProfile}
            />
          </TabPanel>
        </Tabs>
      </Modal>
    </>
  );
};

export default SettingsModal;
