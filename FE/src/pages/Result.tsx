import Footer from '../components/Footer'
import Header from '../components/Header'
import Navbar from '../components/Navbar'

const Result = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <section className="flex-grow px-20 xl:px-48 text-white">
        <h1>Result Page</h1>
      </section>
      <Footer />
    </div>
  )
}

export default Result