import { ConsumableMapper } from "/BusinessLayer/Mappers/ConsumableMapper.js";
import { ConsumableService } from "/BusinessLayer/Services/ConsumableService.js";
import { displayPrompt } from "../utilities/Prompt.js";

export class ConsumableController {
  constructor() {
    this.consuambleService = new ConsumableService();
    this.consumableMapper = new ConsumableMapper();
  }

  async GetAllConsumables() {
    let response = await this.consuambleService.getAllConsumables();
    if (response.error.hasError) {
      displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }
      let consumables = response.data.map((consumableData) =>
      this.consumableMapper.MapToConsumable(consumableData, true)
    );
    return consumables;
  };

  async EditMultiple(changes) {
    let response = await this.consuambleService.editMultiple(changes);
    if (response.error.hasError) {
      await displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }
    let done = await displayPrompt(".prompt-save", "Успешно обновихте консумативите.", false);
    return done;
  };
}
