// ========================================================
// solarSystem.js
//=========================================================
// Solar system generation constants
const SOLAR_SYSTEM_W 	= 7;
const SOLAR_SYSTEM_H 	= 7;
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
    // planet				-> Planet Object3D.

    constructor(vectorPos, radius) {
        this.pos = vectorPos;
        this.radius = radius;
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
        this.pos = vectorPos;
        this.sunRadius = sunRadius;
        this.numPlanets = numPlanets;
        this.infoPlanets = infoPlanets;
        this.arrayPlanets = [];
    }
      
    spawn(randomizer) {
        // Spawn Planets
        for (var i = 0; i < this.numPlanets; i++) {
            this.arrayPlanets.push(new Planet(this.pos, this.infoPlanets[i]));
        }
    }

    // Update Planets.
    update() {
        for (var i = 0; i < this.numPlanets; i++) {
            this.arrayPlanets[i].update();
        }
    }

}

class Universe {
    constructor() {
        this.solarSystems = [];
    }
    
    generate(randomizer) {
        for (var i = 0; i < SOLAR_SYSTEM_W; i++) {
            for (var j = 0; j < SOLAR_SYSTEM_H; j++) {
                var semiminor = SEMI_MINOR, semimajor = SEMI_MAJOR;
                var numPlanets = MIN_PLANETS_IN_SYSTEM + (randomizer.genrand_int31() % MAX_PLANETS_IN_SYSTEM);
                var infoPlanets = [];
    
                for (var k = 0; k < numPlanets; k++) {
                    infoPlanets.push(PLANET_MIN_RADIUS + (randomizer.genrand_int31() % PLANET_MAX_RADIUS)); 
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
        for (var i = 0; i < (SOLAR_SYSTEM_W * SOLAR_SYSTEM_H); i++)
            this.solarSystems[i].spawn(randomizer);
    }

    update() {
        // Update Solar Systems.
        for (var i = 0; i < (SOLAR_SYSTEM_W * SOLAR_SYSTEM_H); i++)
            this.solarSystems[i].update();
    }
}

module.exports = Universe;