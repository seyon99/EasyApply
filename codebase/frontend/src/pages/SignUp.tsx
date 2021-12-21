import React from "react";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Redirect, useHistory } from "react-router-dom";
import { AlertMessage, AlertType } from "../components/AlertMessage";
import { Spacer } from "../components/Spacer";
import TextInput from "../components/TextInput";
import SubmitButton from "../components/SubmitButton";

const SignUp = () => {
  const [message, setMessage] = useState("");
  const [signUpButtonDisabled, setSignUpButtonDisabled] = useState(false);
  const [signedUp, setSignedUp] = useState(false);
  const history = useHistory();

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignUpButtonDisabled(true);
    setTimeout(() => {
      const form = event.target as HTMLFormElement;
      let role = form.role.value;
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/user/create`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          firstName: form.firstName.value,
          lastName: form.lastName.value,
          email: form.email.value,
          password: form.password.value,
          role: role,
        },
      })
        .then(() => {
          setSignedUp(true);
          setTimeout(() => {
            history.push("/signin");
          }, 3000);
        })
        .catch((err) => {
          setMessage(
            "Error signing up: " +
            (err.response.data.message || "Unspecified error")
          );
          setSignUpButtonDisabled(false);
        });
    }, 2000);
  };

  if (useAuth().getAuthData().authToken) {
    return <Redirect to="/" />;
  }

  return (
    <div className="px-8 bg-gray-100 md:bg-none pt-32 md:pt-56 h-screen md:bg-none signin-background">
      <div className="md:flex md:justify-center">
        <div className="md:filter md:drop-shadow-2xl w-full md:max-w-lg md:bg-white md:rounded-xl md:py-12 md:px-16">
          <h1 className="text-3xl text-center">Create an account</h1>
          <Spacer height={2} />
          <AlertMessage message={message} type={AlertType.info} />
          <Spacer height={1} />
          <form
            onSubmit={(e) => {
              submitForm(e);
            }}
          >
            <label className="pl-4">First name</label>
            <TextInput
              name="firstName"
              type="text"
              placeholder="John"
              autoComplete="given-name"
              required={true}
            />
            <Spacer height={1.5} />
            <label className="pl-4">Last name</label>
            <TextInput
              name="lastName"
              type="text"
              placeholder="Doe"
              autoComplete="family-name"
              required={true}
            />
            <Spacer height={1.5} />
            <label className="pl-4">Email</label>
            <TextInput
              name="email"
              type="email"
              autoComplete="email"
              placeholder="my@email.net"
            />
            <Spacer height={1.5} />
            <label className="pl-4">Password</label>
            <TextInput
              name="password"
              type="password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              autoComplete="new-password"
            />
            <Spacer height={1.5} />
            <label className="pl-4">Account Type</label>
            <select className="border border-gray-300 rounded-full text-black w-full h-10 pl-5 pr-10 bg-gray-200 hover:border-gray-400 focus:outline-none appearance-none"
              name="role"
              required={true}>
              <option value="Jobseeker">Jobseeker</option>
              <option value="Recruiter">Recruiter</option>
            </select>
            <Spacer height={2} />
            <div className="flex flex-col justify-center items-center">
              <SubmitButton
                successText="Success"
                state={
                  signedUp // Set button state to 'success' if signup was successful
                    ? "success"
                    : signUpButtonDisabled // Set button state to 'loading' if signup is in progress
                      ? "pending"
                      : "default" // Set button state to 'default' in all other cases
                }
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
