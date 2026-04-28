import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";

export function useTelemetry() {
    const { state } = useAppContext();

    const trackEvent = useCallback((name: string, props?: Record<string, any>) => {
        // Only track if user has consented
        if (state.telemetryConsent) {
            // @ts-ignore
            window.electronAPI.trackEvent(name, {
                ...props,
                version: "2.0.0", // Hardcoded or from config
                isDarkMode: state.isDarkMode
            });
        }
    }, [state.telemetryConsent, state.isDarkMode]);

    return { trackEvent };
}
