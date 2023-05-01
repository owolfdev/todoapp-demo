// lib/dateUtils.js

export function formatDate(dateString) {
  const date = new Date(dateString);

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  let formattedDate = date.toLocaleDateString("en-US", options);

  const day = date.getDate();
  const suffix = getDaySuffix(day);

  formattedDate = formattedDate.replace(day, day + suffix);

  return formattedDate;
}

function getDaySuffix(day) {
  const suffixes = ["th", "st", "nd", "rd"];
  let suffix = "th";
  if (day >= 11 && day <= 13) {
    suffix = "th";
  } else {
    const digit = day % 10;
    suffix = suffixes[digit] || "th";
  }
  return suffix;
}
