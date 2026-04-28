import { useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { APP_CONFIG } from "@/constants";

export function useTelemetry() {
    const { state } = useAppContext();

    const trackEvent = useCallback((name: string, props?: Record<string, any>) => {
        // Only track if user has consented
        if (state.telemetryConsent) {
            // @ts-ignore
            window.electronAPI.trackEvent(name, {
                ...props,
                version: APP_CONFIG.version,
                isDarkMode: state.isDarkMode
            });
        }
    }, [state.telemetryConsent, state.isDarkMode]);

    return { trackEvent };
}
