import React, { useState, useEffect } from 'react';
import { Tweet } from 'react-tweet';
import { Heading } from './heading';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SocialPostsProps {
  tweetIds: string[];
}

const SocialPosts: React.FC<SocialPostsProps> = ({ tweetIds }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [visibleTweets, setVisibleTweets] = useState(3);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Detect if the screen is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint as needed
    };

    handleResize(); // Set the initial state
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    if (isMobile) {
      if (currentIndex + 1 < tweetIds.length) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    } else {
      if (currentIndex + visibleTweets < tweetIds.length) {
        setCurrentIndex((prevIndex) => prevIndex + visibleTweets);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - (isMobile ? 1 : visibleTweets));
    }
  };

  const handleShowAll = () => {
    setVisibleTweets(tweetIds.length);
    setCurrentIndex(0);
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <Heading stroke={false} className="text-center text-3xl lg:text-6xl mb-6">
          Our Social Posts
        </Heading>

        {/* Display tweets */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-3'} gap-6`}>
          {tweetIds.slice(currentIndex, isMobile ? currentIndex + 1 : currentIndex + visibleTweets).map((id) => (
            <Tweet key={id} id={id} theme="dark" />
          ))}
        </div>
        {/* Navigation buttons */}
        <div className="flex justify-center items-center mt-6 space-x-6">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          {!isMobile && visibleTweets < tweetIds.length && (
            <button
              onClick={handleShowAll}
              className="hidden md:flex px-6 py-3 bg-gray-700 text-white font-bold rounded-full hover:bg-gray-600"
            >
              Show All ({tweetIds.length})
            </button>
          )}
          <button
            onClick={handleNext}
            className="p-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white disabled:opacity-50"
            disabled={currentIndex + (isMobile ? 1 : visibleTweets) >= tweetIds.length}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialPosts;
