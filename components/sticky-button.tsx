import React from "react";

const StickyButton = () => {
  return (
    <a
      href="#help-gary"
      className="fixed bottom-0 left-0 w-full bg-gary-pink text-white text-center text-lg font-semibold py-4 shadow-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 transition md:hidden rounded-t-full"
    >
      Buy $GARA
    </a>
  );
};

export default StickyButton;
