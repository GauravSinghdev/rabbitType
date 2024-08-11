import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import TextArea from "../components/TextArea";

const timers = ['15', '30', '45'];

const Home = () => {
  const time = localStorage.getItem('time') || "";
  const [timer, setTimer] = useState<string>(time);
  const [randomNumber, setRandomNumber] = useState<number>(0);

  const handleSetTimer = (time: string) => {
    localStorage.setItem("time", String(time));
    setTimer(time);
    location.reload();
  };

  useEffect(() => {
    // Generate a random number when the component mounts
    const random = Math.floor(Math.random() * 50) + 1;
    setRandomNumber(random);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 text-white">
        <ul className="w-fit flex gap-5 px-5 py-3 mx-auto rounded-3xl my-16 cursor-pointer border">
          {timers.map((time, index) => (
            <li
              key={index}
              onClick={() => handleSetTimer(time)}
              className={`px-3 py-1 text-2xl ${time === timer ? "text-[#7cf5bd]" : ""}`}
            >
              {time}
            </li>
          ))}
        </ul>
        <div className="my-8">
          <TextArea timer={timer} random={randomNumber} />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
