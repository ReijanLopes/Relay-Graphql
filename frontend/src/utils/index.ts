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

export const formatDate_DDMMYYYYHHMM = (value: number | string) => {
  const date = new Date(value);
  const dateStringOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  const timeStringOptions: Intl.DateTimeFormatOptions = {
    hour12: false,
    hour: "numeric",
    minute: "numeric",
  };

  const dateString = date.toLocaleDateString("pt-BR", dateStringOptions);
  const timeString = date.toLocaleTimeString("pt-BR", timeStringOptions);

  return `${dateString} - ${timeString}`;
};
