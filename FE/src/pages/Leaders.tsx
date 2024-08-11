import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Progress from "../components/Progress";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface TypingTest {
  user: {
    username: string;
  };
  timer: number;
  wpm: number;
  accuracy: number;
  createdAt: string;
}

const timerArr = ['15', '30', '45'];

const Leader = () => {
  const ltime = localStorage.getItem('Ltime') || "";
  const [ltimer, setLTimer] = useState<string>(ltime);
  const [arr, setArr] = useState<TypingTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const handleSetTimer = (time: string) => {
    localStorage.setItem("Ltime", String(time));
    setLTimer(time);
    location.reload();
  };

  const getRequest = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/typing/top-10-typing-rank/${ltimer}`, {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });

      if(response.data.error)
      {
        console.log("no array avail");
        setNoData(true)
      }
      const resArr = response.data.topTypingTests;
      setArr(resArr);

      // Simulate loading completion
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Add a delay for the progress animation
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    localStorage.setItem("Ltime", "30");
  },[])

  useEffect(() => {
    getRequest();
  }, [ltimer]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 text-[#d1d0c5]">
        <div className="flex flex-grow justify-center relative mb-10 items-center">
          <div className="text-center text-5xl underline underline-offset-4 mb-10 font-[cursive] flex">Leaderboard</div>
          <ul className="w-fit flex gap-5 px-5 py-3 mx-auto rounded-3xl my-16 cursor-pointer border absolute right-72 top-[-70px]">
            {
              timerArr.map((time, indx) => (
                <li 
                  key={indx}
                  onClick={() => handleSetTimer(time)}
                  className={`px-3 py-1 text-lg ${time === ltimer ? "text-[#7cf5bd]" : ""}`}>
                  {time}
                </li>
              ))
            }
          </ul>
        </div>
        {loading ? (
          <div className="flex justify-center items-center mt-64">
            <Progress />
          </div>
        ) : noData ? (
          <div className="text-center mt-64 text-3xl">
            <p>No data available</p>
          </div>
        ) : (
          <div className="flex justify-center mx-10">
            <table className="mx-auto w-fit text-center cursor-pointer">
              <thead>
                <tr className="text-[#7cf5bd] px-2 border-b-4">
                  <th className="mx-40 text-3xl p-10 pb-3">Rank</th>
                  <th className="mx-40 text-3xl p-10 pb-3">Name</th>
                  <th className="mx-40 text-3xl p-10 pb-3">Timer</th>
                  <th className="mx-40 text-3xl p-10 pb-3">WPM</th>
                  <th className="mx-40 text-3xl p-10 pb-3">Accuracy</th>
                  <th className="mx-40 text-3xl p-10 pb-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {arr.map((ele, index) => (
                  <tr key={index} className="py-5">
                    <td className="text-xl py-3">{index + 1}</td>
                    <td className="text-xl py-3">{ele.user.username}</td>
                    <td className="text-xl py-3">{ele.timer}</td>
                    <td className="text-xl py-3">{ele.wpm}</td>
                    <td className="text-xl py-3">{ele.accuracy.toFixed(2)}%</td>
                    <td className="text-xl py-3">{new Date(ele.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Leader;
