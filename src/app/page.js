// components/Home.jsx

import Link from "next/link";
import LandingHead from "@/components/LandingHead";

const Home = () => (
  <div className="flex-col items-center justify-center min-h-screen bg-auth-bg bg-cover bg-center">
    <LandingHead />
    <div className="flex flex-col items-center w-full h-fit py-16">
      <h1 className="font-lexend text-5xl text-center mt-20 p-5">
        Revolutionize Your Invoice Management
      </h1>
      <p className="px-8 md:px-56 font-exo text-lg text-center text-gray-400">
        Say goodbye to manual data entry! With InvoicePro, effortlessly extract,
        analyze, and organize invoice details with just a few clicks.
      </p>
      <Link href={"/auth"}>
        <button className="mt-10 px-6 py-3 text-white font-lexend rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700">
          Get Started
        </button>
      </Link>
    </div>
  </div>
);

export default Home;
