import React from "react";

const Navbar = () => {
  return (
    <nav className="flex flex-col md:flex-row items-center justify-between pt-4 pb-4 md:pl-40 md:pr-40">
      <div className="flex items-center justify-center md:justify-start">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-white">
          Sign Connection
        </h1>
      </div>
      <div className="md:flex flex-col md:flex-row items-center justify-center md:justify-end mt-4 md:mt-0">
        <ul className="md:flex md:space-x-8">
          <li>
            <a
              href="/"
              className="hover:text-Gris text-white font-medium focus:outline-none focus:text-Azul text-sm md:text-base"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/"
              className="hover:text-Gris text-Gris-claro focus:outline-none focus:text-Azul text-sm md:text-base"
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="/"
              className="hover:text-Gris text-Gris-claro focus:outline-none focus:text-Azul text-sm md:text-base"
            >
              Technology
            </a>
          </li>
          <li>
            <a
              href="/"
              className="hover:text-Gris text-Gris-claro focus:outline-none focus:text-Azul text-sm md:text-base"
            >
              About
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
