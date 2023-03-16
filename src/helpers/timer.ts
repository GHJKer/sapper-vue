import { ref } from "vue";

let seconds = 0;
let interval: number;
let minute = 60;
export let timeLeft = ref();
export let timerStop = ref(false);

export function timer(mins: number) {
  seconds = mins * 60 || 0;
  interval = setInterval(function () {
    seconds--;
    minute--;

    if (!seconds || timerStop.value) {
      clearInterval(interval);
      console.log("no");
      return;
    } else {
      console.log("yes");
      timeLeft.value = `${Math.trunc(seconds / 60)} : ${minute}`;
    }
    if (minute === 0) {
      minute = 60;
    }
  }, 1000);
}
