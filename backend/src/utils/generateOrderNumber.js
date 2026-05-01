const randomPart = (length) =>
  Math.random()
    .toString(36)
    .slice(2, 2 + length)
    .toUpperCase();

const generateOrderNumber = () => {
  return `ALOKIT-${randomPart(6)}-${randomPart(4)}`;
};

export default generateOrderNumber;
