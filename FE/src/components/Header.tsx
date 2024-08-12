
const Header = () => {
  const banner = localStorage.getItem("banner");
  return ( !banner &&
    <header className="bg-[#7cf5bd] text-center py-1.5">
        {/* <p className="font-[cursive]">Check out our merchandise, available at my shop.</p> */}
        <p className="font-[cursive]">This is monkeyType clone</p>
    </header>
  )
}

export default Header