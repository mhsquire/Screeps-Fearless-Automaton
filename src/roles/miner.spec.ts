import { mockGlobal, mockInstanceOf } from "screeps-jest";
import roleMiner, { Miner } from '../roles/miner';
import roleBuilder, { Builder } from '../roles/builder';
import roleHarvester, { Harvester } from '../roles/harvester';


const source1 = mockInstanceOf<Source>({ id: 'source1' as Id<Source> });
const source2 = mockInstanceOf<Source>({ id: 'source2' as Id<Source> });

describe("Miner", () => {

  it("walks to nearest first source.", () => {
    const miner = mockInstanceOf<Creep>({
      room: { find: () => [source1, source2]},
      harvest:() => ERR_NOT_IN_RANGE,
      moveTo: () => OK
    });

    roleMiner.run(miner);
    expect(miner.moveTo).toHaveBeenCalledWith(source1, expect.anything())
  });

  it("mines energy and drops it.", () => {
    const miner = mockInstanceOf<Creep>({
      room: { find: () => [source1, source2]},
      harvest:() => OK
    });

    roleMiner.run(miner);
    expect(miner.harvest).toHaveBeenCalledWith(source1)
  })
});
