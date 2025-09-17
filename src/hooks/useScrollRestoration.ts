import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
const scrollPositions = new Map<string, number>();
export const useScrollRestoration = (containerId: string = "main-scroll-container", loading?: boolean) => {
    const location = useLocation();
    const containerRef = useRef<HTMLElement | null>(null);
    const restoreTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const hasRestoredRef = useRef(false);
    useEffect(() => {
        const getContainer = (): HTMLElement | Window => {
            if (containerRef.current) return containerRef.current;
            return document.getElementById(containerId) || window;
        };
        const saveScrollPosition = () => {
            const container = getContainer();
            if (container) {
                const scrollTop = container === window ? window.scrollY : (container as HTMLElement).scrollTop;
                scrollPositions.set(location.pathname, scrollTop);
            }
        };
        const restoreScrollPosition = () => {
            if (hasRestoredRef.current) return;
            const container = getContainer();
            if (container) {
                const savedPosition = scrollPositions.get(location.pathname) || 0;
                const restoreWithDelay = () => {
                    const currentHeight = container === window ? document.documentElement.scrollHeight : (container as HTMLElement).scrollHeight;
                    if (currentHeight > savedPosition && savedPosition > 0) {
                        if (container === window) {
                            window.scrollTo(0, savedPosition);
                        } else {
                            (container as HTMLElement).scrollTo(0, savedPosition);
                        }
                        hasRestoredRef.current = true;
                    } else if (loading === false) {
                        if (container === window) {
                            window.scrollTo(0, savedPosition);
                        } else {
                            (container as HTMLElement).scrollTo(0, savedPosition);
                        }
                        hasRestoredRef.current = true;
                    } else {
                        if (restoreTimeoutRef.current) {
                            clearTimeout(restoreTimeoutRef.current);
                        }
                        restoreTimeoutRef.current = setTimeout(restoreWithDelay, 100);
                    }
                };
                requestAnimationFrame(() => {
                    setTimeout(restoreWithDelay, 200);
                });
            }
        };
        const handleScroll = () => {
            saveScrollPosition();
        };
        const handleBeforeUnload = () => {
            saveScrollPosition();
        };
        const container = getContainer();
        if (container !== window) {
            containerRef.current = container as HTMLElement;
        }
        hasRestoredRef.current = false;
        restoreScrollPosition();
        if (container) {
            container.addEventListener("scroll", handleScroll, { passive: true });
        }
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
            window.removeEventListener("beforeunload", handleBeforeUnload);
            if (restoreTimeoutRef.current) {
                clearTimeout(restoreTimeoutRef.current);
            }
        };
    }, [location.pathname, containerId, loading]);

    return containerRef;
};
