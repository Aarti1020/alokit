const stripDangerousTags = (value) => {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
};

const stripDangerousAttributes = (value) => {
  return value
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/\son\w+=\S+/gi, "")
    .replace(/javascript:/gi, "");
};

const sanitizeHtml = (value = "") => {
  if (typeof value !== "string") {
    return "";
  }

  return stripDangerousAttributes(stripDangerousTags(value)).trim();
};

export default sanitizeHtml;
