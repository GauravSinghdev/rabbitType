import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const ltime = localStorage.getItem('Ltime') || "30";
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

      if (response.data.error) {
        console.log("no array avail");
        setNoData(true);
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
  }, []);

  useEffect(() => {
    getRequest();
  }, [ltimer]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 text-[#d1d0c5]">
        <div className="flex flex-col justify-center items-center">
          <div className=" text-5xl underline underline-offset-4">
            Leaderboard
          </div>
          <ul className="w-fit flex gap-5 px-5 py-3 mx-auto rounded-3xl mt-2 mb-4] cursor-pointer">
            {timerArr.map((time, indx) => (
              <li
                key={indx}
                onClick={() => handleSetTimer(time)}
                className={`px-3 py-1 text-lg ${time === ltimer ? "text-[#7cf5bd]  underline underline-offset-4 decoration-2" : ""}`}
              >
                {time}
              </li>
            ))}
          </ul>
        </div>
        {loading ? (
          <motion.div
            className="flex justify-center items-center mt-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Progress />
          </motion.div>
        ) : noData ? (
          <motion.div
            className="text-center mt-64 text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p>No data available</p>
          </motion.div>
        ) : (
          <motion.div
            className="flex justify-center mx-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.table
              className="mx-auto w-fit text-center cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
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
                  <motion.tr
                    key={index}
                    className="py-5"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <td className="text-xl py-3">{index + 1}</td>
                    <td className="text-xl py-3">{ele.user.username}</td>
                    <td className="text-xl py-3">{ele.timer}</td>
                    <td className="text-xl py-3">{ele.wpm}</td>
                    <td className="text-xl py-3">{ele.accuracy.toFixed(2)}%</td>
                    <td className="text-xl py-3">{new Date(ele.createdAt).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </motion.div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Leader;
