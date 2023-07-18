export function useDebounce(
  func: (...args: any[]) => any,
  delay: number
): (...args: any[]) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (...args: any[]): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export const formatNumberInString = (value: number) => {
  return (value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};
