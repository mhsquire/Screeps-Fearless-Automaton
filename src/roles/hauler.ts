export interface Hauler extends Creep {
  memory: HaulerMemory;
}

interface HaulerMemory extends CreepMemory {
  building: boolean;
  role: 'hauler';
}


const roleHauler = {

  run(creep: Creep): void {
    if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
      const resources = _.sortBy(creep.room.find(FIND_DROPPED_RESOURCES), r => creep.pos.getRangeTo(r))
      if (creep.pickup(resources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(resources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    } else {
      let targets = creep.room.find(FIND_MY_STRUCTURES, { filter: isToBeFilled });
      targets = _.sortBy(targets, r => creep.pos.getRangeTo(r));
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};

function isToBeFilled(structure: Structure): boolean {
  if (structure.structureType === STRUCTURE_EXTENSION
    || structure.structureType === STRUCTURE_SPAWN
    || structure.structureType === STRUCTURE_TOWER
  ) {
    const s = structure as StructureExtension | StructureSpawn | StructureTower;
    return s.energy < s.energyCapacity;
  }
  return false;
}

export default roleHauler;
export { isToBeFilled };
