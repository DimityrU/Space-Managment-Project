import { SpaceMap } from "../../BusinessLayer/Mappers/SpaceMap.js";
import { SpaceService } from "../../BusinessLayer/Services/SpaceService.js";
import { displayPrompt } from "../utilities/Prompt.js";

export class SpaceController {
  constructor() {
    this.spaceService = new SpaceService();
    this.spaceMapper = new SpaceMap();
  }

  async CreateSpace(spaceData) {
    let spaceDTO = this.spaceMapper.MapToSpace(spaceData, false);
    let response = await this.spaceService.createSpace(spaceDTO);

    if (response.hasError) {
      await displayPrompt(".prompt-save", response.errorMessage, false);
      return false;
    } else {
      await displayPrompt(".prompt-save","Успешно добавихте ново помещение.",false);
      return true;
    }
  }

  async GetAllSpaces(hasSpaceId) {
    let response = await this.spaceService.getAllSpaces();
    if (response.hasError) {
      displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }
    let spaces = response.data.map((space) =>
      this.spaceMapper.MapToSpace(space, hasSpaceId)
    );
    return spaces;
  }

  async GetSpace(id) {
    let response = await this.spaceService.getSpace(id);
    if (response.hasError) {
      displayPrompt(".prompt-save", response.error.errorMessage, false);
      return;
    }
    return response;
  }

  async EditSpace(space) {
    let response = await this.spaceService.editSpace(space);
    if (!response.hasError) {
      await displayPrompt(
        ".prompt-save",
        "Помещението беше променено успешно!",
        false
      );
      window.location.href =
        "/WebLayer/components/space/space-index/spaces.html";
    } else if (response.hasError) {
      displayPrompt(".prompt-save", response.error.errorMessage, false);
    }
    return response;
  }
}
