class Vector3 {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

const BULLET_BOUNDING_BOX = 0;
const BULLET_SPEED = 2;
const BULLET_LIFE = 7000;

class Bullet {
    constructor(pos_v3, rot_v3, id) {
        this.time = 0;
        this.id  = id;
        this.pos = pos_v3;
        this.rot = rot_v3;
        this.boundingBox = BULLET_BOUNDING_BOX;
    }

    update (update_interval) {
        this.pos.x += this.rot.x * BULLET_SPEED;
        this.pos.y += this.rot.y * BULLET_SPEED;
        this.pos.z += this.rot.z * BULLET_SPEED;

        this.time += update_interval;
        if(this.time >= BULLET_LIFE){
            return 0;
        }
        
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
        this.conquest = -1;
        this.shield = 1.0;
        this.planets = [];
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
