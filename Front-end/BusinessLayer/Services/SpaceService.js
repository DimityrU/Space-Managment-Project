import { SpaceRepository } from "../../DataLayer/Repository/SpaceRepository.js";

export class SpaceService {
  constructor() {
    this.spaceRepository = new SpaceRepository();
  }

  async createSpace(spaceDTO) {
    const response = await this.spaceRepository.createSpace(spaceDTO);
    return response;
  }

  async getAllSpaces() {
    const response = await this.spaceRepository.getAllSpaces();
    return response;
  }

  async getSpace(id) {
    const response = await this.spaceRepository.getSpace(id);
    return response;
  }

  async editSpace(space) {
    const response = await this.spaceRepository.editSpace(space);
    return response;
  }
}
