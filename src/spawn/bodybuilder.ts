let spawnBody = {
  body: function (energy: number) {
    let body: Array<BodyPartConstant> = []
    let level = Math.floor(energy / 200)
    for (let i = 0; i < level; i++) {
      body = body.concat(["move", "carry", "work"]);
    }
    return body;
  }
};

export default spawnBody;