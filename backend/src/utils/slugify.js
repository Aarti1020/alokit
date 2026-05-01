import slugify from "slugify";

const makeSlug = (text) => {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true
  });
};

export default makeSlug;