import React, { useState } from "react";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export default function Topbar(props) {
  const { isSidebarOpen, setIsSidebarOpen, isInMobileMode } = props;
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  return (
    <div className="absolute left-0 top-0 flex h-16 w-full items-center gap-8 bg-red-300 px-10">
      {isInMobileMode && (
        <div className="-ml-8">
          <IconButton
            aria-label="menu"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon sx={{ color: "black", fontSize: "1.8rem" }} />
          </IconButton>
        </div>
      )}
      <div className="relative ml-auto flex items-center gap-8">
        <NotificationsNoneIcon
          className="cursor-pointer"
          sx={{ color: "black", fontSize: "2rem" }}
        />
        <div className="relative">
          <div onClick={() => setIsOpenUserMenu(!isOpenUserMenu)}>
            <AccountCircleIcon
              className="cursor-pointer"
              sx={{ color: "black", fontSize: "2rem" }}
            />
          </div>
          <div
            className={`absolute -bottom-16 -left-16 bg-white p-3 transition-all duration-1000 ${
              isOpenUserMenu ? "visible opacity-100" : "hidden opacity-0"
            }`}
          >
            <div>Profile</div>
            <div>Logout</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Topbar.propTypes = {
  isSidebarOpen: PropTypes.bool,
  setIsSidebarOpen: PropTypes.func,
  isInMobileMode: PropTypes.bool,
};