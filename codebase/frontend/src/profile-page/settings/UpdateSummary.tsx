import axios from "axios";
import TextareaAutosize from "react-textarea-autosize";
import PillButton from "../../components/PillButton";
const UpdateSummary = (props) => {
  const update_summary = async (event) => {
    event.preventDefault();
    return axios.request({
      url: `${process.env.REACT_APP_API_URL}/api/jobseeker/updateprofilesummary`,
      method: "POST",
      headers: { Authorization: props.authToken },
      data: { summary: event.target.summary.value },
    }).then(() => props.close());
  };
  return (
    <form className="grid justify-items-center py-4" onSubmit={update_summary}>
      <TextareaAutosize
        className="w-full px-4 my-4 resize-none h-full border-2 text-gray-500 border-tiffany-blue border-opacity-50 outline-none"
        name="summary"
        minRows={5}
        defaultValue={props.summary}
      />
      <PillButton children="Update" type="submit" />
    </form>
  );
};

export default UpdateSummary;
