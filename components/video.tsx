import { useState } from "react";
import Image from "next/image"; // Assuming you're using Next.js

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative flex h-[300px] w-full max-w-[500px] items-center justify-center rounded-2xl bg-black shadow-lg sm:h-[400px] sm:max-w-[600px] lg:h-[580px] lg:max-w-[926px] drop-shadow-2xl">
      {!isPlaying ? (
        <div
          className="relative flex h-full w-full items-center justify-center rounded-2xl bg-cover bg-center"
          style={{
            backgroundImage: `url(/images/thumbnail.png)`,
          }}
        >
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl" />

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="relative flex items-center justify-center rounded-full bg-gary-yellow px-8 py-4 font-bold text-black shadow-lg hover:bg-yellow-600 focus:outline-none"
          >
            <span className="mr-2 font-black">Play video</span>
            <svg 
              fill="#000000" 
              height="20px" 
              width="20px" 
              version="1.1" 
              id="Layer_1" 
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512" 
            >
              <g>
                <path d="M500.203,236.907L30.869,2.24c-6.613-3.285-14.443-2.944-20.736,0.939C3.84,7.083,0,13.931,0,21.333v469.333
                  c0,7.403,3.84,14.251,10.133,18.155c3.413,2.112,7.296,3.179,11.2,3.179c3.264,0,6.528-0.747,9.536-2.24l469.333-234.667
                  C507.435,271.467,512,264.085,512,256S507.435,240.533,500.203,236.907z"></path>
              </g>
            </svg>
          </button>
        </div>
      ) : (
        <video
          className="h-full w-full rounded-2xl"
          src="video.mp4"
          controls
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoPlayer;
