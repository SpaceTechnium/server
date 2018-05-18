class Vector3 {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const BULLET_BOUNDING_BOX = 0;

class Bullet {
    constructor(pos) {
        this.pos = pos;
        this.boundingBox = BULLET_BOUNDING_BOX;
    }
}

const PLAYER_BOUNDING_BOX = 10;

class Player {
    constructor(name, ws) {
        // Attributes
        this.ws = ws;
        this.player_name = name;
        this.score = 0;
        this.pos_x = 0;
        this.pos_y = 0;
        this.pos_z = 0;
        this.rot_x = 0;
        this.rot_y = 0;
        this.rot_z = 0;
        this.bullets = [];
        this.boundingBox = PLAYER_BOUNDING_BOX;
    }
}

module.exports = {
    Player,
    Bullet
}