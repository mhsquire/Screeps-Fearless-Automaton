export interface Miner extends Creep {
  memory: MinerMemory;
}

interface MinerMemory extends CreepMemory {
  building: boolean;
  role: 'miner';
}

const roleMiner = {
  run(creep: Creep): void {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    }
};
/*
* Body building
* - if RCL is 1 than don't make body
* - if RCL is 2 or more than make all work and some move.
* - if 
*/
export default roleMiner;
