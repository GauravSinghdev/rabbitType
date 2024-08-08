import { useState, useEffect, ChangeEvent } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import LabelledInput from "../components/LabelledInput";
import Navbar from "../components/Navbar";
import { FaUserPlus } from "react-icons/fa";
import { RiLoginCircleFill } from "react-icons/ri";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const [registerFormValues, setRegisterFormValues] = useState({
    username: "",
    email: "",
    verifyEmail: "",
    password: "",
    verifyPassword: "",
  });

  const [isRegisterButtonDisabled, setIsRegisterButtonDisabled] = useState(true);

  const [loginFormValues, setLoginFormValues] = useState({
    email: "",
    password: "",
  });

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(true);

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(registerFormValues).every(
      (value) => value.trim() !== ""
    );
    setIsRegisterButtonDisabled(!allFieldsFilled);
  }, [registerFormValues]);

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(loginFormValues).every(
      (value) => value.trim() !== ""
    );
    setIsLoginButtonDisabled(!allFieldsFilled);
  }, [loginFormValues]);

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, registerFormValues);
      localStorage.setItem('name', response.data.user.username[0]);
      localStorage.setItem('token', response.data.user.jwt);
      console.log(response);
      if(response)
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signin`, loginFormValues);
      localStorage.setItem('name', response.data.user.username[0]);
      localStorage.setItem('token', response.data.user.jwt);
      console.log(response);
      if(response)
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 text-white grid grid-cols-2">
        <div className="col-span-1 items-center flex justify-center mb-20">
          <div className="flex flex-col gap-2 w-[35%]">
            <div className="text-[#656769] flex gap-2 items-center">
              <FaUserPlus className="h-5 w-5" />
              REGISTER
            </div>
            <form>
              <LabelledInput
                placeholder="username"
                name="username"
                type="text"
                onChange={handleRegisterChange}
              />
              <LabelledInput
                placeholder="email"
                name="email"
                type="email"
                onChange={handleRegisterChange}
              />
              <LabelledInput
                placeholder="verify email"
                name="verifyEmail"
                type="email"
                onChange={handleRegisterChange}
              />
              <LabelledInput
                placeholder="password"
                name="password"
                type="password"
                onChange={handleRegisterChange}
              />
              <LabelledInput
                placeholder="verify password"
                name="verifyPassword"
                type="password"
                onChange={handleRegisterChange}
              />
              <button
                className={`w-full bg-[#303235] rounded-lg ${!isRegisterButtonDisabled && "hover:bg-white/80 active:bg-white/20"}`}
                disabled={isRegisterButtonDisabled}
                onClick={handleSignUp}
              >
                <div className={`text-[#656769] p-2 flex gap-2 justify-center items-center ${!isRegisterButtonDisabled && "text-white/60 hover:text-black/70"}`}>
                  <FaUserPlus className="h-5 w-5" />
                  sign up
                </div>
              </button>
            </form>
          </div>
        </div>
        <div className="col-span-1 items-center flex justify-center mb-20">
          <div className="flex flex-col gap-2 w-[35%]">
            <div className="text-[#656769] flex gap-2 items-center">
              <RiLoginCircleFill className="h-5 w-5" />
              LOGIN
            </div>
            <form>
              <LabelledInput
                placeholder="email"
                name="email"
                type="email"
                onChange={handleLoginChange}
              />
              <LabelledInput
                placeholder="password"
                name="password"
                type="password"
                onChange={handleLoginChange}
              />
              <div className="flex items-center text-[#acb2b8] mt-2 mb-3">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  className="mr-2 bg-[#303235] w-4 h-4"
                />
                <label htmlFor="rememberMe">remember me</label>
              </div>
              <button
                className={`w-full bg-[#303235] rounded-lg ${!isLoginButtonDisabled && "hover:bg-white/80 active:bg-white/20"}`}
                disabled={isLoginButtonDisabled}
                onClick={handleSignIn}
              >
                <div className={`text-[#656769] flex p-2 gap-2 justify-center items-center ${!isLoginButtonDisabled && "text-white/60 hover:text-black/70"}`}>
                  <RiLoginCircleFill className="h-5 w-5" />
                  sign in
                </div>
              </button>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Auth;
