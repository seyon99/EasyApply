import axios from "axios";
import PillButton from "../../components/PillButton";

const UpdateGeneralContact = (props) => {
  /**
   * Updates the users contact information based on the input provided by the editing modal
   *
   * @param event Form input from the editing modal
   */
  const updateGeneralContact = async (event) => {
    event.preventDefault();
    let resumeURL = props.resume;
    if (event.target.resume.files.length === 1) {
      const formdata = new FormData();
      formdata.append("resume", event.target.resume.files[0]);
      await axios
        .request({
          url: `${process.env.REACT_APP_API_URL}/api/uploadresume`,
          method: "POST",
          headers: {
            Authorization: props.authToken,
          },
          data: formdata,
        })
        .then((res) => (resumeURL = res.data.data));
    }
    const profile = {
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: event.target.email.value,
      address: event.target.address.value,
      resumeURL: resumeURL,
    };
    return axios.request({
      url: `${process.env.REACT_APP_API_URL}/api/jobseeker/updategeneralcontact`,
      method: "POST",
      headers: { Authorization: props.authToken },
      data: { profile },
    }).then(() => props.close());
  };

  const textinput = (name, defaultValue) => (
    <input
      type="text"
      name={name}
      defaultValue={defaultValue}
      className="border-2 border-tiffany-blue text-black border-opacity-25 rounded-full mx-4 px-2 mb-4 flex-auto"
    />
  );
  return (
    <form onSubmit={updateGeneralContact}>
      <div className="flex gap-8 pt-8">
        <div className="w-full flex flex-col">
          <div className="flex flex-col text-tiffany-blue text-lg">
            <label htmlFor="firstName" className="mb-4 flex-1">
              First Name {textinput("firstName", props.firstName)}
            </label>
            <label htmlFor="lastName" className="mb-4 flex-1">
              Last Name {textinput("lastName", props.lastName)}
            </label>
            <label htmlFor="email" className="mb-4 flex-1">
              Email {textinput("email", props.email)}
            </label>
            <label htmlFor="address" className="mb-4 flex-1">
              Address {textinput("address", props.address)}
            </label>
            <label htmlFor="resume" className="flex-1">
              Resume
              <input
                type="file"
                name="resume"
                className="mx-4 mb-4 flex-1 text-black"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="m-auto flex flex-col items-center">
        <PillButton children="Submit" type="submit" />
      </div>
    </form>
  );
};

export default UpdateGeneralContact;
