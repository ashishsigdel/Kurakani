export const getDateAfterMinutes = (minutes) => {
  return new Date(Date.now() + minutes * 60000); // convert minutes to milliseconds
};

export const getDateBeforeMinutes = (minutes) => {
  return new Date(Date.now() - minutes * 60000); // convert minutes to milliseconds
};
