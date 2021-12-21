import React, { useEffect, useState } from 'react'
import TextInput from '../components/TextInput'
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import "tailwindcss/tailwind.css";
import { useAuth } from "../context/AuthContext";
import JobseekerProfile from "../types/JobseekerProfile";


function Application(this: any) {
  const location = useLocation();
  const listing_id = parseInt(location.pathname.replace('/application/', ''))
  const history = useHistory()
  const authToken = useAuth().getAuthData().authToken;

  const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {




    // var job_list = []
    event.preventDefault();



    const form = event.target as HTMLFormElement;
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/updateprofilejobsapplied`,
      {
        email: form.email.value,
        job: listing_id
      }
    );
    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}/api/jobs/apply`,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${authToken}`
      },
      data: {
        listing_id: listing_id,
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value,
        city: form.City.value,
        province: form.Province.value,
        zip: form.zip.value,
      },
    });
    history.push('/search')
  };
  const [isLoadingp, profIsLoading] = useState(true);
  //Checking auth/login
  const auth = useAuth();
  const authData = auth.getAuthData().authData;
  const signedIn = auth.getAuthData().authToken.length > 0;
  let authEmail: null = null;
  if (signedIn) {
    authEmail = JSON.parse(authData).payload.email;

  }
  //Loading Profile data

  const [profileData, setprofdata] = useState<JobseekerProfile[]>([]);

  useEffect(() => {
    const getProfileData = async (profIsLoading: any, setProfileData: any) => {
      return axios
        .get(`${process.env.REACT_APP_API_URL}/api/jobseekerprofile`, {
          params: { email: authEmail },
        })
        .then((res) => {
          profIsLoading(false);
          const profileData = [] as JobseekerProfile[];
          for (const data of res.data) {
            profileData.push({
              user: data.user,
              profile_picture: data.profile_picture,
              email: data.email,
              firstName: data.firstName,
              lastName: data.lastName,
              socials: data.socials,
              resumeUrl: data.resumeUrl,
              summary: data.summary,
              address: data.address,
              workExperience: data.workExperience,
              education: data.education,
              skills: data.skills,
              metadata: data.metadata
            });
          }
          setProfileData(profileData);
        });
    };
    if (isLoadingp) {
      getProfileData(profIsLoading, setprofdata).then(() => {
        profIsLoading(false);
      });
    }
  }, [authEmail, isLoadingp]);

  let pfirst_name = '';
  let plast_name = '';
  let pemail = '';
  if (profileData[0]) {
    pfirst_name = profileData[0].firstName;
    plast_name = profileData[0].lastName;
    pemail = profileData[0].email;
  }
  return (
    <div className="mx-auto max-w-screen-xl py-8">
      {signedIn
        ? <div className="flex items-center bg-tiffany-blue opacity-75 text-white text-xs italic px-2 py-2 mb-3 rounded-sm">
          <svg className="fill-current w-4 h-4 mr-2" stroke="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
          <p>
            We autofilled some fields with your profile data!
          </p>
        </div>
        : <></>}
      <form onSubmit={submitForm}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
              htmlFor="grid-first-name"
            >
              First Name
            </label>
            {signedIn
              ? <TextInput
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                value={pfirst_name}
                name={"firstName"}
                required={true}
              />
              : <TextInput
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Jane"
                name={"firstName"}
                required={true}
              />}
            <p className="text-red-500 text-xs italic">
              Please fill out this field.
            </p>
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
              htmlFor="grid-last-name"
            >
              Last Name
            </label>
            {signedIn
              ? <TextInput
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                name={"lastName"}
                value={plast_name}
                required={true}
              />
              : <TextInput
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="text"
                placeholder="Doe"
                name={"lastName"}
                required={true}
              />}
            <p className="text-red-500 text-xs italic">
              Please fill out this field.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
              htmlFor="grid-password"
            >
              Email
            </label>
            {signedIn
              ? <TextInput
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="email"
                name={"email"}
                value={pemail}
                required={true}
              />
              : <TextInput
                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                type="email"
                placeholder="Example@gmail.com"
                name={"email"}
                required={true}
              />}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
              htmlFor="grid-city"
            >
              City
            </label>
            <TextInput
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="Toronto"
              name={"City"}
              required={true}
            />
          </div>
        </div>
        <div className="w-full md:w-1/2  ">
          <label
            className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
            htmlFor="grid-city"
          >
            Province
          </label>
          <TextInput
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            type="text"
            placeholder="Ontario"
            name={"Province"}
            required={true}
          />
          <div className="flex flex-wrap  mb-2">
            <label
              className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
              htmlFor="grid-zip"
            >
              ZIP/Postal Code
            </label>
            <TextInput
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              placeholder="L01 8N2"
              name={"zip"}
              required={false}
            />
          </div>
        </div>
        <button
          className="h-12 px-6  text-lg text-white transition-colors duration-150 bg-tiffany-blue rounded-lg focus:shadow-outline hover:bg-indigo-800"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Application
