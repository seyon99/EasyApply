import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalVideo from "react-modal-video";
import "../../node_modules/react-modal-video/scss/modal-video.scss";

/**
 * Elevtator pitch section of profile page.
 *
 * @returns JSX.Element content to be displayed
 */
const ElevatorPitch = (props) => {
  const [isOpen, setOpen] = useState(false);
  const [videoURL, setVideoURL] = useState("");

  useEffect(() => {
    const get_pitch = async () => {
      return axios
        .request({
          url: `${process.env.REACT_APP_API_URL}/api/pitch/get`,
          method: "GET",
          headers: { Authorization: props.authToken },
        })
        .then((res) => setVideoURL(res.data.videoUrl));
    };
    get_pitch();
  }, [props.authToken]);
  return (
    <>
      <ModalVideo
        channel="custom"
        autoplay
        isOpen={isOpen}
        url={videoURL}
        onClose={() => setOpen(false)}
      />
      <div
        className="w-full h-full cursor-pointer absolute"
        onClick={() => setOpen(true)}
      >
        <video
          preload="auto"
          src={videoURL}
          className="w-full h-full object-cover"
        />
      </div>
    </>
  );
};

export default ElevatorPitch;
