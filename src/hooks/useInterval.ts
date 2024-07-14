import { useRef, useEffect } from "react";
export function useInterval(callback: () => void, delay: number | null): void {
    const callBackRef = useRef(callback);
    useEffect(() => {
        callBackRef.current = callback;
    }, [callback]);
    useEffect(() => {
        if (delay === null) {
            return;
        }
        const intervalId = setInterval(() => callBackRef.current(), delay);
        return () => clearInterval(intervalId);
    }, [delay]);
}