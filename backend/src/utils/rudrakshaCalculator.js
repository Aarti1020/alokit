const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const RECOMMENDATION_NAMES = {
  1: "1 Mukhi Rudraksha",
  2: "2 Mukhi Rudraksha",
  3: "3 Mukhi Rudraksha",
  4: "4 Mukhi Rudraksha",
  5: "5 Mukhi Rudraksha",
  6: "6 Mukhi Rudraksha",
  7: "7 Mukhi Rudraksha",
  8: "8 Mukhi Rudraksha",
  9: "9 Mukhi Rudraksha"
};

export const normalizeDate = (value) => {
  if (typeof value !== "string") {
    throw new Error("Date of birth must be a valid date");
  }

  const input = value.trim();
  let year;
  let month;
  let day;

  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const dashedMatch = input.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  const slashMatch = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (isoMatch) {
    [, year, month, day] = isoMatch;
  } else if (dashedMatch) {
    [, day, month, year] = dashedMatch;
  } else if (slashMatch) {
    [, day, month, year] = slashMatch;
  } else {
    throw new Error("Date of birth must use YYYY-MM-DD, DD-MM-YYYY, or DD/MM/YYYY");
  }

  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (
    date.getUTCFullYear() !== Number(year) ||
    date.getUTCMonth() !== Number(month) - 1 ||
    date.getUTCDate() !== Number(day)
  ) {
    throw new Error("Date of birth must be a valid date");
  }

  return {
    date,
    year: Number(year),
    month: Number(month),
    day: Number(day),
    value: `${year}-${month}-${day}`
  };
};

export const reduceToSingleDigit = (value) => {
  let number = Math.abs(Number(value));

  if (!Number.isFinite(number)) {
    throw new Error("Value must be numeric");
  }

  while (number > 9) {
    number = String(number)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  return number === 0 ? 9 : number;
};

export const getBirthNumberFromDate = (value) => {
  const normalized = normalizeDate(value);
  return reduceToSingleDigit(normalized.day);
};

export const getDayOfWeek = (value) => {
  const normalized = normalizeDate(value);
  return WEEKDAYS[normalized.date.getUTCDay()];
};

export const getZodiacSign = (value) => {
  const { month, day } = normalizeDate(value);
  const monthDay = month * 100 + day;

  if (monthDay >= 321 && monthDay <= 419) return "Aries";
  if (monthDay >= 420 && monthDay <= 520) return "Taurus";
  if (monthDay >= 521 && monthDay <= 620) return "Gemini";
  if (monthDay >= 621 && monthDay <= 722) return "Cancer";
  if (monthDay >= 723 && monthDay <= 822) return "Leo";
  if (monthDay >= 823 && monthDay <= 922) return "Virgo";
  if (monthDay >= 923 && monthDay <= 1022) return "Libra";
  if (monthDay >= 1023 && monthDay <= 1121) return "Scorpio";
  if (monthDay >= 1122 && monthDay <= 1221) return "Sagittarius";
  if (monthDay >= 1222 || monthDay <= 119) return "Capricorn";
  if (monthDay >= 120 && monthDay <= 218) return "Aquarius";
  return "Pisces";
};

export const getRecommendationByNumber = (number, profile = {}) => {
  const mukhi = reduceToSingleDigit(number);

  return {
    number: mukhi,
    mukhi,
    name: RECOMMENDATION_NAMES[mukhi],
    reason: `Your birth number is ${mukhi}, so ${mukhi} Mukhi Rudraksha is recommended as the primary match. Your ${profile.zodiacSign || "zodiac"} profile and ${profile.dayOfWeek || "weekday"} birth support this recommendation.`
  };
};

export const calculateRudrakshaProfile = (payload) => {
  const normalizedDate = normalizeDate(payload.dateOfBirth);
  const profile = {
    birthNumber: getBirthNumberFromDate(normalizedDate.value),
    zodiacSign: getZodiacSign(normalizedDate.value),
    dayOfWeek: getDayOfWeek(normalizedDate.value)
  };

  return {
    profile,
    recommendation: getRecommendationByNumber(profile.birthNumber, profile),
    normalizedDate: normalizedDate.value
  };
};
