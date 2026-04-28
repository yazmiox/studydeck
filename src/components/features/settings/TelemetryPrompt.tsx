import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { useAppContext } from "../../../context/AppContext";
import { Info } from "lucide-react";
import { APP_CONFIG } from "@/constants";

export function TelemetryPrompt() {
    const { state, dispatch } = useAppContext();

    const handleConsent = (agreed: boolean) => {
        dispatch({ type: 'SET_TELEMETRY_CONSENT', payload: agreed });
    };

    return (
        <AlertDialog open={state.telemetryConsent === null}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <Info className="w-5 h-5" />
                        <AlertDialogTitle>Help me improve {APP_CONFIG.name}?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="space-y-3">
                        <p>
                            This app collects anonymous usage data to understand which features are most useful.
                            This helps to prioritize new features and fix bugs.
                        </p>
                        <ul className="list-disc list-inside text-xs space-y-1 pl-2">
                            <li>No personal data is collected (names, emails, etc.)</li>
                            <li>No course or lecture content is tracked</li>
                            <li>Everything is anonymous and privacy-focused</li>
                        </ul>
                        <p className="text-xs">
                            You can change this anytime in Settings.
                        </p>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => handleConsent(false)}>Decline</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleConsent(true)}>Accept</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
