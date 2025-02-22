export const getDateLabel = (date: Date, short: boolean = true) => {
  const today = new Date();
  const yesterday = new Date(today);
  const tomorrow = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  tomorrow.setDate(today.getDate() + 1);

  const dateLabel = date.toLocaleDateString("en-US", {
    weekday: "short",
  });

  if (date.toDateString() === today.toDateString()) {
    return short ? "Today" : dateLabel + ", Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return short ? "Yest." : dateLabel + ", Yesterday";
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return short ? "Tom." : dateLabel + ", Tomorrow";
  } else {
    return short
      ? dateLabel
      : dateLabel +
          ", " +
          date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });
  }
};

export const getWeekDates = () => {
  const today = new Date();
  const dates = [];
  for (let i = -3; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};
