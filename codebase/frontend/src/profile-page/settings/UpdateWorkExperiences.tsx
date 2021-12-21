import axios from "axios";
import {
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPen,
} from "react-icons/fa";
import PillButton from "../../components/PillButton";
import Job from "../../types/WorkExperience";

const UpdateWorkExperiences = (props) => {
  /**
   * Updates user profile skills
   *
   * @param {Job[]} jobs List of user jobs
   * @returns Promise
   */
  const updateWorkExperiences = async (jobs) => {
    return axios.request({
      url: `${process.env.REACT_APP_API_URL}/api/jobseeker/updateworkexperiences`,
      method: "POST",
      headers: { Authorization: props.authToken },
      data: { workExperience: jobs },
    });
  };

  /**
   * Adds a new work experience based on form input
   *
   * @param event Form input
   */
  const add_work_experience = (event) => {
    event.preventDefault();

    const new_work_experience: Job = {
      title: event.target.title.value,
      company: event.target.company.value,
      start: event.target.start.value,
      end: event.target.end.value,
      location: event.target.location.value,
      description: event.target.description.value,
    };
    updateWorkExperiences(props.workExperience.concat(new_work_experience));
    event.target.reset();
  };

  /**
   * Removes a work experience
   *
   * @param remove_work_experience Work experience to remove
   */
  const delete_work_experience = (remove_work_experience) => {
    const new_list = props.workExperience.filter(
      (work_experience) => work_experience !== remove_work_experience
    );
    updateWorkExperiences(new_list);
  };

  return (
    <div className="flex flex-col h-full items-center pt-8">
      <div className="flex flex-row w-full flex-wrap overflow-auto">
        {props.workExperience &&
          props.workExperience.map((job: Job) => (
            <div
              key={JSON.stringify(job)}
              className="relative mx-4 mb-4 p-2 border-2 border-opacity-25 rounded-md shadow-sm flex flex-col"
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
              <button
                className="hover:text-red-500 absolute top-0 left-0"
                onClick={() => delete_work_experience(job)}
              >
                &#10005;
              </button>
            </div>
          ))}
      </div>

      <div className="flex items-center mx-4 mb-4 p-2">
        <div className="left rounded-full bg-tiffany-blue opacity-50 w-16 h-16"></div>
        <div className="left p-4">
          <form onSubmit={add_work_experience}>
            <FaBriefcase className="inline mb-2 mx-2 text-tiffany-blue" />
            <input type="text" name="title" placeholder="Job Title" required />
            <br />
            <FaBuilding className="inline mb-2 mx-2 text-tiffany-blue" />
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              required
            />
            <br />
            <FaCalendarAlt className="inline mb-2 mx-2 text-tiffany-blue" />
            <input type="month" name="start" required />
            <input type="month" name="end" required />
            <br />
            <FaMapMarkerAlt className="inline mb-2 mx-2 text-tiffany-blue" />
            <input
              type="text"
              name="location"
              placeholder="Location"
              required
            />
            <br />
            <FaPen className="inline mb-2 mx-2 text-tiffany-blue" />
            <input
              type="text"
              name="description"
              placeholder="Description"
              required
            />
            <br />
            <PillButton children="Enter" type="submit" />
          </form>
        </div>
      </div>
      <PillButton children="Finish" type="button" onClick={props.close} />
    </div>
  );
};

export default UpdateWorkExperiences;
