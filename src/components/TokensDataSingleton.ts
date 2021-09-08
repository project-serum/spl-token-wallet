import { getTokensData } from "../utils/ccai";
import { sleep } from "../utils/utils";

export class TokensDataSingleton {
  public static isDataLoading = false
  private static tokensDataMap = new Map();

  public static async getData() {
    if (this.isDataLoading) {
      // add trials
      await sleep(1000)
      return this.getData()
    }

    if (this.tokensDataMap.size === 0) {
        return await this.requestData()
    }

    return this.tokensDataMap;
  }

  private static async requestData() {
      this.isDataLoading = true
      await getTokensData().then((data) => {
        console.log('set to false', data)
        this.isDataLoading = false
        this.tokensDataMap = data
      });
      return this.tokensDataMap;
  }
}