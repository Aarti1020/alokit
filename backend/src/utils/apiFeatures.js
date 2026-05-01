class ApiFeatures {
  constructor(baseFilter = {}, queryString = {}) {
    this.baseFilter = { ...baseFilter };
    this.queryString = queryString;
  }

  buildFilter() {
    const filter = { ...this.baseFilter };

    if (this.queryString.category) {
      filter.category = this.queryString.category;
    }

    if (this.queryString.subCategory) {
      filter.subCategory = this.queryString.subCategory;
    }

    if (this.queryString.productType) {
      filter.productType = this.queryString.productType;
    }

    if (this.queryString.minPrice || this.queryString.maxPrice) {
      filter.basePrice = {};

      if (this.queryString.minPrice) {
        filter.basePrice.$gte = Number(this.queryString.minPrice);
      }

      if (this.queryString.maxPrice) {
        filter.basePrice.$lte = Number(this.queryString.maxPrice);
      }
    }

    if (this.queryString.search) {
      filter.$or = [
        { name: { $regex: this.queryString.search, $options: "i" } },
        { shortDescription: { $regex: this.queryString.search, $options: "i" } },
        { tags: { $elemMatch: { $regex: this.queryString.search, $options: "i" } } }
      ];
    }

    return filter;
  }

  getSort() {
    if (this.queryString.sort) {
      return this.queryString.sort.split(",").join(" ");
    }

    return "-createdAt";
  }

  getPagination() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 10;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }
}

export default ApiFeatures;
