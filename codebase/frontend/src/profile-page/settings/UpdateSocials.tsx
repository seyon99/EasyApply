import axios from "axios";
import PillButton from "../../components/PillButton";

const UpdateSocials = (props) => {
  /**
   * Updates user social urls
   *
   * @param {String[]} socials List of user socials
   * @returns Promise
   */
  const update_socials = async (socials) => {
    return axios.request({
      url: `${process.env.REACT_APP_API_URL}/api/jobseeker/updatesocials`,
      method: "POST",
      headers: { Authorization: props.authToken },
      data: { socials: socials },
    });
  };

  /**
   * Adds a new social account
   *
   * @param event Form input passed in by the insert social form
   */
  const add_social = (event) => {
    event.preventDefault();
    const new_social = event.target.social.value;
    if (props.socials.findIndex((social) => social === new_social) === -1) {
      update_socials(props.socials.concat(new_social));
      event.target.reset();
    }
  };

  /**
   * Removes a social
   *
   * @param social Social to remove
   */
  const delete_social = (remove_social) =>
    update_socials(props.socials.filter((social) => social !== remove_social));

  return (
    <div className="flex flex-col h-full items-center pt-8">
      <div className="flex flex-row justify-center w-full flex-wrap">
        {props.socials &&
          props.socials.map((social) => (
            <div
              className="flex items-center border-2 rounded-full text-tiffany-blue bg-gray-50 mx-4 mb-4 p-2"
              key={social}
            >
              <button
                className="hover:text-red-500"
                onClick={() => delete_social(social)}
              >
                &#10005;
              </button>
              <p className="my-0 mx-2">{social}</p>
            </div>
          ))}
      </div>
      <div className="flex w-full items-center mx-4 p-2">
        <form onSubmit={add_social} className="flex w-full items-center justify-center mb-4">
          <input
            className="w-96 border-2 border-tiffany-blue border-opacity-50 outline-none rounded-full text-tiffany-blue bg-gray-50 mx-4 p-2"
            type="text"
            name="social"
            placeholder="Social URL"
          />
          <PillButton children="Enter" type="submit" />
        </form>
      </div>
      <PillButton children="Finish" type="button" onClick={props.close} />
    </div>
  );
};
export default UpdateSocials;
