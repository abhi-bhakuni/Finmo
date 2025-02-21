import { Controller, Post, Patch, Body, Get, Param } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';

@Controller('parking-lot')
export class ParkingLotController {
  constructor(private readonly parkingLotService: ParkingLotService) {}

  @Post()
  initializeParkingLot(@Body('size') size: number) {
    return this.parkingLotService.initializeParkingLot(size);
  }

  @Patch()
  expandParkingLot(@Body('count') count: number) {
    return this.parkingLotService.expandParkingLot(count);
  }

  @Post('/park')
  parkCar(
    @Body('registrationNumber') regNo: string,
    @Body('color') color: string,
  ) {
    return this.parkingLotService.parkCar(regNo, color);
  }

  @Post('/clear')
  freeLot(@Body('slotNumber') slotNumber: number) {
    return this.parkingLotService.freeLot(slotNumber);
  }

  @Get('/status')
  getOccupiedLots() {
    return this.parkingLotService.getOccupiedLots();
  }

  @Get('/registration_numbers/:color')
  getRegistrationNumbersByColor(@Param('color') color: string) {
    return this.parkingLotService.getRegistrationNumbersByColor(color);
  }

  @Get('/slot_numbers/:color')
  getSlotNumbersByColor(@Param('color') color: string) {
    this.parkingLotService.getSlotNumbersByColor(color);
  }
}
