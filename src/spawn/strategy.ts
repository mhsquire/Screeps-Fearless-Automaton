import spawnRole from "./rolesorter"
// import spawnBody from "./bodybuilder"

/**
 * The Context defines the interface of interest to clients.
 */
class Context {

  /**
   * @type {RoleStrategy} The Context maintains a reference to one of the Strategy
   * objects. The Context does not know the concrete class of a strategy. It
   * should work with all strategies via the Strategy interface.
   */
  private strategy: RoleStrategy;

  /**
   * Usually, the Context accepts a strategy through the constructor, but also
   * provides a setter to change it at runtime.
   */
  constructor(strategy: RoleStrategy) {
    this.strategy = strategy;
  }

  /**
   * Usually, the Context allows replacing a Strategy object at runtime.
   */
  public setStrategy(strategy: RoleStrategy) {
    this.strategy = strategy;
  }

  /**
   * The Context delegates some work to the Strategy object instead of
   * implementing multiple versions of the algorithm on its own.
   */
  public spawn(): void {
    const role = this.strategy.selectRole();
    const energy = Game.spawns.Spawn1.room.energyAvailable;
    if (role) {
      const newName = role + Game.time.toString();
      console.log("Spawning new " + role + ": " + newName + " energy: " + energy.toString());
      // let result = Game.spawns['Spawn1'].spawnCreep(spawnBody.body(energy), newName,
      //   {memory: {role: role}});
    }
  }

}

interface RoleStrategy {
  selectRole(): string | false;
}

/**
 * Concrete Strategies implement the algorithm while following the base Strategy
 * interface. The interface makes them interchangeable in the Context.
 */
class OpeningRoleStrategy1 implements RoleStrategy {

  public selectRole(): string | false {
    return spawnRole.spawnRole();
  }

}

class OpeningRoleStrategy2 implements RoleStrategy {

  public selectRole(): string | false {
    return spawnRole.spawnRole()
  }

}

const spawnStrategy = {
  // set context based on progress level of controller.
  policy: (progressLevel: number) => {
    const context = new Context(new OpeningRoleStrategy1());
      switch (progressLevel) {
        case 2: // Building Roads and extensions.
          context.setStrategy(new OpeningRoleStrategy2());
          break;
        case 3: // Tower
          break;
        default: // starting out or undefined.
          context.setStrategy(new OpeningRoleStrategy1());
      }
    }
}

export default spawnStrategy;
