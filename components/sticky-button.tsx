import React from "react"

const StickyButton = () => {
  return (
    <a
      id="sticky-button"
      href="#help-gary"
      className="fixed bottom-0 left-0 z-[9999] w-full rounded-t-full bg-gary-pink py-4 text-center text-lg font-semibold text-white shadow-lg transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 md:hidden"
    >
      Buy $GARA
    </a>
  )
}

export default StickyButton
