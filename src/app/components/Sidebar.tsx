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
    <div className="w-20 bg-[#131844] flex flex-col rounded-4xl my-4 items-center space-y-12">
      <Image
        src="/images/final1.png"
        alt="EduAI Logo"
        width={50}
        height={50}
        className="mt-2"
      />
      <FaThLarge
        size={20}
        className="text-gray-50 hover:text-white cursor-pointer mt-4 "
      />
      <FaCalendarAlt
        size={20}
        className="text-gray-600 cursor-pointer rotatemore-on-rtl"
      />
      <FaChartLine size={20} className="text-gray-600  cursor-pointer " />
      <FaSearch size={20} className="text-gray-600  cursor-pointer " />
      <FaCog
        size={20}
        className="text-gray-600 cursor-pointer rotatemore-on-rtl"
      />
      <FaSignOutAlt
        size={20}
        className="text-gray-600 cursor-pointer mt-auto mb-12 rotatemore-on-rtl"
      />
    </div>
  );
}
