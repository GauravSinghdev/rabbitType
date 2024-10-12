import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Progress from "../components/Progress";
import { motion } from "framer-motion";
import { IoReload } from "react-icons/io5";

const Result = () => {
  const [resultData, setResultData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noData, setNoData] = useState(false);

  const handleRetry = () => {
    window.location.href = "/";
  };

  const getData = () => {
    const data = localStorage.getItem("cTyped-result");

    if (data) {
      setResultData(JSON.parse(data));
      setNoData(false);
    } else {
      setNoData(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <Navbar />
        <section className="flex-grow px-20 xl:px-48 text-[#d1d0c5] text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-5xl underline underline-offset-4 mb-72 font-cursive">
              Your Latest Test
            </div>
            <Progress />
          </motion.div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 text-[#d1d0c5]">
        {noData ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-96 text-3xl"
          >
            <p>No data available</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-5xl underline underline-offset-4 mb-28 font-cursive">
              RESULT
            </div>
            <div className="border border-[#7cf5bd] p-6 mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-2xl text-left text-lg">
              <p>
                <strong>Timer:</strong> {resultData?.timer} seconds
              </p>
              <p>
                <strong>Words Per Minute:</strong> {resultData?.wpm}
              </p>
              <p>
                <strong>Raw WPM:</strong> {resultData?.rawWpm}
              </p>
              <p>
                <strong>Mistakes:</strong> {resultData?.mistakes}
              </p>
              <p>
                <strong>Accuracy:</strong> {resultData?.accuracy}%
              </p>
              <p>
                <strong>Backspace Count:</strong> {resultData?.backspaceCount}
              </p>
            </div>

            <button
              className="mt-8 px-6 py-2 bg-[#7cf5bd] text-black rounded-lg"
              onClick={handleRetry}
            >
              <div className="flex justify-center items-center gap-1">
                Retry
                <IoReload className="size-6" />
              </div>
            </button>
          </motion.div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Result;
