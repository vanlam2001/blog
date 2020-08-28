(function() {
    'use strict';
    const getCurrentTime = () => {
      let date = new Date();
      return {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
      };
    }
    const getLocator = (locator) => document.querySelector(locator);
    const updateClock = (hours, minutes, seconds) => {
      dialSecondsEl.style.transform = `translate(-50%, -100%) rotate(${seconds * 6}deg)`;
      dialMinutesEl.style.transform = `translate(-50%, -100%) rotate(${minutes * 6}deg)`;
      dialHourEl.style.transform = `translate(-50%, -100%) rotate(${hours * 30}deg)`;
    };
    let {hours, minutes, seconds} = { ...getCurrentTime() };
    const dialSecondsEl = getLocator('.dial__seconds');
    const dialMinutesEl = getLocator('.dial__minutes');
    const dialHourEl = getLocator('.dial__hour');
    updateClock(hours, minutes, seconds);
    setInterval(() => {
    let {hours, minutes, seconds} = {...getCurrentTime()};
      updateClock(hours, minutes, seconds);
    }, 1000);
  })();