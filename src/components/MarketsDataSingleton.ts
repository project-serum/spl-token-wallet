import { getMarketsData } from "../utils/ccai";
import { sleep } from "../utils/utils";

export class MarketsDataSingleton {
  public static isDataLoading = false
  private static marketsDataMap = new Map();

  public static async getData() {
    if (this.isDataLoading) {
      // add trials
      await sleep(1000)
      return this.getData()
    }

    if (this.marketsDataMap.size === 0) {
        return await this.requestData()
    }

    return this.marketsDataMap;
  }

  private static async requestData() {
      this.isDataLoading = true
      await getMarketsData().then((data) => {
        console.log('set to false', data)
        this.isDataLoading = false
        this.marketsDataMap = data
      });
      return this.marketsDataMap;
  }
}