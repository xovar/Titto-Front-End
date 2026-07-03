import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // ⚡ পেজ চেঞ্জ হলেই স্ক্রল একদম উপরে চলে যাবে
  }, [pathname]);

  return null;
}