import { motion } from 'framer-motion';

const Progress = () => {
  return (
    <div className="flex justify-center items-center h-full gap-3">
        <p className='text-4xl'>Fetching Data</p>
      <motion.div
        className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        </motion.div>
    </div>
  );
};

export default Progress;
