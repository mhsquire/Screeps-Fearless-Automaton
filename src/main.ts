import roleBuilder, { Builder } from 'roles/builder';
import roleHarvester from 'roles/harvester';
import roleUpgrader, { Upgrader } from 'roles/upgrader';
import ErrorMapper from 'utils/ErrorMapper';
import { runTower } from './tower';
import spawnRole from 'spawn/rolesorter';
// import spawnBody from 'spawn/bodybuilder';
// import spawnStrategy from 'spawn/strategy';

declare global {
  interface CreepMemory {
    role: string;
  }
}

function unwrappedLoop(): void {
  console.log(`Current game tick is ${Game.time}`);

  Object.values(Game.spawns).forEach(function(spawn) {
    if(spawn.room.controller?.my) {
      // const roleStrategy = spawnStrategy.policy(spawn.room.controller.progress)
      const nextRole = spawnRole.spawnRole();
      const energy = spawn.room.energyAvailable;
      if (nextRole) {
        const newName = nextRole + Game.time.toString();
        console.log("Spawning new " + nextRole + ": " + newName + " energy: " + energy.toString());
        // let result = Game.spawns['Spawn1'].spawnCreep(spawnBody.body(energy), newName,
        //   {memory: {role: nextRole}});
      }
    }
  });

  Object.values(Game.rooms).forEach(room => {
    if (room.controller?.my) {
      const towers = room.find<StructureTower>(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } });

      towers.forEach(tower => {
        runTower(tower);
      });
    }
  });



  Object.values(Game.creeps).forEach(creep => {
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep as Upgrader);
    }
    if (creep.memory.role === 'builder') {
      roleBuilder.run(creep as Builder);
    }
  });

  // Automatically delete memory of missing creeps
  Object.keys(Memory.creeps)
    .filter(name => !(name in Game.creeps))
    .forEach(name => delete Memory.creeps[name]);
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
const loop = ErrorMapper.wrapLoop(unwrappedLoop);

export {
  loop,
  unwrappedLoop
};
