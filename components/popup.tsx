'use client';

import React from "react";
import Image from "next/image";

export const Popup = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative w-full max-w-md p-6 bg-gradient-to-b from-white to-[#CFEFFF] rounded-2xl shadow-lg text-center">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
      >
        &times;
      </button>
      <h3 className="font-heading text-2xl font-bold text-gary-blue mb-4">
        The presale is starting on 27th of November
      </h3>
      <p className="text-lg text-gray-700">
        Come back soon. We’ll notify you!
      </p>
      <div className="mt-6 flex justify-center">
        <Image
          src="/images/halt.png" // Make sure this path points to the image you want.
          alt="Gary"
          width={150}
          height={150}
          className="rounded-lg"
        />
      </div>
      <button
        onClick={onClose}
        className="mt-8 h-12 px-6 text-lg font-bold text-white bg-gary-pink rounded-lg shadow-md transition-all hover:bg-white hover:text-gary-pink hover:border-gary-pink border-2 border-transparent"
      >
        Close
      </button>
    </div>
  </div>
);
