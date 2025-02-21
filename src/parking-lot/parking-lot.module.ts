import { Module } from '@nestjs/common';
import { ParkingLotService } from './parking-lot.service';
import { ParkingLotController } from './parking-lot.controller';

@Module({
  providers: [ParkingLotService],
  controllers: [ParkingLotController],
})
export class ParkingLotModule {}
