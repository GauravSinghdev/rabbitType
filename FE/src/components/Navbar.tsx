import { FaRegKeyboard } from "react-icons/fa";
import { IoInformationOutline } from "react-icons/io5";
import { FaCrown } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FaBell } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { PiRabbit } from "react-icons/pi";

import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  //console.log(token);
  const name = localStorage.getItem('name') || "Rabbit";

  const handleLogout = () => {
    if(localStorage.getItem('token'))
    {
      localStorage.clear();
      navigate('/login');
    }
  }
  return (
    <nav className="h-16 flex justify-between px-20 xl:py-14 xl:px-48 items-center">
      <div className="flex items-center gap-2">
        <a href="/">
          <PiRabbit  className="h-10 w-10 mb-2 text-[#7cf5bd]" />
        </a>
        <a href="/" className="text-4xl me-4 text-[#d1d0c5] relative">
          <div>rabbitType</div>
          <span className="text-xs absolute left-1 bottom-8 text-white/40">rabbit see</span>
        </a>
        <div className="flex items-center gap-5 text-[#656769] mt-2">
          <a href="/" title="start test">
            <FaRegKeyboard className="h-5 w-5 hover:text-white/80 hover:active:text-white/20" />
          </a>
          <Link to="/leaders" title="leaderboard">
            <FaCrown className="h-5 w-5 hover:text-white/80 hover:active:text-white/20" />
          </Link>
          <Link to="/about" title="about">
            <IoInformationOutline className="h-6 w-6 hover:text-white/80 hover:active:text-white/20" />
          </Link>
          <Link to="/settings" title="settings">
            <IoIosSettings className="h-5 w-5 hover:text-white/80 hover:active:text-white/20" />
          </Link>
        </div>
      </div>
      <div>
        { !token ? (
          <div className="flex items-center gap-6 text-[#656769] mt-2 me-5">
            <Link to="/notification">
              <FaBell className="h-4 w-4 hover:text-white/80 hover:active:text-white/20" />
            </Link>
            <Link to="/login">
              <FaRegUser className="h-4 w-4 hover:text-white/80 hover:active:text-white/20" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6 text-[#656769] mt-2 me-5">
            <Link to="/account" className="flex hover:text-white/80 gap-1 hover:active:text-white/20 items-center">
              <FaRegUser className="size-5 " />
              <span className="text-base">{name.split(' ')[0]}</span>
            </Link>
            <Link to="/notification">
              <FaBell className="h-4 w-4 hover:text-white/80 hover:active:text-white/20" />
            </Link>
            <button onClick={handleLogout}>
                <RiLogoutBoxRLine className="h-4 w-4 hover:text-white/80 hover:active:text-white/20" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
