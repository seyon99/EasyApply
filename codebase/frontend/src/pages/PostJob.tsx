import React from 'react'
import TextInput from '../components/TextInput'
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useHistory, useLocation } from 'react-router-dom';

function PostJob(this: any) {

    const history = useHistory();
    const auth = useAuth();
    const authToken = auth.getAuthData().authToken;
    const authData = auth.getAuthData().authData;
    
    const submitForm = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        const form = event.target as HTMLFormElement;
        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}/api/recruiter/postjob`,
            headers: {
                "Content-Type": "application/json",
                "authorization": authToken
            },
            data: {
                employer_id: form.employer_id.value,
                job_title: form.job_title.value,
                job_location: form.job_location.value,
                job_description: form.job_description.value,
            },
        });
        history.push("/recruiter/applications")
    };

    //Checking auth/login



    return (
        <div className="mx-auto max-w-screen-xl pt-8">
            <form onSubmit={submitForm}>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label
                            className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
                            htmlFor="grid-first-name"
                        >
                            Company Name
                        </label>
                        <TextInput
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            type="text"
                            placeholder="Company XYZ"
                            name={"employer_id"}
                            required={true}
                        />
                    </div>
                    <div className="w-full md:w-1/2 px-3">
                        <label
                            className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
                            htmlFor="grid-last-name"
                        >
                            Job Title
                        </label>
                        <TextInput
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            type="text"
                            placeholder="Software Engineer"
                            name={"job_title"}
                            required={true}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label
                            className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
                            htmlFor="grid-password"
                        >
                            Job Location
                        </label>
                        <TextInput
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            type="text"
                            placeholder="Toronto, Canada"
                            name={"job_location"}
                            required={true}
                        />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label
                            className="block uppercase tracking-wide text-white text-xs font-bold p-1 bg-tiffany-blue opacity-75 rounded-sm"
                            htmlFor="grid-city"
                        >
                            Job Description
                        </label>
                        <TextInput
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                            type="text"
                            placeholder="This job requires proficiency in Java."
                            name={"job_description"}
                            required={true}
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

export default PostJob