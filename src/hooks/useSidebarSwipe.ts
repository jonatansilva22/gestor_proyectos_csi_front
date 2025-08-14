// src/hooks/useSidebarSwipe.ts
import { useCallback, useRef, useEffect } from 'react';
import { useSwipeGestures } from './useSwipeGestures';

interface SidebarSwipeOptions {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  enabled?: boolean;
  swipeThreshold?: number;
  edgeSwipeZone?: number; // Width of the edge zone for opening swipes
}

export const useSidebarSwipe = ({
  isOpen,
  onOpen,
  onClose,
  enabled = true,
  swipeThreshold = 50,
  edgeSwipeZone = 50,
}: SidebarSwipeOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSwipeFromEdge = useRef(false);

  // Handle swipe gestures for sidebar
  const swipeGestures = useSwipeGestures({
    minSwipeDistance: swipeThreshold,
    maxSwipeTime: 500,
    preventScrollOnSwipe: false,
    onSwipeStart: (x) => {
      // Check if swipe started from left edge (for opening)
      isSwipeFromEdge.current = x <= edgeSwipeZone;
    },
    onSwipeRight: () => {
      if (!enabled) return;
      
      // Open sidebar if swiping from left edge or if sidebar is closed
      if (!isOpen && isSwipeFromEdge.current) {
        onOpen();
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    },
    onSwipeLeft: () => {
      if (!enabled) return;
      
      // Close sidebar if it's open and not swiping from edge
      if (isOpen && !isSwipeFromEdge.current) {
        onClose();
        // Haptic feedback
        if ('vibrate' in navigator) {
          navigator.vibrate(30);
        }
      }
    },
  });

  // Enhanced swipe detection for sidebar-specific interactions
  const handleSwipeInteraction = useCallback((element: HTMLElement | null) => {
    if (!element || !enabled) return;

    let startX: number;
    let startY: number;
    let currentX: number;
    let isTracking = false;
    let swipeStartTime: number;

    const handleStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      currentX = startX;
      isTracking = true;
      swipeStartTime = Date.now();
      
      // Check if starting from edge
      isSwipeFromEdge.current = startX <= edgeSwipeZone;
    };

    const handleMove = (e: TouchEvent) => {
      if (!isTracking) return;
      
      const touch = e.touches[0];
      currentX = touch.clientX;
      
      const deltaX = currentX - startX;
      const deltaY = touch.clientY - startY;
      
      // If vertical movement is too much, stop tracking
      if (Math.abs(deltaY) > Math.abs(deltaX) * 2) {
        isTracking = false;
        return;
      }
      
      // Visual feedback for sidebar opening (optional - could animate sidebar position)
      if (!isOpen && isSwipeFromEdge.current && deltaX > 0) {
        // Could add visual feedback here
        // For example: slightly show sidebar as user swipes
      }
    };

    const handleEnd = () => {
      if (!isTracking) return;
      
      isTracking = false;
      const deltaX = currentX - startX;
      const swipeTime = Date.now() - swipeStartTime;
      const velocity = Math.abs(deltaX) / swipeTime;
      
      // Determine if it's a valid swipe
      const isValidSwipe = Math.abs(deltaX) > swipeThreshold || velocity > 0.5;
      
      if (isValidSwipe) {
        if (deltaX > 0 && !isOpen && isSwipeFromEdge.current) {
          // Opening swipe from left edge
          onOpen();
          if ('vibrate' in navigator) {
            navigator.vibrate(50);
          }
        } else if (deltaX < 0 && isOpen) {
          // Closing swipe when sidebar is open
          onClose();
          if ('vibrate' in navigator) {
            navigator.vibrate(30);
          }
        }
      }
    };

    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('touchmove', handleMove, { passive: true });
    element.addEventListener('touchend', handleEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchmove', handleMove);
      element.removeEventListener('touchend', handleEnd);
    };
  }, [enabled, isOpen, onOpen, onClose, swipeThreshold, edgeSwipeZone]);

  // Attach swipe detection to container
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      return handleSwipeInteraction(container);
    }
  }, [handleSwipeInteraction]);

  // Keyboard shortcuts for accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enabled) return;
      
      // ESC to close sidebar
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      
      // Ctrl/Cmd + \ to toggle sidebar
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enabled, isOpen, onOpen, onClose]);

  return {
    containerRef,
    swipeGestures,
    isSwipeFromEdge: isSwipeFromEdge.current,
  };
};