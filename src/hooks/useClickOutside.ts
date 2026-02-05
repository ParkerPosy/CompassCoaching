import { type RefObject, useEffect } from "react";

/**
 * Custom hook to detect clicks outside of a referenced element
 * Useful for closing dropdowns, modals, and other overlay components
 *
 * @param ref - React ref object pointing to the element to detect outside clicks for
 * @param handler - Callback function to execute when a click outside is detected
 * @param enabled - Whether the hook is active (default: true)
 *
 * @example
 * ```tsx
 * const dropdownRef = useRef<HTMLDivElement>(null);
 * useClickOutside(dropdownRef, () => setIsOpen(false));
 * ```
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
	ref: RefObject<T>,
	handler: (event: MouseEvent | TouchEvent) => void,
	enabled = true,
): void {
	useEffect(() => {
		if (!enabled) return;

		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			// If the ref is not set or the click is inside the element, do nothing
			if (!ref.current || ref.current.contains(event.target as Node)) {
				return;
			}

			// Call the handler if click is outside
			handler(event);
		};

		// Add event listeners for both mouse and touch events
		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);

		// Cleanup function to remove event listeners
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [ref, handler, enabled]);
}
