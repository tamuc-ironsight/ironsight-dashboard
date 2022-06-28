import React from "react";
import { themeChange } from "theme-change";
import { useEffect } from "react";

const ThemeButton = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <button className="w-6 h-6 material-icons bg-gray-800 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" data-toggle-theme="ironsight_dark,light" data-act-class="material-icons-outlined">light_mode</button>
  );
};

export default ThemeButton;
