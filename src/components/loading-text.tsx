import { useEffect, useState } from "react";

export default function LoadingText() {
  const [dots, setDots] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((dots) => (dots + 1) % 4);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <>Loading{".".repeat(dots)}</>;
}
