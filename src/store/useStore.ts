import { defineStore } from "pinia";

interface State {
  recordsData: Record[] | null;
}

interface Record {
  time: number;
  scores: number;
}

export const useStore = defineStore("store", {
  state: (): State => ({
    recordsData: null,
  }),
  actions: {
    getData(newRecord: Record[]) {
      this.recordsData = newRecord;
    },
  },
});
