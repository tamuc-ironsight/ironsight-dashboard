import React from "react";

import { FaHome, FaUsers, FaBiohazard } from "react-icons/fa";
import { ImLab } from "react-icons/im";
import { GoGraph } from "react-icons/go";
import { RiComputerLine } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { FaNetworkWired } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";

export const NavbarData = [
  {
    name: "Home",
    path: "/home",
    icon: <FaHome />,
    current: true
  },

  {
    name: "Users",
    path: "/users",
    icon: <FaUsers />,
    current: false
 
  },

  {
    name: "Virtual Machines",
    path: "/virtual_machines",
    icon: <RiComputerLine />,
    current: false
  },

  {
    name: "Courses",
    path: "/courses",
    icon: <ImLab />,
    current: false
  },

  {
    name: "Resources",
    path: "/resources",
    icon: <GoGraph />,
    current: false
  },

  {
    name: "Network",
    path: "/network",
    icon: <FaNetworkWired />,
    current: false

  },

  // {
  //   name: "Security",
  //   path: "/security",
  //   icon: <MdSecurity />,
  //   current: false

  // },

  // {
  //   name: "Sandbox",
  //   path: "/sandbox",
  //   icon: <FaBiohazard />,
  //   current: false
  // },

  {
    name: "Settings",
    path: "/settings",
    icon: <IoMdSettings />,
    current: false
  },

];

export const userNavigation = [
  { name: 'Your Profile', path: '#' },
  { name: 'Settings', path: '#' },
  { name: 'Sign out', path: '#/signout' },
]
