import { Test, TestingModule } from '@nestjs/testing';
import { ParkingLotService } from './parking-lot.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ParkingLotService', () => {
  let service: ParkingLotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingLotService],
    }).compile();

    service = module.get<ParkingLotService>(ParkingLotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeParkingLot', () => {
    it('should initialize a parking lot with the given size', () => {
      const result = service.initializeParkingLot(5);
      expect(result).toEqual({ total_slots: 5, available_slots: 5 });
      expect(service['ParkingSlots']).toHaveLength(5);
    });

    it('should throw an error for invalid parking lot size', () => {
      expect(() => service.initializeParkingLot(0)).toThrow(
        BadRequestException,
      );
      expect(() => service.initializeParkingLot(-2)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('expandParkingLot', () => {
    it('should add more slots to the parking lot', () => {
      service.initializeParkingLot(5);
      const result = service.expandParkingLot(3);
      expect(result).toEqual({ total_slots: 8, increment_slots: 3 });
      expect(service['ParkingSlots']).toHaveLength(8);
    });

    it('should throw an error for invalid increment size', () => {
      expect(() => service.initializeParkingLot(0)).toThrow(
        BadRequestException,
      );
      expect(() => service.initializeParkingLot(-2)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('parkCar', () => {
    beforeEach(() => {
      service.initializeParkingLot(3);
    });

    it('should allocate a parking slot to a car', () => {
      const result = service.parkCar('KA-01-1234', 'Red');
      expect(result).toEqual({
        slotNumber: 1,
        registrationNumber: 'KA-01-1234',
        color: 'Red',
      });
    });

    it('should allocate the nearest parking slot to the next car', () => {
      service.parkCar('KA-01-1234', 'Red');
      const result = service.parkCar('KA-02-5678', 'Blue');
      expect(result).toEqual({
        slotNumber: 2,
        registrationNumber: 'KA-02-5678',
        color: 'Blue',
      });
    });

    it('should throw an error since the parking full is full', () => {
      service.parkCar('KA-01-1234', 'Red');
      service.parkCar('KA-02-5678', 'Blue');
      service.parkCar('KA-03-9999', 'Black');
      expect(() => service.parkCar('KA-04-7777', 'White')).toThrow(
        BadRequestException,
      );
    });
  });

  describe('freeLot', () => {
    beforeEach(() => {
      service.initializeParkingLot(3);
      service.parkCar('KA-01-1234', 'Red');
      service.parkCar('KA-02-5678', 'Blue');
    });

    it('should free a parking slot', () => {
      const result = service.freeLot(1);
      expect(result).toEqual({ freedSlot: 1 });
    });

    it('should throw an error to free an empty slot', () => {
      service.freeLot(1);
      expect(() => service.freeLot(1)).toThrow(NotFoundException);
    });

    it('should throw an error to free a non-existent slot', () => {
      expect(() => service.freeLot(5)).toThrow(NotFoundException);
    });
  });

  describe('getOccupiedLots', () => {
    beforeEach(() => {
      service.initializeParkingLot(3);
      service.parkCar('KA-01-1234', 'Red');
      service.parkCar('KA-02-5678', 'Blue');
    });

    it('should return all occupied slots', () => {
      const result = service.getOccupiedLots();
      expect(result).toEqual([
        {
          slotNumber: 1,
          registrationNumber: 'KA-01-1234',
          color: 'Red',
        },
        {
          slotNumber: 2,
          registrationNumber: 'KA-02-5678',
          color: 'Blue',
        },
      ]);
    });

    it('should return an empty array', () => {
      service.freeLot(1);
      service.freeLot(2);
      const result = service.getOccupiedLots();
      expect(result).toEqual([]);
    });
  });

  describe('getRegistrationNumbersByColor', () => {
    beforeEach(() => {
      service.initializeParkingLot(3);
      service.parkCar('KA-01-1234', 'Red');
      service.parkCar('KA-02-5678', 'Blue');
      service.parkCar('KA-03-9999', 'Red');
    });

    it('should return registration numbers of all cars with a particular color', () => {
      const result = service.getRegistrationNumbersByColor('Red');
      expect(result).toEqual(['KA-01-1234', 'KA-03-9999']);
    });

    it('should return an empty array', () => {
      const result = service.getRegistrationNumbersByColor('Green');
      expect(result).toEqual([]);
    });
  });

  describe('getSlotNumbersByColor', () => {
    beforeEach(() => {
      service.initializeParkingLot(3);
      service.parkCar('KA-01-1234', 'Red');
      service.parkCar('KA-02-5678', 'Blue');
      service.parkCar('KA-03-9999', 'Red');
    });

    it('should return slot numbers of all cars with a particular color', () => {
      const result = service.getSlotNumbersByColor('Red');
      expect(result).toEqual([1, 3]);
    });

    it('should return an empty array', () => {
      const result = service.getSlotNumbersByColor('Green');
      expect(result).toEqual([]);
    });
  });
});
