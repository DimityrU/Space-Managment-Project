import { StatisticRepository } from "../../DataLayer/Repository/StatisticRepository.js";
import { StatisticMapper } from "../../BusinessLayer/Mappers/StatisticMapper.js";
import { displayPrompt } from "../../WebLayer/utilities/Prompt.js";

export class StatisticService {
  constructor() {
    this.statisticRepositpry = new StatisticRepository();
    this.statisticMapper = new StatisticMapper();
  }


  async getStatistic(spaceid, year) {
    const response = await this.statisticRepositpry.getStatistic(spaceid, year);
    if (response.error.hasError) {
      displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }

    var result = this.statisticMapper.MapStatistic(response.statistic);

    return result;
  }

}
