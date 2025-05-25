import { BaseResponse } from "../../BusinessLayer/Contracts/BaseResponse.js";

export class StatisticRepository {

  async getStatistic(spaceId, year) {
    let response = new BaseResponse();
    try {
      let data = await fetch(`https://localhost:7286/api/statistic/${spaceId}/${year}`);
      response = await data.json();
    }
    catch (error) {
      response.addError("Възникна грешка при извеждане на информация за помещенията. Моля опитайте отново.");
    };

    return response;
  };

}
