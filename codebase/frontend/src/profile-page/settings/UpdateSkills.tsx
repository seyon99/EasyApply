import axios from "axios";
import PillButton from "../../components/PillButton";

const UpdateSkills = (props) => {
  /**
   * Updates user profile skills
   *
   * @param {String[]} skills List of user skills
   * @returns Promise
   */
  const update_skills = async (skills) => {
    return axios.request({
      url: `${process.env.REACT_APP_API_URL}/api/jobseeker/updateprofileskills`,
      method: "POST",
      headers: { Authorization: props.authToken },
      data: { skills: skills },
    });
  };

  /**
   * Adds a new distinct skill based on insert skill form
   *
   * @param event Form input passed in by the insert skill form
   */
  const add_skill = (event) => {
    event.preventDefault();
    const new_skill = event.target.skill.value;
    if (props.skills.findIndex((skill) => skill === new_skill.toLowerCase().trim()) === -1) {
      update_skills(props.skills.concat(new_skill));
      event.target.reset();
    }
  };

  /**
   * Removes a skill from the user profile
   *
   * @param remove_skill Skill from skills to remove
   */
  const delete_skill = (remove_skill) =>
    update_skills(props.skills.filter((skill) => skill !== remove_skill));

  return (
    <div className="flex flex-col h-full items-center pt-8">
      <div className="flex flex-row w-full flex-wrap py-4">
        {props.skills &&
          props.skills.map((skill) => (
            <div
              className="flex items-center border-2 rounded-full text-tiffany-blue bg-gray-50 mx-4 mb-4 p-2"
              key={skill}
            >
              <button
                className="hover:text-red-500"
                onClick={() => delete_skill(skill)}
              >
                &#10005;
              </button>
              <p className="my-0 mx-2">{skill}</p>
            </div>
          ))}
      </div>
      <div className="flex w-full mx-4 p-2">
        <form onSubmit={add_skill} className="flex w-full items-center justify-center mb-4">
          <input
            className="w-96 border-2 border-tiffany-blue border-opacity-50 outline-none rounded-full text-tiffany-blue bg-gray-50 mx-4 p-2"
            type="text"
            name="skill"
            placeholder="Enter in a new skill"
          />
          <PillButton children="Enter" type="submit" />
        </form>
      </div>
      <PillButton children="Finish" type="button" onClick={props.close} />
    </div>
  );
};
export default UpdateSkills;
