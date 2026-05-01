const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseBoolean = (value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
};

const buildLeadFilterQuery = (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.formType) {
    filter.formType = query.formType;
  }

  if (query.source) {
    filter.source = query.source;
  }

  const isSpam = parseBoolean(query.isSpam);
  if (typeof isSpam === "boolean") {
    filter.isSpam = isSpam;
  }

  if (query.search) {
    const searchRegex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
      { message: searchRegex }
    ];
  }

  return filter;
};

const buildReviewFilterQuery = (query = {}) => {
  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.product) {
    filter.product = query.product;
  }

  if (query.rating) {
    filter.rating = Number(query.rating);
  }

  const isFeatured = parseBoolean(query.isFeatured);
  if (typeof isFeatured === "boolean") {
    filter.isFeatured = isFeatured;
  }

  if (query.search) {
    const searchRegex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [
      { name: searchRegex },
      { title: searchRegex },
      { comment: searchRegex }
    ];
  }

  return filter;
};

export { buildLeadFilterQuery, buildReviewFilterQuery };
