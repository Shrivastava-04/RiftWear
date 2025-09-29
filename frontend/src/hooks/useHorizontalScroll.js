import { useRef, useEffect } from "react";

/**
 * A custom React hook that translates vertical mouse wheel scrolling into
 * horizontal scrolling for a specific element.
 */
export const useHorizontalScroll = () => {
  const elRef = useRef();

  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e) => {
        // If there's no vertical scroll, do nothing
        if (e.deltaY === 0) return;

        // Prevent the default vertical page scroll
        e.preventDefault();

        // Manually adjust the element's horizontal scroll position
        // We add the vertical scroll amount (e.deltaY) to the horizontal scroll position.
        el.scrollLeft += e.deltaY;
      };

      // Add the event listener to the element
      el.addEventListener("wheel", onWheel);

      // Clean up the event listener when the component is unmounted
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, []); // The empty array ensures this effect runs only once

  return elRef; // The hook returns the ref to be attached to your scrollable div
};
