export const getTodayInUserTimezone = (timezone: string): string => {
  try {
    return new Date().toLocaleDateString('en-CA', { timeZone: timezone });
  } catch (e) {
    // fallback if timezone is invalid
    return new Date().toLocaleDateString('en-CA');
  }
};
