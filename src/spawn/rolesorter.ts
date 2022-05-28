function calcRepairRatio() {
  let repairRatio;
  let totalHits = 0;
  let totalHealth = 0;
  Object.keys(Game.structures).forEach(function(key) {
    const structure = Game.structures[key];
    if (structure["hits"] > 0) {
      totalHits = totalHits + structure["hits"];
    }
    if (structure["hitsMax"] > 0) {
      totalHealth = totalHealth + structure["hitsMax"];
    }
  });
  if (totalHits !== 0) {
    repairRatio = totalHealth / totalHits;
  } else {
    // All built cause things are destroyed?
    repairRatio = 0;
  }
  return repairRatio;
}

function calcRepairStrength() {
  const maxRepairCreeps = 3;
  const repairRatio = calcRepairRatio();
  const repairMult = 0.8;
  let repairCreeps = Math.floor(repairMult * repairRatio);
  if (repairCreeps > maxRepairCreeps) {
    repairCreeps = 3;
  }
  return repairCreeps;
}

function calcBuildStrength() {
  const constructCreeps = 3;
  const repairCreeps = calcRepairStrength();
  return Math.floor(constructCreeps - repairCreeps);
}

const spawnRole = {

  spawnRole: function() {
    let buildNum;
    const roles = ["harvester", "upgrader", "builder", "fixer", "miner", "hauler"];
    for (let i = 0; i < roles.length; i++) {
      let creepsList = Object.values(Game.creeps)
      creepsList = _.filter(creepsList, creep => creep.memory.role === roles[i]);
      if (roles[i].toLowerCase() === "harvester") {
        if (creepsList.length < 3) {
          return "harvester";
        }      }
      if (roles[i].toLowerCase() === "upgrader") {
        if (creepsList.length < 2) {
          return roles[i];
        }
      }
      if (roles[i].toLowerCase() === "builder") {
        if (Object.keys(Game.constructionSites).length > 0) {
          const builders = calcBuildStrength();
          buildNum = builders;
        } else {
          buildNum = 1;
        }
        if (creepsList.length < buildNum) {
          return roles[i];
        }
      }
      if (roles[i].toLowerCase() === "fixer") {
        if (Object.keys(Game.structures).length > 0 && creepsList.length < calcRepairStrength()) {
          return roles[i];
        }
      }
      if (roles[i].toLowerCase() === "miner") {

      }
      if (roles[i].toLowerCase() === "hauler") {

      }
    }
    // Nothing to spawn
    return false;
  }
};

export default spawnRole;
