class Firefly {
    constructor(width, height, scene) {
        this.width = width;
        this.height = height;

        this.width = 1;
        this.height = 1;
        let velScaler = 0.004;
        this.offset = Math.random();

        this.pos = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0);
        this.vel = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0);
        this.vel.multiplyScalar(velScaler);

        this.bpm = 30;
        this.started = false;

        // this.pos = new THREE.Vector3(0,0,0);
        // this.vel = new THREE.Vector3(0,0,0);
        // this.acc = new THREE.Vector3(0,0,0);

        this.size  = Math.random() * 0.03;
        this.geometry = new THREE.CircleGeometry(this.size, 32);
        this.material = new THREE.MeshBasicMaterial( {color: 0xfff1be, side: THREE.DoubleSide} );
        this.material.transparent = true;
        this.plane = new THREE.Mesh( this.geometry, this.material );

        this.plane.position.set(this.pos.x, this.pos.y, this.pos.z);

        this.scene = scene;
        this.scene.add( this.plane );
    }

    bounds() {
        if (this.pos.x <= -this.width/2  || this.pos.x >= this.width/2) {
            this.vel.x *= -1;
        }
        if (this.pos.y <= -this.height/2 || this.pos.y >= this.height/2) {
            this.vel.y *= -1;
        }
        // return this;
    }


    update(time) {
        // this.vel.add(this.acc);
        // this.plane.material.color.a = Math.abs(Math.sin(time));
        if (this.started) {
            let scaler = 60 / this.bpm;
            let current = time % scaler;
            this.plane.material.opacity = Math.abs(Math.sin(current * Math.PI/2));
            this.pos.add(this.vel);
            this.plane.position.set(this.pos.x, this.pos.y, this.pos.z);
            this.bounds();
        }
    }
}