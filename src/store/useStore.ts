import { defineStore } from "pinia";

import { State, LeaderResultsI } from "../types/general";

export const useStore = defineStore("store", {
  state: (): State => ({
    recordsData: null,
  }),
  actions: {
    storeData(newRecords: LeaderResultsI[]) {
      this.recordsData = newRecords;
    },
  },
});
