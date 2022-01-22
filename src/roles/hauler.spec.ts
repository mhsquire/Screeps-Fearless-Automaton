import { mockGlobal, mockInstanceOf, mockStructure } from "screeps-jest";
import roleHauler, { Hauler, isToBeFilled } from "./hauler";


const resource1 = mockInstanceOf<Resource>({ id: 'resource1' as Id<Resource> });
const resource2 = mockInstanceOf<Resource>({ id: 'resource2' as Id<Resource> });
const extension = mockStructure(STRUCTURE_EXTENSION);

describe("Hauler creep", () => {

  it("walks to nearest resource when empty.", () => {
    const hauler = mockInstanceOf<Creep>({
      pos: {getRangeTo: () => 2},
      store: {getFreeCapacity: () => 50,
              getCapacity: () => 50},
      room: {find: () => [resource1, resource2]},
      pickup:() => ERR_NOT_IN_RANGE,
      moveTo: () => OK
    });

    roleHauler.run(hauler);
    expect(hauler.moveTo).toHaveBeenCalledWith(resource1, expect.anything())
  });

  it("picksup resources when empty and in range.", () => {
    const hauler = mockInstanceOf<Creep>({
      pos: {getRangeTo: () => 2},
      store: {getFreeCapacity: () => 50,
        getCapacity: () => 50},
      room: {find: () => [resource1, resource2]},
      pickup:() => OK
    });

    roleHauler.run(hauler);
    expect(hauler.pickup).toHaveBeenCalledWith(resource1)
  });

  it("hauls energy to the nearest structure.", () => {
    const hauler = mockInstanceOf<Creep>({
      pos: {getRangeTo: () => 2},
      store: {getFreeCapacity: () => 0,
              getCapacity: () => 50},
      room: { find: () => [extension]},
      transfer:() => ERR_NOT_IN_RANGE,
      moveTo: () => OK
    });

    roleHauler.run(hauler);
    expect(hauler.moveTo).toHaveBeenCalledWith(extension, expect.anything())
  })


  it("transfers energy to the nearest structure.", () => {
    const hauler = mockInstanceOf<Creep>({
      pos: {getRangeTo: () => 0},
      store: {getFreeCapacity: () => 0,
              getCapacity: () => 50},
      room: { find: () => [extension]},
      transfer:() => OK
    });

    roleHauler.run(hauler);
    expect(hauler.transfer).toHaveBeenCalledWith(extension, RESOURCE_ENERGY)
  });

  it("transfers energy while it has energy.", () => {
    const hauler = mockInstanceOf<Creep>({
      pos: {getRangeTo: () => 0},
      store: {
        getFreeCapacity: () => 25,
        getCapacity: () => 50},
      room: { find: () => [extension]},
      transfer:() => OK
    });
    roleHauler.run(hauler);
    expect(hauler.transfer).toHaveBeenCalledWith(extension, RESOURCE_ENERGY)
  });
});

describe('isToBeFilled', () => {

  it('accepts extension, spawns and towers that are not full', () => {
    [
      STRUCTURE_EXTENSION,
      STRUCTURE_SPAWN,
      STRUCTURE_TOWER
    ].forEach(structureType => {
      const structure = mockStructure(structureType, {
        energy: 0,
        energyCapacity: 100
      });
      expect(isToBeFilled(structure)).toBeTruthy();
    });
  });

  it('rejects extension, spawns and towers that are already full', () => {
    [
      STRUCTURE_EXTENSION,
      STRUCTURE_SPAWN,
      STRUCTURE_TOWER
    ].forEach(structureType => {
      const structure = mockStructure(structureType, {
        energy: 100,
        energyCapacity: 100
      });
      expect(isToBeFilled(structure)).toBeFalsy();
    });
  });

  it('rejects any other structure type', () => {
    [
      STRUCTURE_CONTAINER,
      STRUCTURE_CONTROLLER,
      STRUCTURE_EXTRACTOR,
      STRUCTURE_KEEPER_LAIR,
      STRUCTURE_LAB,
      STRUCTURE_LINK,
      STRUCTURE_NUKER,
      STRUCTURE_OBSERVER,
      STRUCTURE_PORTAL,
      STRUCTURE_POWER_BANK,
      STRUCTURE_POWER_SPAWN,
      STRUCTURE_RAMPART,
      STRUCTURE_ROAD,
      STRUCTURE_STORAGE,
      STRUCTURE_TERMINAL,
      STRUCTURE_WALL
    ].forEach(structureType => {
      const structure = mockStructure(structureType);
      expect(isToBeFilled(structure)).toBeFalsy();
    });
  });
});
