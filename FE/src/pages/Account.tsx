import { useEffect } from "react";
import Footer from "../components/Footer"
import Header from "../components/Header"
import Navbar from "../components/Navbar"

const Account = () => {
  const name =localStorage.getItem('name') || "Rabbit";

  useEffect(() => {

  },[]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 text-white">
        <div className="border rounded-lg p-10">
          <h1>{name.split(" ")[0]}</h1>
        </div>
      </section>
      <Footer />
    </div>
  )
}

export default Account