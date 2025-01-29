import Link from "next/link";
import React from "react";

function LandingHead() {
  return (
    <div className="bg-white p-5 tb-10 w-full h-10 flex justify-between items-center">
      <div className="font-exo text-xl text-black">
        <span>logo</span>
        <span className="font-bold px-5">InvoicePro</span>
      </div>

      <div className="font-exo text-xl text-black">
        <button className="relative w-16 h-6 rounded-lg ring-offset-2 ring-2 ring-black font-bold text-black bg-white hover:text-white overflow-hidden group">
          <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          <Link href="/auth"> <span className="relative z-10">Login</span> </Link>
        </button>
      </div>
    </div>
  );
}

export default LandingHead;
