import React from "react";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import axios from "axios";
import { Redirect } from "react-router";
import { useAuth } from "../context/AuthContext";
import GoogleIcon from "../assets/google.svg";
import "../assets/SignIn.css";
import TextInput from "../components/TextInput";
import PillButton from "../components/PillButton";
import { Spacer } from "../components/Spacer";
import { AlertMessage, AlertType } from "../components/AlertMessage";
import SubmitButton from "../components/SubmitButton";

const SignIn = () => {
  const [message, setMessage] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [continueButtonDisabled, setContinueButtonDisabled] = useState(false);
  const auth = useAuth();
  const authToken = auth.getAuthData().authToken;

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContinueButtonDisabled(true);
    setTimeout(() => {
      const form = event.target as HTMLFormElement;
      axios({
        method: "post",
        url: `${process.env.REACT_APP_API_URL}/api/user/authenticate`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          email: form.email.value,
          password: form.password.value,
        },
      })
        .then((res) => {
          setSignedIn(true);
          setTimeout(() => {
            auth.updateData({
              authData: JSON.stringify(res.data.authData),
              authToken: res.data.token,
            });
          }, 3000);
        })
        .catch((err) => {
          setMessage("Invalid email or password");
          setContinueButtonDisabled(false);
        });
    }, 2000);
  };

  if (authToken) {
    var authData = auth.getAuthData().authData;
    var role = "";
    try {
      role = JSON.parse(authData).payload.role;
    } catch {
      console.log(role);
    }
    return <Redirect to="/" />;
  }


  return (
    <div className="px-8 bg-gray-100 md:bg-none pt-32 md:pt-56 h-screen md:bg-none signin-background">
      <div className="md:flex md:justify-center">
        <div className="md:filter md:drop-shadow-2xl w-full md:max-w-lg md:bg-white md:rounded-xl md:py-12 md:px-16">
          <h1 className="text-3xl text-center">Sign in to your account</h1>
          <Spacer height={2} />
          <AlertMessage message={message} type={AlertType.info} />
          <Spacer height={1} />
          <form
            onSubmit={(e) => {
              submitForm(e);
            }}
          >
            <TextInput
              role="email"
              name="email"
              type="email"
              required={true}
              autoComplete="email"
              placeholder="my@email.net"
            />
            <Spacer height={2} />
            <TextInput
              role="password"
              name="password"
              type="password"
              required={true}
              autoComplete="current-password"
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
            />
            <Spacer height={2} />
            <div className="flex flex-col justify-center items-center">
              <SubmitButton
                pendingText="Signing in..."
                state={
                  signedIn
                    ? "success"
                    : continueButtonDisabled
                      ? "pending"
                      : "default"
                }
              />
            </div>
          </form>
          <Spacer height={1} />
          <div className="flex flex-col justify-center items-center">
            <a href="/" className="text-black underline">
              Forgot your password?
            </a>
          </div>
          <Spacer height={2} />
          <hr />
          <Spacer height={2} />
          <p className="text-center">Or, sign in with</p>
          <Spacer height={1} />
          <div className="flex flex-col justify-center items-center">
            <PillButton
              href={`${process.env.REACT_APP_API_URL}/api/user/auth/google`}
              onClick={() => { }}
              externalHref={true}
            >
              <img
                src={GoogleIcon}
                alt="Google Sign-in"
                style={{ filter: "invert(1)", marginBottom: "1px" }}
                className="inline pr-1 pb-1"
              />{" "}
              Google
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
