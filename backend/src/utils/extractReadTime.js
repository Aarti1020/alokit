const WORDS_PER_MINUTE = 200;

const stripHtml = (value = "") => {
  return value.replace(/<[^>]*>/g, " ");
};

const extractReadTime = (content = "") => {
  if (typeof content !== "string" || !content.trim()) {
    return 1;
  }

  const words = stripHtml(content)
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

export default extractReadTime;
