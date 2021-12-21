import { useEffect, useState } from "react";
import {
  FaRegEnvelope,
  FaUserCircle,
  FaMapMarkerAlt,
  FaFileAlt,
  FaLink,
} from "react-icons/fa";
import "react-tabs/style/react-tabs.css";
import ElevatorPitch from "./ElevatorPitch";

/**
 * Basic profile and contact information on profile page
 *
 * @returns JSX.Element content to be displayed
 */
const Profile = (props) => {
  /**
   * Shows the editing modal for profile and contact information changes
   */

  /**
   * Functions to update the various contact information iterms
   */
  const [firstname, set_firstname] = useState("");
  const [lastname, set_lastname] = useState("");
  const [email, set_email] = useState("");
  const [address, set_address] = useState("");
  const [resume, set_resume] = useState("");
  const [socials, set_socials] = useState<string[]>([]);

  useEffect(() => {
    set_firstname(props.profile.firstName);
    set_lastname(props.profile.lastName);
    set_email(props.profile.email);
    set_address(props.profile.address);
    set_resume(props.profile.resumeUrl);
    set_socials(props.profile.socials);
  }, [props.profile]);

  return (
    <div className="relative mb-16 grid shadow-xl">
      <div className="flex relative bg-tiffany-blue w-full items-center h-64">
        <ElevatorPitch authToken={props.authToken} />
      </div>
      <div>
        <div className="grid justify-items-center mt-16 pb-4 text-lg">
          <FaUserCircle className="absolute p-2 top-48 rounded-full bg-white w-32 h-32" />
          <p className="text-center text-3xl text-tiffany-blue mb-2">
            {firstname + " " + lastname}
          </p>
          <div>
            <p>
              <FaRegEnvelope className="inline mr-4 text-tiffany-blue" />
              {email}
            </p>
            <p>
              <FaMapMarkerAlt className="inline mr-4 text-tiffany-blue" />
              {address}
            </p>
            <a
              href={resume}
              target="_blank"
              rel="noreferrer"
              title="Click Here to View My Resume"
            >
              <FaFileAlt className="inline mr-4 text-tiffany-blue" />
              Resume
            </a>
          </div>
          <hr className="w-1/3 mt-4 border-tiffany-blue" />
          <div className="mt-2 mb-2">
            {socials &&
              socials.map((social) => (
                <p key={social}>
                  <FaLink className="inline mr-4 text-tiffany-blue" />
                  <a href={social} target="_blank" rel="noreferrer">
                    {social}
                  </a>
                </p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
