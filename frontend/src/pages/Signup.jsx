import React, { useState } from "react";
import Heading from "../Components/Heading";
import SubHeading from "../Components/SubHeading";
import InputBox from "../Components/InputBox";
import Button from "../Components/Button";
import axios from 'axios'
import BottomWarning from "../Components/BottomWarning";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate()

  return (
    <div className=" min-h-screen w-full bg-slate-300 flex justify-center items-center">
      <div className="flex flex-col justify-center  w-[90vw] sm:w-80 bg-red-200">
        <div className="rounded-lg bg-white w-full text-center h-max px-4 p-2 text-black">
          <Heading label={"Sign Up"} />
          <SubHeading label={"Enter your information to create an account"} />
          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder={"John"}
            label={"First Name"}
          />
          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder={"Doe"}
            label={"Last Name"}
          />
          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder={"name@gmail.com"}
            label={"Email"}
          />
          <InputBox
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            placeholder={"*********"}
            label={"Password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                try {
                  const response =await axios.post("http://localhost:3000/api/v1/user/signup", {
                    username,
                    firstName,
                    lastName,
                    password,
                  })
                  console.log(response.data.message)
                  localStorage.setItem("token",response.data.token)
                  navigate("/dashboard")
                } catch (error) {
                  if (error.response) {
                    console.log(error.response.data.message);
                  } else if (error.request) {
                    console.log(error.request);
                  } else {
                    console.log('Error : ', error.message);
                  }
                }
              }}
              label={"Sign Up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign In"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};

export default Signup;
