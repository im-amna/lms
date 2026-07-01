import React, { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const { isEducator } = useContext(AppContext);

  const isDemo = window.location.pathname.startsWith("/demo");

  const basePath = isDemo ? "/demo" : "/educator";

  const menuItems = [
    {
      name: "Dashboard",
      path: `${basePath}`,
      icon: assets.home_icon,
    },
    ...(!isDemo
      ? [
          {
            name: "Add Course",
            path: `${basePath}/add-course`,
            icon: assets.add_icon,
          },
        ]
      : []),
    {
      name: "My Courses",
      path: `${basePath}/my-courses`,
      icon: assets.my_course_icon,
    },
    {
      name: "Student Enrolled",
      path: `${basePath}/student-enrolled`,
      icon: assets.person_tick_icon,
    },
  ];

  // Demo mode me login ki zarurat nahi
  if (!isDemo && !isEducator) return null;

  return (
    <div className="md:w-64 w-16 border-r min-h-screen text-base border-gray-500 py-2 flex flex-col">
      {menuItems.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          end={item.path === basePath}
          className={({ isActive }) =>
            `flex items-center md:flex-row flex-col md:justify-start justify-center py-3.5 md:px-10 gap-3 ${
              isActive
                ? "bg-indigo-50 border-r-[6px] border-indigo-500/90"
                : "hover:bg-gray-50 border-r-[6px] border-white"
            }`
          }
        >
          <img src={item.icon} alt={item.name} className="w-6 h-6" />
          <p className="md:block hidden">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
