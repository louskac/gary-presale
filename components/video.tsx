import { useState } from "react";

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full aspect-[16/9] rounded-lg bg-black shadow-lg">
      {!isPlaying ? (
        <div
          className="relative flex h-full w-full items-center justify-center rounded-lg bg-cover bg-center"
          style={{
            backgroundImage: `url(/images/thumbnail.png)`,
          }}
        >
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg" />

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="relative flex items-center justify-center rounded-full bg-gary-yellow px-10 py-5 font-bold text-black shadow-lg hover:bg-yellow-600 focus:outline-none"
          >
            <span className="mr-3 font-black">Play video</span>
            <svg
              fill="#000000"
              height="24px"
              width="24px"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path d="M500.203,236.907L30.869,2.24c-6.613-3.285-14.443-2.944-20.736,0.939C3.84,7.083,0,13.931,0,21.333v469.333 c0,7.403,3.84,14.251,10.133,18.155c3.413,2.112,7.296,3.179,11.2,3.179c3.264,0,6.528-0.747,9.536-2.24l469.333-234.667 C507.435,271.467,512,264.085,512,256S507.435,240.533,500.203,236.907z"></path>
            </svg>
          </button>
        </div>
      ) : (
        <video
          className="w-full h-full object-cover rounded-lg"
          src="video.mp4"
          controls
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoPlayer;