
import { toast as originalToast, ToasterToast } from "@/hooks/use-toast";

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
