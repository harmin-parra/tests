export function typeOf(value: any): string {
  let result = Object.prototype.toString.call(value).slice(8, -1);
  if (result == "Object")
    return value.constructor.name;
  else
    return result;
}

export async function sleep(delay: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, delay));
}

export function getCaseid(title: string): string {
  const regex = /-\s*C(\d+)$/;
  const match = title.match(regex);
  return match ? match[1] : '0';
}

export function mergeObjects(obj1: any, obj2: any): any {
  return { ...obj1, ...obj2 };
}

export function mergeArrays(array1: any[], array2: any[]): any[] {
  return [...array1, ...array2];
}

export function belongToEnum<T extends Record<string, string | number>>(
  enumType: T,
  value: unknown
): value is T[keyof T] {
  return Object.values(enumType).includes(value as T[keyof T]);
}

export function extractLastUrlSegment(url: string) {
  return url.substring(url.lastIndexOf('/') + 1);
}

export function extractLastBeforeUrlSegment(url: string): string {
  const parts = url.split('/').filter(Boolean); // split and remove empty strings
  if (parts.length < 2) return null; // safety check
  return parts[parts.length - 2]; // second-to-last element
}

export function extractGuids(url: string): string[] {
  return url.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi);
}
