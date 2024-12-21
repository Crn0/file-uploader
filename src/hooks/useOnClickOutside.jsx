import { useEffect } from 'react';

export default function useOnClickOutside(
  ref,
  handler,
  done = false,
  on = false,
  hasChildModal = false,
) {
  useEffect(() => {
    if (done && on) {
      handler();
    }

    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target) || hasChildModal) return;

      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, done, on, hasChildModal]);
}
