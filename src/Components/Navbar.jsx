/* This example requires Tailwind CSS v2.0+ */
import React, { useState, useEffect } from "react";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { NavLink, Link } from "react-router-dom";
import { NavbarData, userNavigation } from "./NavbarData";
import styled from "styled-components";
import "../App.css";
import ThemeButton from "./ThemeButton";
import { useQuery } from "react-query";
import { getUsersList } from "../IronsightAPI";

const DesktopLinks = styled.div`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
  list-style: none;
  height: 35px;
  text-decoration: none;
  font-size: 18px;
`;

const MobileLink = styled(NavLink)`
  display: flex;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
  list-style: none;
  height: 35px;
  text-decoration: none;
  font-size: 18px;
  &:hover {
    background: #1c1d1f;
    border-left: 4px solid #632ce4;
    cursor: pointer;
  }
`;

const NavbarLabel = styled.span`
  margin-left: 5px;
`;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data, isLoading, isError } = useQuery("users_list", getUsersList);
  const currentUser = localStorage.getItem("ironsight_username");
  // Check for a link to a profile picture
  var profile_pic_data =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png";
  // Check the users_list for the current user
  if (!isLoading && !isError) {
    for (let i = 0; i < data.length; i++) {
      if (data[i]["user_name"] === currentUser) {
        if (data[i]["profile_pic_data"] !== null) {
          profile_pic_data = data[i]["profile_pic_data"];
        }
      }
    }
  }

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center lg:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex-1 flex items-center justify-center lg:items-stretch lg:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src={"/logo_horizontal.png"}
                    alt="Ironsight Banner"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src={"/logo_horizontal.png"}
                    alt="Ironsight Logo"
                  />
                </div>

                <div className="hidden lg:block lg:ml-6">
                  <DesktopLinks>
                    {NavbarData.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-semibold"
                            : "text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </DesktopLinks>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 lg:static lg:inset-auto lg:ml-6 lg:pr-0">
                <ThemeButton />
                {/* Profile dropdown */}
                {/* Bring to top of z-depth */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src={profile_pic_data}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none -z-[-1]">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.path}
                              className={classNames(
                                active ? "bg-gray-500" : "text-gray-300",
                                "block px-4 py-2 text-sm text-gray-900"
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile NavBar */}
          <Disclosure.Panel className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {NavbarData.map((item) => (
                <MobileLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    isActive
                      ? "bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-semibold"
                      : "text-gray-300 hover:bg-gray-900 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                  }
                >
                  {item.icon}
                  <NavbarLabel>{item.name}</NavbarLabel>
                </MobileLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
