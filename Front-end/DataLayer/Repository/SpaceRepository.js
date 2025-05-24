import { BaseResponse } from "../../BusinessLayer/Contracts/BaseResponse.js";

export class SpaceRepository {

  async createSpace(spaceDTO) {
    let response = new BaseResponse();
    try {
      let data = await fetch("https://localhost:7286/api/space", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spaceDTO),
      });
      response = await data.json();
    } 
    catch (error) {
      response.addError("Възникна грешка при добавянето на помещение. Моля опитайте отново.");
    };

    return response;
  };

  async getAllSpaces() {
    let response = new BaseResponse();
    try {
      let data = await fetch("https://localhost:7286/api/space/all");
      response = await data.json();
    }
    catch (error) {
      response.addError("Възникна грешка при извеждане на информация за помещенията. Моля опитайте отново.");
    };

    return response;
  };

  async getSpace(id) {
    let response = new BaseResponse();
    try {
      let data = await fetch(`https://localhost:7286/api/space/${id}`);
      response = await data.json();
    } 
    catch (error) {
      response.addError("Възникна грешка при извеждане на информация за помещението. Моля опитайте отново.");
    };

    return response;
  };

  async editSpace(space) {
    let response = new BaseResponse();
    try {
        let data = await fetch(`https://localhost:7286/api/space/edit/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(space),
      });
      response = await data.json();
    } 
    catch (error) {
      response.addError("Възникна грешка при извеждане на информация за помещението. Моля опитайте отново.");
    };
    
    return response;
  };
}
