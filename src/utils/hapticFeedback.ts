// src/utils/hapticFeedback.ts

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface HapticConfig {
  pattern: number | number[];
  condition?: () => boolean;
}

const hapticPatterns: Record<HapticPattern, HapticConfig> = {
  light: {
    pattern: 10,
    condition: () => true,
  },
  medium: {
    pattern: 30,
    condition: () => true,
  },
  heavy: {
    pattern: 50,
    condition: () => true,
  },
  success: {
    pattern: [50, 50, 50],
    condition: () => true,
  },
  warning: {
    pattern: [30, 100, 30],
    condition: () => true,
  },
  error: {
    pattern: [100, 50, 100, 50, 100],
    condition: () => true,
  },
  selection: {
    pattern: 20,
    condition: () => true,
  },
};

class HapticFeedbackManager {
  private isEnabled: boolean = true;
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'vibrate' in navigator && typeof navigator.vibrate === 'function';
    
    // Check user preferences if available
    this.loadPreferences();
  }

  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem('haptic-feedback-enabled');
      if (saved !== null) {
        this.isEnabled = JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Could not load haptic feedback preferences:', error);
    }
  }

  public savePreferences(): void {
    try {
      localStorage.setItem('haptic-feedback-enabled', JSON.stringify(this.isEnabled));
    } catch (error) {
      console.warn('Could not save haptic feedback preferences:', error);
    }
  }

  public isHapticSupported(): boolean {
    return this.isSupported;
  }

  public isHapticEnabled(): boolean {
    return this.isEnabled && this.isSupported;
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    this.savePreferences();
  }

  public vibrate(pattern: HapticPattern | number | number[]): void {
    if (!this.isHapticEnabled()) {
      return;
    }

    try {
      let vibratePattern: number | number[];
      
      if (typeof pattern === 'string') {
        const config = hapticPatterns[pattern];
        if (!config || (config.condition && !config.condition())) {
          return;
        }
        vibratePattern = config.pattern;
      } else {
        vibratePattern = pattern;
      }

      navigator.vibrate(vibratePattern);
    } catch (error) {
      console.warn('Haptic feedback error:', error);
    }
  }

  // Convenience methods
  public light(): void {
    this.vibrate('light');
  }

  public medium(): void {
    this.vibrate('medium');
  }

  public heavy(): void {
    this.vibrate('heavy');
  }

  public success(): void {
    this.vibrate('success');
  }

  public warning(): void {
    this.vibrate('warning');
  }

  public error(): void {
    this.vibrate('error');
  }

  public selection(): void {
    this.vibrate('selection');
  }

  // Navigation-specific patterns
  public navigationTap(): void {
    this.vibrate([30]);
  }

  public backNavigation(): void {
    this.vibrate([20, 20, 30]);
  }

  public sidebarOpen(): void {
    this.vibrate([40, 20, 60]);
  }

  public sidebarClose(): void {
    this.vibrate([30, 20, 20]);
  }

  public menuSelection(): void {
    this.vibrate([25]);
  }

  public importantAction(): void {
    this.vibrate([50, 100, 50]);
  }

  public swipeGesture(): void {
    this.vibrate([15, 15, 25]);
  }
}

// Export singleton instance
export const hapticFeedback = new HapticFeedbackManager();

// Hook for React components
export const useHapticFeedback = () => {
  return {
    hapticFeedback,
    isSupported: hapticFeedback.isHapticSupported(),
    isEnabled: hapticFeedback.isHapticEnabled(),
    setEnabled: (enabled: boolean) => hapticFeedback.setEnabled(enabled),
    
    // Convenience methods
    vibrate: (pattern: HapticPattern | number | number[]) => hapticFeedback.vibrate(pattern),
    light: () => hapticFeedback.light(),
    medium: () => hapticFeedback.medium(),
    heavy: () => hapticFeedback.heavy(),
    success: () => hapticFeedback.success(),
    warning: () => hapticFeedback.warning(),
    error: () => hapticFeedback.error(),
    selection: () => hapticFeedback.selection(),
    
    // Navigation-specific
    navigationTap: () => hapticFeedback.navigationTap(),
    backNavigation: () => hapticFeedback.backNavigation(),
    sidebarOpen: () => hapticFeedback.sidebarOpen(),
    sidebarClose: () => hapticFeedback.sidebarClose(),
    menuSelection: () => hapticFeedback.menuSelection(),
    importantAction: () => hapticFeedback.importantAction(),
    swipeGesture: () => hapticFeedback.swipeGesture(),
  };
};