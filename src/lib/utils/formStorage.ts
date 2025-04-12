
/**
 * Utility functions for form data storage and retrieval
 */

/**
 * Saves form data to localStorage with the specified key
 */
export function saveFormData<T extends object>(key: string, data: T): void {
  if (Object.values(data).some(value => value !== undefined && value !== '')) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

/**
 * Removes form data from localStorage with the specified key
 */
export function clearFormData(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Retrieves form data from localStorage with the specified key
 * Returns null if no data exists or parsing fails
 */
export function getFormData<T>(key: string): T | null {
  const savedData = localStorage.getItem(key);
  
  if (!savedData) return null;
  
  try {
    return JSON.parse(savedData) as T;
  } catch (e) {
    console.error("Error parsing saved form data", e);
    return null;
  }
}

/**
 * Gets the appropriate storage key for a form
 */
export function getStorageKey(formType: string, isEditMode: boolean, id?: string): string {
  return isEditMode && id ? `${formType}FormData_${id}` : `${formType}FormData_new`;
}
