import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Progress from '../components/Progress';
import { motion } from 'framer-motion';

const Result = () => {
  const [gotRes, setGotRes] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  const getData = () => {
    // Retrieve the data from localStorage
    const data = localStorage.getItem('cTyped-result');
    
    if (data) {
      setResultData(JSON.parse(data));
      setGotRes(true); // Update state to show results
    }
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 py-10 text-white">
        {!gotRes ? (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Progress />
            <div className='border border-gray-600 rounded-md mt-10 mx-auto p-4 w-fit'>
              <h1 className='text-2xl font-semibold'>Result Page</h1>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-5xl underline underline-offset-4 mb-10 flex justify-center">Your Result</div>
            <div className='mt-4 border-2 border-gray-600 rounded-md p-4 mx-80 flex flex-col gap-5 text-left text-lg'>
              <p><strong>Timer:</strong> {resultData.timer} seconds</p>
              <p><strong>Words Per Minute:</strong> {resultData.wpm}</p>
              <p><strong>Raw WPM:</strong> {resultData.rawWpm}</p>
              <p><strong>Mistakes:</strong> {resultData.mistakes}</p>
              <p><strong>Accuracy:</strong> {resultData.accuracy}%</p>
              <p><strong>Backspace Count:</strong> {resultData.backspaceCount}</p>
            </div>
          </motion.div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Result;
