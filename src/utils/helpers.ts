export const keyToName = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .split(' ')
    .slice(0, -1)
    .join(' ');
};
