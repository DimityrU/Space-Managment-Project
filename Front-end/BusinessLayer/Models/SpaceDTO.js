export default class SpaceDTO {
  constructor(hasId) {
    if (hasId) {
      this.id = "";
    }
    this.name = "";
    this.size = 0;
    this.volume = 0;
    this.description = "";
    this.bookings = [];
    this.spaceConsumables = [];
  }
}
