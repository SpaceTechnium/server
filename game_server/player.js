class Vector3 {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const BULLET_BOUNDING_BOX = 0;
const BULLET_SPEED = 1;

class Bullet {
    constructor(pos_v3, rot_v3) {
        this.pos = pos_v3;
        this.rot = rot_v3;
        this.boundingBox = BULLET_BOUNDING_BOX;
    }

    update () {
        this.pos.x += (this.rot.x * speed);
        this.pos.y += (this.rot.y * speed);
        this.pos.z += (this.rot.z * speed);
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

    update(pos, rot) {
        this.pos_x = pos.x;
        this.pos_y = pos.y;
        this.pos_z = pos.z;
        this.rot_x = rot.x;
        this.rot_y = rot.y;
        this.rot_z = rot.z;
    }
}

module.exports = {
    Vector3,
    Bullet,
    Player
};