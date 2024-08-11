import { MdEmail } from "react-icons/md";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className='flex justify-between px-20 xl:px-48 py-6 text-[#656769]'>
        <div className="flex gap-3 text-sm">
            <Link to="/contact" className="flex gap-1 items-center hover:text-white/80 hover:active:text-white/20">
                <MdEmail />
                contact
            </Link>
            <a href="/support" className="flex gap-1 items-center hover:text-white/80 hover:active:text-white/20">
                <RiMoneyDollarCircleLine  />
                support
            </a>
            <a href="https://github.com/GauravSinghdev/monkeyType---Clone" target="_blank" className="flex gap-1 items-center hover:text-white/80 hover:active:text-white/20">
                <FaGithub />
                github
            </a>
            <a href="https://twitter.com/codewithkara" target="_blank" className="flex gap-1 items-center hover:text-white/80 hover:active:text-white/20">
                <FaXTwitter />
                twitter
            </a>
        </div>
        <div className="flex gap-3">
            <p className="hover:text-white/80 hover:active:text-white/20 cursor-pointer">@codewithkara</p>
            <p className="hover:text-white/80 hover:active:text-white/20 cursor-pointer">v1.1.0</p>
        </div>
    </footer>
  )
}

export default Footer