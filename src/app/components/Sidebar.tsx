import Image from "next/image";
import {
  FaThLarge,
  FaChartLine,
  FaSearch,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-20 bg-[#131844] hidden lg:flex flex-col  rounded-4xl my-4 items-center space-y-12">
      <Image
        src="/images/final1.png"
        alt="EduAI Logo"
        width={50}
        height={50}
        className="mt-2"
      />
      <FaThLarge size={20} className="text-gray-50 hover:text-white  mt-4 " />
      <FaCalendarAlt size={20} className="text-gray-600  rotatemore-on-rtl" />
      <FaChartLine size={20} className="text-gray-600   " />
      <FaSearch size={20} className="text-gray-600   " />
      <FaCog size={20} className="text-gray-600  rotatemore-on-rtl" />
      <FaSignOutAlt
        size={20}
        className="text-gray-600  mt-auto mb-12 rotatemore-on-rtl"
      />
    </div>
  );
}
