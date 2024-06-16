import React from "react";
import { Link } from "react-router-dom";

function BottomWarning({ label, buttonText, to }) {
  return (
    <div className="py-2 w-full px-2 text-center flex justify-center items-center">
      <div>{label}</div>
      <Link to={to} className="pointer underline pl-1 cursor-pointer">
        {buttonText}
      </Link>
    </div>
  );
}

export default BottomWarning;
