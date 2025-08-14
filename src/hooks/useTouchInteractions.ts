// src/hooks/useTouchInteractions.ts
import { useRef, useEffect, useCallback } from 'react';
import { useHapticFeedback } from '../utils/hapticFeedback';

interface TouchInteractionOptions {
  onTap?: (event: TouchEvent) => void;
  onLongPress?: (event: TouchEvent) => void;
  onDoubleTap?: (event: TouchEvent) => void;
  longPressDelay?: number;
  doubleTapDelay?: number;
  preventDefaultOnTouch?: boolean;
  hapticFeedback?: boolean;
  tapHapticPattern?: 'light' | 'medium' | 'heavy' | 'selection';
  longPressHapticPattern?: 'light' | 'medium' | 'heavy' | 'warning';
}

export const useTouchInteractions = (options: TouchInteractionOptions = {}) => {
  const {
    onTap,
    onLongPress,
    onDoubleTap,
    longPressDelay = 500,
    doubleTapDelay = 300,
    preventDefaultOnTouch = false,
    hapticFeedback: enableHaptic = true,
    tapHapticPattern = 'light',
    longPressHapticPattern = 'medium',
  } = options;

  const elementRef = useRef<HTMLElement | null>(null);
  const touchState = useRef({
    startTime: 0,
    lastTapTime: 0,
    tapCount: 0,
    longPressTimer: null as NodeJS.Timeout | null,
    doubleTapTimer: null as NodeJS.Timeout | null,
    isLongPress: false,
    startX: 0,
    startY: 0,
  });

  const { vibrate } = useHapticFeedback();

  const clearTimers = useCallback(() => {
    if (touchState.current.longPressTimer) {
      clearTimeout(touchState.current.longPressTimer);
      touchState.current.longPressTimer = null;
    }
    if (touchState.current.doubleTapTimer) {
      clearTimeout(touchState.current.doubleTapTimer);
      touchState.current.doubleTapTimer = null;
    }
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();
    
    touchState.current = {
      ...touchState.current,
      startTime: now,
      isLongPress: false,
      startX: touch.clientX,
      startY: touch.clientY,
    };

    clearTimers();

    // Setup long press timer
    if (onLongPress) {
      touchState.current.longPressTimer = setTimeout(() => {
        touchState.current.isLongPress = true;
        if (enableHaptic) {
          vibrate(longPressHapticPattern);
        }
        onLongPress(e);
      }, longPressDelay);
    }

    if (preventDefaultOnTouch) {
      e.preventDefault();
    }
  }, [onLongPress, longPressDelay, clearTimers, preventDefaultOnTouch, enableHaptic, vibrate, longPressHapticPattern]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchState.current.startX);
    const deltaY = Math.abs(touch.clientY - touchState.current.startY);
    
    // If finger moves too much, cancel long press
    if (deltaX > 10 || deltaY > 10) {
      clearTimers();
    }

    if (preventDefaultOnTouch) {
      e.preventDefault();
    }
  }, [clearTimers, preventDefaultOnTouch]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const now = Date.now();
    const timeDiff = now - touchState.current.lastTapTime;
    
    clearTimers();

    // Don't trigger tap if it was a long press
    if (touchState.current.isLongPress) {
      return;
    }

    // Handle double tap
    if (onDoubleTap && timeDiff < doubleTapDelay && touchState.current.tapCount === 1) {
      touchState.current.tapCount = 0;
      touchState.current.lastTapTime = 0;
      if (enableHaptic) {
        vibrate('medium');
      }
      onDoubleTap(e);
      return;
    }

    // Handle single tap
    if (onTap) {
      if (onDoubleTap) {
        // Delay single tap to check for double tap
        touchState.current.tapCount = 1;
        touchState.current.lastTapTime = now;
        
        touchState.current.doubleTapTimer = setTimeout(() => {
          if (touchState.current.tapCount === 1) {
            touchState.current.tapCount = 0;
            touchState.current.lastTapTime = 0;
            if (enableHaptic) {
              vibrate(tapHapticPattern);
            }
            onTap(e);
          }
        }, doubleTapDelay);
      } else {
        // Immediate single tap
        if (enableHaptic) {
          vibrate(tapHapticPattern);
        }
        onTap(e);
      }
    }

    if (preventDefaultOnTouch) {
      e.preventDefault();
    }
  }, [onTap, onDoubleTap, doubleTapDelay, clearTimers, preventDefaultOnTouch, enableHaptic, vibrate, tapHapticPattern]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Attach event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: !preventDefaultOnTouch });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultOnTouch });
    element.addEventListener('touchend', handleTouchEnd, { passive: !preventDefaultOnTouch });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventDefaultOnTouch]);

  return {
    elementRef,
    clearTimers,
  };
};

// Enhanced button component with touch interactions
export const useTouchButton = (onClick?: () => void, options: Omit<TouchInteractionOptions, 'onTap'> = {}) => {
  return useTouchInteractions({
    ...options,
    onTap: onClick ? () => onClick() : undefined,
  });
};

// Enhanced touch area component
export const useTouchArea = (handlers: {
  onTap?: () => void;
  onLongPress?: () => void;
  onDoubleTap?: () => void;
}, options: Omit<TouchInteractionOptions, 'onTap' | 'onLongPress' | 'onDoubleTap'> = {}) => {
  return useTouchInteractions({
    ...options,
    onTap: handlers.onTap ? () => handlers.onTap!() : undefined,
    onLongPress: handlers.onLongPress ? () => handlers.onLongPress!() : undefined,
    onDoubleTap: handlers.onDoubleTap ? () => handlers.onDoubleTap!() : undefined,
  });
};