import { StatisticService } from "../../BusinessLayer/Services/StatisticService.js";

export class StatisticController {
  constructor() {
    this.statisticService = new StatisticService();
  }

  async GetStatistic(spaceId, year) {
    let result = await this.statisticService.getStatistic(spaceId, year);
    return result;
  }
}
