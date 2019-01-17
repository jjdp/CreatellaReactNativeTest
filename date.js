// Date formatter

// Dates should be displayed in relative time (eg. "3 days ago") unless
// they are older than 1 week, in which case the full date should be displayed.

// initial format
// Wed Jan 02 2019 21:19:10 GMT+0800 (PST)"

let formatDate = date => {
  const parsedDate = new Date(date);

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerWeek = msPerDay * 7;

  var elapsed = new Date() - parsedDate;

  if (elapsed < msPerMinute) {
    var seconds = Math.round(elapsed / 1000);
    if (seconds == 1) {
      return 'a minute ago';
    }

    return seconds + ' seconds ago';
  } else if (elapsed < msPerHour) {
    var minutes = Math.round(elapsed / msPerMinute);
    if (minutes == 1) {
      return 'a minute ago';
    }

    return minutes + ' minutes ago';
  } else if (elapsed < msPerDay) {
    var hours = Math.round(elapsed / msPerHour);
    if (hours == 1) {
      return 'an hour ago';
    }

    return hours + ' hours ago';
  } else if (elapsed < msPerWeek) {
    var days = Math.round(elapsed / msPerDay);
    if (days == 7) {
      return 'a week ago';
    }

    return days + ' days ago';
  } else return parsedDate.toDateString();
};

export default formatDate;
