const parseNumber = (value, fallback) => {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue <= 0) {
    return fallback;
  }

  return parsedValue;
};

const getPagination = (query = {}) => {
  const page = parseNumber(query.page, 1);
  const limit = Math.min(parseNumber(query.limit, 10), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export default getPagination;
