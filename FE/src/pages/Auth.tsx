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
import { Spinner } from "../components/Spinner";

const Auth = () => {
  const navigate = useNavigate();

  const [errorSignin, setErrorSignin] = useState<string | null>(null);
  const [errorSignup, setErrorSignup] = useState<string | null>(null);
  const [spinSignup, setSpinSignup] = useState<boolean>(false);
  const [spinSignin, setSpinSignin] = useState<boolean>(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
      return;
    }
  }, [navigate]);

  const [registerFormValues, setRegisterFormValues] = useState({
    username: "",
    email: "",
    password: "",
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
    setSpinSignup(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`, registerFormValues);
      if (response.data && response.data.error) {
        setErrorSignup(response.data.error || "Sign-up failed. Please try again.");
      } else {
        localStorage.setItem("name", response.data.user.username);
        localStorage.setItem("token", response.data.jwt);
        localStorage.setItem("time", "30");
        navigate("/");
      }
    } catch (error: any) {
      setErrorSignup(error.response?.data?.message || "Sign-up failed. Please try again.");
      console.error(error);
    } finally {
      setSpinSignup(false);
    }
  };

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSpinSignin(true);
    try {
      const response = await axios.post(`${BACKEND_URL}/user/signin`, loginFormValues);
      if (response.data && response.data.error) {
        setErrorSignin("Sign-in failed. Please try again.");
      } else {
        localStorage.setItem("name", response.data.user.username);
        localStorage.setItem("token", response.data.jwt);
        localStorage.setItem("time", "30");
        navigate("/");
      }
    } catch (error: any) {
      setErrorSignin("Sign-in failed. Please try again.");
      console.error(error);
    } finally {
      setSpinSignin(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 text-white grid grid-cols-2">
        <div className="col-span-1 items-center flex justify-center mb-20">
          <div className="flex flex-col gap-5 w-[35%]">
            <div className="text-[#656769] flex gap-2 items-center">
              <FaUserPlus className="h-5 w-5" />
              REGISTER
            </div>
            <form className="flex flex-col gap-1">
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
                placeholder="password"
                name="password"
                type="password"
                onChange={handleRegisterChange}
              />
              {errorSignup && <div className="text-red-500 text-center">{errorSignup}</div>}
              <button
                className={`w-full bg-[#303235] rounded-lg flex items-center justify-center ${
                  !isRegisterButtonDisabled && "hover:bg-white/80 active:bg-white/20"
                }`}
                disabled={isRegisterButtonDisabled}
                onClick={handleSignUp}
              >
                <div
                  className={`text-[#656769] p-2 flex gap-2 justify-center items-center ${
                    !isRegisterButtonDisabled && "text-white/60 hover:text-black/70"
                  }`}
                >
                  <FaUserPlus className="h-5 w-5" />
                  sign up
                </div>
                {spinSignup && <Spinner size={"small"} />}
              </button>
            </form>
          </div>
        </div>
        <div className="col-span-1 items-center flex justify-center mb-20">
          <div className="flex flex-col gap-5 w-[35%]">
            <div className="text-[#656769] flex gap-2 items-center">
              <RiLoginCircleFill className="h-5 w-5" />
              LOGIN
            </div>
            <form className="flex flex-col gap-1">
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
              {errorSignin && <div className="text-red-500 text-center">{errorSignin}</div>}
              <button
                className={`w-full bg-[#303235] rounded-lg flex items-center justify-center ${
                  !isLoginButtonDisabled && "hover:bg-white/80 active:bg-white/20"
                }`}
                disabled={isLoginButtonDisabled}
                onClick={handleSignIn}
              >
                <div
                  className={`text-[#656769] flex p-2 gap-2 justify-center items-center ${
                    !isLoginButtonDisabled && "text-white/60 hover:text-black/70"
                  }`}
                >
                  <RiLoginCircleFill className="h-5 w-5" />
                  sign in
                </div>
                {spinSignin && <Spinner size={"small"} />}
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
