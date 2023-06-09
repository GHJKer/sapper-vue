import { ref, Ref } from "vue";
import { TimerObjI } from "../types/general";

let seconds = 0;
let secondsPassed = 0;
let minutesPassed = 0;
let interval: number;
let minute = 60;

export let timerObj: Ref<TimerObjI> = ref({
  totalTime: 0,
  timeLeft: "",
  timePassed: "",
  timerStop: false,
});

export function timer(mins: number) {
  seconds = mins * 60 || 0;
  timerObj.value.timeLeft = "00:00";
  interval = setInterval(function () {
    timerObj.value.totalTime++;
    secondsPassed++;
    seconds--;
    minute--;

    if (!seconds || timerObj.value.timerStop) {
      clearInterval(interval);
      minute = 60;
      timerObj.value.totalTime = 0;
      secondsPassed = 0;
      minutesPassed = 0;
      console.log("no", seconds);
      return;
    } else {
      timerObj.value.timeLeft = `${Math.trunc(seconds / 60)} : ${minute}`;
      timerObj.value.timePassed = `${minutesPassed} : ${secondsPassed}`;
      console.log("yes");
      if (secondsPassed === 60) {
        minutesPassed++;
        secondsPassed = 0;
      }
    }
    if (minute === 0) {
      minute = 60;
    }
  }, 1000);
}
