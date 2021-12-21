import axios from "axios";


export default async function getjobsappliedlist(authData) {
  var job_list = [-1];
  await axios
    .get(
      `${process.env.REACT_APP_API_URL}/api/jobseekerprofile/?email=` +
      JSON.parse(authData).payload.email
    )
    .then((res) => {
      job_list = JSON.parse(JSON.stringify(res.data[0])).jobsApplied;
    });
  return job_list
}
