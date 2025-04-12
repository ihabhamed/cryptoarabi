
import { toast as originalToast } from "@/hooks/use-toast";
import type { Toast } from "@/components/ui/toast";

// Define our own ToasterToast type based on the UI component's Toast type
export type ToasterToast = Toast & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement;
};

// Type for toast params without the ID
type ToastParams = Omit<ToasterToast, 'id'>;

// Wrapper for toast function that adds a required ID
export function toast(params: ToastParams): ReturnType<typeof originalToast> {
  return originalToast({
    ...params,
    // Adding a unique id based on current time
    id: Date.now().toString(),
  });
}
