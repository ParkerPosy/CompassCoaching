import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for persisting state in sessionStorage
 * SSR-safe implementation that prevents hydration mismatches
 * Delays reading from sessionStorage until after initial client render
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Always start with initialValue to match SSR
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Read from sessionStorage after mount (client-side only)
  useEffect(() => {
    // Prevent build error "window is undefined" during SSR
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that
  // persists the new value to sessionStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const newValue = value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(newValue);

        // Save to session storage (client-side only)
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}
