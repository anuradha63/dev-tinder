import { useState, useRef, useEffect } from "react";

const CardCarousel = ({
  items = [],
  renderCard,
  title,
  showPagination = true,
}) => {
  const [index, setIndex] = useState(0);
  const total = items.length;
  const [isMobile, setIsMobile] = useState(false);

  // Touch swipe state
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 50; // px

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swiped left (ignored)
        if (index < total - 1) {
          setIndex(index + 1);
        } else {
          setIndex(0); // Loop to start
        }
      } else {
        // Swiped right (interested)
        if (index < total - 1) {
          setIndex(index + 1);
        } else {
          setIndex(0); // Loop to start
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!Array.isArray(items) || total === 0) {
    return (
      <div className="flex flex-col items-center my-10">
        <span className="text-gray-400 text-3xl mb-2">😕</span>
        <div className="text-gray-500 font-semibold">No items found.</div>
      </div>
    );
  }

  const goToPrev = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((i) => Math.max(i - 1, 0));
  };

  const goToNext = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIndex((i) => Math.min(i + 1, total - 1));
  };

  return (
    <div className="w-full flex flex-col items-center">
      {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}

      <div
        className="relative w-full max-w-md flex items-center justify-center"
        onTouchStart={isMobile ? onTouchStart : undefined}
        onTouchMove={isMobile ? onTouchMove : undefined}
        onTouchEnd={isMobile ? onTouchEnd : undefined}
      >
        {/* Left button - only show on desktop */}
        {!isMobile && (
          <button
            className="absolute -left-24 md:-left-28 top-1/2 btn btn-ghost rounded-full shadow-lg border border-gray-300 bg-white hover:bg-primary transition disabled:opacity-40 disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center group focus:outline-none"
            style={{ width: 60, height: 60, transform: "translateY(-50%)" }}
            onClick={goToPrev}
            disabled={index === 0}
            aria-label="Previous"
          >
            <svg
              width="36"
              height="36"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="font-extrabold transition-colors duration-200 group-hover:text-white text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}

        {/* Card */}
        <div className="w-full flex justify-center">
          {renderCard(items[index], index, true)}
        </div>

        {/* Right button - only show on desktop */}
        {!isMobile && (
          <button
            className="absolute -right-24 md:-right-28 top-1/2 btn btn-ghost rounded-full shadow-lg border border-gray-300 bg-white hover:bg-primary transition disabled:opacity-40 disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center group focus:outline-none"
            style={{ width: 60, height: 60, transform: "translateY(-50%)" }}
            onClick={goToNext}
            disabled={index === total - 1}
            aria-label="Next"
          >
            <svg
              width="36"
              height="36"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="font-extrabold transition-colors duration-200 group-hover:text-white text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CardCarousel;
