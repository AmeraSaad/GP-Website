import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo4.png";
import { navItems } from "../constants";

const Navbar = ({ scrollToSection }) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // For navigation

  const handleClick = (section) => {
    if (location.pathname === "/") {
      // If already on home, just scroll
      scrollToSection(section);
    } else {
      // Navigate to home first, then scroll after load
      navigate("/");
      setTimeout(() => scrollToSection(section), 300); // Delay to allow page load
    }
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative lg:text-sm">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <img className="h-12 w-12 mr-2" src={logo} alt="Logo" />
            <span className="text-xl tracking-tight">VocaMind</span>
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                {item.scrollTo ? (
                  <button
                    onClick={() => handleClick(item.scrollTo)}
                    className="text-white hover:text-blue-500 transition"
                  >
                    {item.label}
                  </button>
                ) : (
                  <Link to={item.href} className="text-white hover:text-blue-500 transition">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Sign In & Register Buttons (Desktop) */}
          <div className="hidden lg:flex justify-center space-x-6 items-center">
            <Link to="/signin" className="py-2 px-3 border rounded-md hover:border-blue-500 transition">
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-500 to-purple-800 py-2 px-3 rounded-md transition"
            >
              Create an account
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex flex-col justify-end">
            <button onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileDrawerOpen && (
          <div className="fixed right-0 z-20 bg-neutral-900 w-full p-12 flex flex-col justify-center items-center lg:hidden">
            <ul className="space-y-4">
              {navItems.map((item, index) => (
                <li key={index}>
                  {item.scrollTo ? (
                    <button
                      onClick={() => {
                        handleClick(item.scrollTo);
                        setMobileDrawerOpen(false);
                      }}
                      className="text-white hover:text-blue-500 transition"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="text-white hover:text-blue-500 transition"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Sign In & Register Buttons */}
            <div className="flex space-x-6 mt-6">
              <Link to="/signin" onClick={() => setMobileDrawerOpen(false)} className="py-2 px-3 border rounded-md hover:border-blue-500 transition">
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileDrawerOpen(false)}
                className="py-2 px-3 rounded-md bg-gradient-to-r from-blue-500 to-purple-800 transition"
              >
                Create an account
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
