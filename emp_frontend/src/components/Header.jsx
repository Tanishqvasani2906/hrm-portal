import { CiSettings, CiBellOn } from "react-icons/ci";
import { VscThreeBars } from "react-icons/vsc";
import { RxCross1 } from "react-icons/rx";

const Header = ({ isOpen, setIsOpen }) => {
  const username = localStorage.getItem("username");
  return (
    <header className="bg-primary_color text-white fixed top-0 left-0 w-full flex items-center justify-between p-5 z-[1000] md:z-[1000]">
      <div className="flex flex-col items-center cursor-pointer">
        <span className="font-michroma font-extrabold">Employee</span>
        <span className="font-michroma font-normal text-xs">Governance</span>
      </div>
      <nav className="hidden md:flex gap-10">
        <a href="#dashboard" className="text-white text-lg font-metrophobic">
          Dashboard
        </a>
        <a href="#notice" className="text-white text-lg font-metrophobic">
          Notice
        </a>
        <a
          href="#apply-for-leave"
          className="text-white text-lg font-metrophobic"
        >
          Apply for leave
        </a>
        {/* <a href="#access-asset" className="text-white text-lg font-metrophobic">
          Access/Asset
        </a> */}
        <a href="#salary-slip" className="text-white text-lg font-metrophobic">
          Salary Slip
        </a>
      </nav>
      <div className="flex items-center gap-4">
        {/* <div className="relative">
          <CiBellOn className="text-2xl cursor-pointer" />
          <span className="absolute top-[-5px] right-[-10px] bg-red-500 text-white rounded-full px-1 py-0 text-xs cursor-pointer">
            10
          </span>
        </div> */}
        <CiSettings className="text-2xl cursor-pointer" />
        {username ? (
          <div className="flex items-center cursor-pointer">
            <div className="bg-white text-[#01008A] rounded-full px-2 py-2 mr-2 font-bold">
              {username ? username.slice(0, 2).toUpperCase() : ""}
            </div>
            <span className="text-lg font-metrophobic">
              {" "}
              {username.charAt(0).toUpperCase() + username.slice(1)}
            </span>
            {/* <div className="flex items-center cursor-pointer">
              <div className="bg-white text-[#01008A] rounded-full px-2 py-2 mr-2 font-bold">
                TV
              </div>
            </div> */}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="block md:hidden">
        <button
          className="text-white text-2xl"
          aria-label="Toggle menu"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <RxCross1 /> : <VscThreeBars />}
        </button>
      </div>
    </header>
  );
};

export default Header;
