import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ParkingSlot } from './parking-lot.model';

@Injectable()
export class ParkingLotService {
  private ParkingSlots: ParkingSlot[] = [];
  private availableSlots: number[] = [];

  constructor() {}

  initializeParkingLot(size: number) {
    if (size <= 0) {
      throw new BadRequestException(
        'Parking Slots size must be greater than 0',
      );
    }

    this.ParkingSlots = Array.from({ length: size }, (_, i) => ({
      slotNumber: i + 1,
      registrationNumber: null,
      color: null,
    }));

    this.availableSlots = Array.from({ length: size }, (_, i) => i + 1);
    return { total_slots: size, available_slots: size };
  }

  expandParkingLot(count: number) {
    if (count <= 0) {
      throw new BadRequestException(
        'Parking Slots size must be greater than 0',
      );
    }

    const total_slots = this.ParkingSlots.length;
    for (let i = 0; i < count; i++) {
      const slotNumber = total_slots + i + 1;
      this.ParkingSlots.push({
        slotNumber,
        registrationNumber: null,
        color: null,
      });
      this.availableSlots.push(slotNumber);
    }
    return { total_slots: total_slots + count, increment_slots: count };
  }

  parkCar(registrationNumber: string, color: string) {
    if (this.availableSlots.length === 0) {
      throw new BadRequestException('Parking Slots are full');
    }

    const slotNumber = this.availableSlots.shift();
    if (slotNumber === undefined) {
      throw new BadRequestException('No available slot');
    }
    this.ParkingSlots[slotNumber - 1] = {
      slotNumber,
      registrationNumber,
      color,
    };
    return {
      slotNumber: slotNumber,
      registrationNumber: registrationNumber,
      color: color,
    };
  }

  freeLot(slotNumber: number) {
    const slot = this.ParkingSlots[slotNumber - 1];
    if (!slot || slot.registrationNumber === null) {
      throw new NotFoundException('Slot is already free');
    }

    this.ParkingSlots[slotNumber - 1] = {
      slotNumber,
      registrationNumber: null,
      color: null,
    };
    this.availableSlots.push(slotNumber);
    this.availableSlots.sort((a, b) => a - b);
    return { freedSlot: slotNumber };
  }

  getOccupiedLots() {
    return this.ParkingSlots.filter((slot) => slot.registrationNumber !== null);
  }

  getRegistrationNumbersByColor(color: string) {
    return this.ParkingSlots.filter((slot) => slot.color === color).map(
      (slot) => slot.registrationNumber,
    );
  }

  getSlotNumbersByColor(color: string) {
    return this.ParkingSlots.filter((slot) => slot.color === color).map(
      (slot) => slot.slotNumber,
    );
  }
}
