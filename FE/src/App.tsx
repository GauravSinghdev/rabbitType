import { BrowserRouter, Route, Routes } from 'react-router-dom'

import NotFoundPage from './pages/NotFoundPage'
import Auth from './pages/Auth'
import Home from './pages/Home'
import Leader from './pages/Leaders'
import Settings from './pages/Settings'
import Result from './pages/Result'
import Account from './pages/Account'
import Notification from './pages/Notification'
import Support from './pages/Support'
import Contact from './pages/Contact'
import About from './pages/About'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/leaders" element={<Leader />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/result" element={<Result />} />
          <Route path="/account" element={<Account />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App