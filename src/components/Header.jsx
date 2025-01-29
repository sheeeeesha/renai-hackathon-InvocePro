import React from "react";
import { Users } from "lucide-react";
import Link from "next/link";

const Header = () => (
  <header className="bg-white text-black p-2 w-full shadow-md">
    <div className="flex container mx-auto justify-between  px-14 items-center">
      <h1 className="text-2xl font-bold font-lexend">InvoicePro</h1>
      <Link href={"/client"}>
        <button className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700">
          <Users className="h-8 w-8 inline-block" />
        </button>
      </Link>
    </div>
  </header>
);

export default Header;
