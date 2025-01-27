"use client";
import Button from "antd/es/button";
import React from "react";
import toast from "react-hot-toast";

function Header() {
  return (
    <div className="bg-emerald-500 fixed w-full h-20 z-50 flex items-centers">
      <div className="px-5 w-full max--[1920px] flex justify-between items-center mx-auto">
        <div className="text-2xl text-white font-semibold">VIDEO BOOK</div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              toast.success("okokoko");
            }}
            type="primary"
          >
            Sign In
          </Button>
          <Button
            onClick={() => {
              toast.success("ooooooo");
            }}
            type="default"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
