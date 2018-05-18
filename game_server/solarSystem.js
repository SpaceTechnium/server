// ========================================================
// solarSystem.js
//=========================================================
// Solar system generation constants
const SOLAR_SYSTEM_W 	= 15;
const SOLAR_SYSTEM_H 	= 15;
const SEMI_MAJOR		= 35;
const SEMI_MINOR		= 35;
const SEMI_MAJOR_OFFSET	= 10;
const SEMI_MINOR_OFFSET	= 10;
const PLANET_MIN_SPEED  = 0.00001;
const PLANET_MAX_SPEED  = 0.00009;
const PLANET_MIN_RADIUS = 0.1;
const PLANET_MAX_RADIUS = 5;
const MIN_PLANETS_IN_SYSTEM = 1;
const MAX_PLANETS_IN_SYSTEM = 10;
const SYSTEM_X_DIST     = 100;
const SYSTEM_Y_DIST     = 100;
const SYSTEM_DIST_MAX_HEIGHT_DIFF = 300;
const SYSTEM_GLOBAL_HEIGHT_VARIATION = 50;
const SUN_MIN_RADIUS    = 1;
const SUN_MAX_RADIUS    = 30;

const TypeGen = Object.freeze({"real1":1, "int31":2});

function placeboGen(Type, repeat = 1) {
    if(Type == Typegen.real1){
        while(repeat--)
            randomizer.genrand_real1();
    }
    else if(Type == Typegen.int31) {
        while(repeat--)
            randomizer.genrand_int31();
    }
}

class Vector3 {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Planet {
    // Arguments:
    // vectorPos			-> Position of one focus of the orbit (Sun Focus).
    // radius				-> Planet radius.
    // speed				-> Orbit Speed.
    // semiminor			-> Semiminor distance.
    // semimajor			-> Semimajor distance.
    // id                   -> Unique ID 

    constructor(vectorPos, radius, speed, semiminor, semimajor, id) {
        this.pos = vectorPos;
        this.radius = radius;
        this.speed = speed;
        this.semiminor = semiminor;
        this.semimajor = semimajor;
        this.id = id;
    }

    getSpeed() {
        return this.speed;
    }
    
    getSemiminor() {
        return this.semiminor;
    }

    getSemimajor() {
        return this.semimajor;
    }

    // Update planet position.
    update(tick) {
        this.planet.position.set(this.vectorPos.x + this.semiminor * Math.cos(tick * this.speed), this.vectorPos.z, this.vectorPos.y + this.semimajor * Math.sin(tick * this.speed));
    }
}

module.exports = Planet;

class SolarSystem {
    // Arguments:
    // vectorPos			-> Position of center (Sun).
    // numPlanets			-> Number of planets.
    // arrayPlanets			-> Array with info about planets [radius, rotationSpeed, semiminor, semimajor, ...] with a size of numPlanets * 4.
    // sunRadius			-> value that is used as the Sun's radius.

    constructor(vectorPos, numPlanets, infoPlanets, sunRadius) {
        this.id = 0;
        this.pos = vectorPos;
        this.numPlanets = numPlanets;
        this.infoPlanets = infoPlanets;
        this.sunRadius = sunRadius;
        this.arrayPlanets = [];
        this.sun = null;
    }
      
    spawn(randomizer, id) {
        // Spawn Sun.
        placeboGen(real1,2);
        this.id = id++;

        // Spawn Planets
        for (var i = 0; i < this.numPlanets; i++) {
            placeboGen(real1,3);
            this.arrayPlanets.push(new Planet(this.pos, this.infoPlanets[i*4], this.infoPlanets[i*4+1], this.infoPlanets[i*4+2], this.infoPlanets[i*4+3]),id++);
        }
    }

    // Update Planets.
    update(tick) {
        for (var i = 0; i < this.numPlanets; i++) {
            this.arrayPlanets[i].update(tick);
        }
    }
}

class Universe {
    constructor() {
        this.solarSystems = [];
        this.id = 2;
    }
    
    generate(randomizer) {
        for (var i = 0; i < SOLAR_SYSTEM_W; i++) {
            for (var j = 0; j < SOLAR_SYSTEM_H; j++) {
                var semiminor = SEMI_MINOR, semimajor = SEMI_MAJOR;
                var numPlanets = MIN_PLANETS_IN_SYSTEM + (randomizer.genrand_int31() % MAX_PLANETS_IN_SYSTEM);
                var infoPlanets = [];
    
                for (var k = 0; k < numPlanets; k++) {
                    infoPlanets.push(PLANET_MIN_RADIUS + (randomizer.genrand_int31() % PLANET_MAX_RADIUS)); 
                    infoPlanets.push(PLANET_MIN_SPEED + (randomizer.genrand_real1() * PLANET_MAX_SPEED));
                    infoPlanets.push(semiminor + (randomizer.genrand_real1() * k));
                    infoPlanets.push(semimajor + (randomizer.genrand_real1() * k));
                    semiminor += SEMI_MINOR_OFFSET;
                    semimajor += SEMI_MAJOR_OFFSET;
                }
                this.solarSystems.push(
                    new SolarSystem(
                        new Vector3(
                            i*SYSTEM_X_DIST + (randomizer.genrand_int31() % MAX_PLANETS_IN_SYSTEM) - SOLAR_SYSTEM_W * (SYSTEM_X_DIST/2),
                            j*SYSTEM_Y_DIST + (randomizer.genrand_int31() % MAX_PLANETS_IN_SYSTEM) - SOLAR_SYSTEM_H * (SYSTEM_Y_DIST/2),
                            (((i+j)%4) - 2) * (randomizer.genrand_int31() % SYSTEM_DIST_MAX_HEIGHT_DIFF) + (randomizer.genrand_int31() % SYSTEM_GLOBAL_HEIGHT_VARIATION) - (SYSTEM_GLOBAL_HEIGHT_VARIATION)),
                        numPlanets,
                        infoPlanets,
                        SUN_MIN_RADIUS + (randomizer.genrand_int31() % SUN_MAX_RADIUS)
                    )
                );
            }
        }
    }

    spawn(randomizer) {
        for (var i = 0; i < (SOLAR_SYSTEM_W * SOLAR_SYSTEM_H); i++) {
            this.solarSystems[i].spawn(randomizer, this.id);
            this.id = this.id + this.solarSystems[i].numPlanets + 1;
        }
    }

    update(tick) {
        // Update Solar Systems.
        for (var i = 0; i < (SOLAR_SYSTEM_W * SOLAR_SYSTEM_H); i++)
            this.solarSystems[i].update(tick);
    }
}

module.exports = Universe;