import Cube from "./Cube";
import * as THREE from "three";

export default class RandomGenerator {

    scene: any;

    sizeX = 15;
    sizeZ = 15;
    sizeY = 10;

    generate(world) {
        this.scene = world.scene;

        const cubes = [];
        for (let y = 0; y < this.sizeY; y++) {
            cubes[y] = [];
            for (let x = 0; x < this.sizeX; x++) {
                cubes[y][x] = [];
                for (let z = 0; z < this.sizeZ; z++) {
                    cubes[y][x][z] = null;

                    if (z < y) {
                        continue;
                    }

                    const position = new THREE.Vector3(x, y, z).multiplyScalar(Cube.Size);
                    cubes[y][x][z] = this.addCube(position);
                }
            }
        }

        world.cubes = cubes;
    }

    addCube(position = new THREE.Vector3(0, 0, 0)) {
        const cube = new Cube(position);
        this.scene.add(cube.getObject());

        return cube;
    }

}