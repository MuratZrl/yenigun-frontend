import React from "react";
import { ChevronUp } from "lucide-react";

const GoToTop = () => {
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        document.querySelector(".aaa")?.classList.add("animate-bounce");
        document.querySelector(".aaa")?.classList.add("flex");
        document.querySelector(".aaa")?.classList.remove("hidden");
      } else {
        document.querySelector(".aaa")?.classList.remove("animate-bounce");
        document.querySelector(".aaa")?.classList.add("hidden");
        document.querySelector(".aaa")?.classList.remove("flex");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="fixed aaa bottom-5 right-5 z-50">
        <button
          onClick={handleClick}
          className="border border-custom-pink backdrop-blur-sm hover:bg-custom-pink text-custom-orange duration-500 hover:text-white p-3 rounded-full shadow-lg"
        >
          <ChevronUp size={20} />
        </button>
      </div>
    </div>
  );
};

export default GoToTop;
