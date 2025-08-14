// src/hooks/useSwipeGestures.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface SwipeGestureOptions {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  preventScrollOnSwipe?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: (x: number, y: number) => void;
  onSwipeEnd?: () => void;
}

interface SwipeState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startTime: number;
  isSwipping: boolean;
  direction: 'left' | 'right' | 'up' | 'down' | null;
}

export const useSwipeGestures = (options: SwipeGestureOptions = {}) => {
  const {
    minSwipeDistance = 50,
    maxSwipeTime = 300,
    preventScrollOnSwipe = true,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onSwipeStart,
    onSwipeEnd,
  } = options;

  const [swipeState, setSwipeState] = useState<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startTime: 0,
    isSwipping: false,
    direction: null,
  });

  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const startTime = Date.now();
    
    setSwipeState({
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      startTime,
      isSwipping: true,
      direction: null,
    });

    onSwipeStart?.(touch.clientX, touch.clientY);

    if (preventScrollOnSwipe) {
      e.preventDefault();
    }
  }, [onSwipeStart, preventScrollOnSwipe]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!swipeState.isSwipping) return;

    const touch = e.touches[0];
    
    setSwipeState(prev => ({
      ...prev,
      currentX: touch.clientX,
      currentY: touch.clientY,
    }));

    if (preventScrollOnSwipe) {
      e.preventDefault();
    }
  }, [swipeState.isSwipping, preventScrollOnSwipe]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!swipeState.isSwipping) return;

    const endTime = Date.now();
    const timeDiff = endTime - swipeState.startTime;
    
    const deltaX = swipeState.currentX - swipeState.startX;
    const deltaY = swipeState.currentY - swipeState.startY;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Check if it's a valid swipe (minimum distance and within time limit)
    if (timeDiff <= maxSwipeTime && (absX >= minSwipeDistance || absY >= minSwipeDistance)) {
      // Determine primary direction (horizontal or vertical)
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0) {
          onSwipeRight?.();
          setSwipeState(prev => ({ ...prev, direction: 'right' }));
        } else {
          onSwipeLeft?.();
          setSwipeState(prev => ({ ...prev, direction: 'left' }));
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          onSwipeDown?.();
          setSwipeState(prev => ({ ...prev, direction: 'down' }));
        } else {
          onSwipeUp?.();
          setSwipeState(prev => ({ ...prev, direction: 'up' }));
        }
      }
    }

    setSwipeState(prev => ({
      ...prev,
      isSwipping: false,
    }));

    onSwipeEnd?.();

    if (preventScrollOnSwipe) {
      e.preventDefault();
    }
  }, [swipeState, maxSwipeTime, minSwipeDistance, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onSwipeEnd, preventScrollOnSwipe]);

  // Attach event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventScrollOnSwipe });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScrollOnSwipe });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventScrollOnSwipe });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventScrollOnSwipe]);

  // Helper function to get swipe progress (useful for animations)
  const getSwipeProgress = (): { x: number; y: number; distance: number } => {
    if (!swipeState.isSwipping) return { x: 0, y: 0, distance: 0 };
    
    const deltaX = swipeState.currentX - swipeState.startX;
    const deltaY = swipeState.currentY - swipeState.startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    return { x: deltaX, y: deltaY, distance };
  };

  return {
    elementRef,
    swipeState,
    getSwipeProgress,
    isSwipping: swipeState.isSwipping,
    direction: swipeState.direction,
  };
};