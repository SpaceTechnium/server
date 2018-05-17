class Planet {
    // Arguments:
    // vectorPos			-> Position of one focus of the orbit (Sun Focus).
    // radius				-> Planet radius.
    // speed				-> Orbit Speed.
    // semiminor			-> Semiminor distance.
    // semimajor			-> Semimajor distance.
    // planet				-> Planet Object3D.

    constructor(vectorPos, radius, speed, semiminor, semimajor, planet) {
        this.vectorPos = vectorPos;
        this.radius = radius;
        this.speed = speed;
        this.semiminor = semiminor;
        this.semimajor = semimajor;
        this.planet = planet;
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
    // TODO: Replace performance.now() with server time.
    update() {
        this.planet.position.set(this.vectorPos.x + this.semiminor * Math.cos(performance.now()*this.speed), this.vectorPos.z, this.vectorPos.y + this.semimajor * Math.sin(performance.now()*this.speed));
    }
}