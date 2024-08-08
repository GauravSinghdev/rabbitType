import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleLogin = () => {
    navigate('/signin'); // Navigate to the login page
  };

  return (

    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow items-center pt-[200px] px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 sm:text-[150px]">404</h1>
        <p className="text-xl mt-4 text-[#656769] sm:text-3xl">The page you are looking for does not exist.</p>
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded shadow hover:bg-blue-600 text-base sm:text-lg"
          >
            Go Back
          </button>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded shadow hover:bg-green-600 text-base sm:text-lg"
          >
            Login
          </button>
        </div>
      </div>
    </section>
      <Footer />
    </div>
    
  );
};

export default NotFoundPage;