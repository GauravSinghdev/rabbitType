import Footer from "../components/Footer";
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const Home = () => {
//   const random = [
//     "Life's too short to skip dessert, so always treat yourself. Adventure awaits, go find it and embrace every opportunity. Dream big, work hard, and stay humble along the journey. Happiness is homemade, and it often comes from the simplest things",
//     "Live in the moment, cherish the memories, and let go of what's out of your control. Good vibes only should be your mantra, as positivity attracts positivity. Make today ridiculously amazing by doing something you love. Smile, it's free therapy and can brighten someone's day.",
//     "Remember, the best is yet to come, so keep pushing forward. Above all, be yourself; everyone else is already taken, and your uniqueness is your strength."
// ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 text-white">
        <h1>Home Page</h1>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
