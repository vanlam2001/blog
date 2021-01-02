setInterval(displayClock, 1000);
function displayClock() {
  let d = new Date();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  let seconds = d.getSeconds();
  let clock = document.querySelector(".clock");
  let session = "AM";
  if (hours > 12) session = "PM";
  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  let time = hours + ":" + minutes + ":" + seconds + " " + session;
  clock.innerHTML = time;
}