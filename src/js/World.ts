import * as THREE from "three";
import 'three/examples/js/controls/PointerLockControls';
import Cube from './Cube';
import * as Stats from 'stats.js';
import FlatGenerator from './FlatGenerator';

const viewDistance = 100;
const fov = 60;
const clock = new THREE.Clock();
const raycasterFar = 15;

export default class World {

    scene: any;
    camera: any;
    renderer: any;
    generator: any;
    controls: any;
    ambientLight: any;
    keys: any;
    raycaster: any;
    speed: number = 100;
    cubes: Cube[][][] = [];

    selectedCube: THREE.Mesh = null;
    selectedCubeDisplayed: any;

    stats: any;

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x9fe4fb);
        this.scene.fog = new THREE.Fog(0x9fe4fb, viewDistance / 4, viewDistance - 10);

        this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, viewDistance);
        this.renderer = new THREE.WebGLRenderer({antialias: true});

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;

        this.generator = new FlatGenerator();

        this.stats = new Stats();
    }

    init() {
        document.body.appendChild(this.renderer.domElement);
        document.body.appendChild(this.stats.dom);
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

        this.ambientLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.8);
        this.scene.add(this.ambientLight);

        this.generate();

        this.initCamera();
        this.initKeyboard();
        this.initMouse();
        this.initRaycaster();
    }

    initCamera() {
        this.controls = new THREE.PointerLockControls(this.camera);
        this.controls.getObject().position.y = 100;
        this.controls.getObject().position.z = -50;
        this.controls.getObject().rotation.y = Math.PI;

        this.scene.add(this.controls.getObject());

        let element = document.body;
        let pointerlockchange = () => {
            this.controls.enabled = document.pointerLockElement === element;
        };

        document.addEventListener('pointerlockchange', pointerlockchange, false);

        element.addEventListener('click', function () {
            element.requestPointerLock();
        }, false);
    }

    initKeyboard() {
        this.keys = {};

        document.onkeydown = (e: any) => {
            e = e || window.event;
            this.keys[e.keyCode] = true;
        };

        document.onkeyup = (e: any) => {
            e = e || window.event;
            this.keys[e.keyCode] = false;
        };
    }

    initMouse() {
        document.onmousedown = (e: any) => {
            if (e.button === 0) {
                this.removeSelectedCube();
            }

            if (e.button === 1) {
                this.addSelectedCube();
            }
        }
    }

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = raycasterFar;
    }

    animate() {
        this.stats.begin();

        this.moveCamera();
        this.checkRaycaster();

        this.setPlayerHeight();

        this.renderer.render(this.scene, this.camera);
        this.stats.end();
        requestAnimationFrame(this.animate.bind(this));
    }

    moveCamera() {
        let delta = clock.getDelta();

        // up
        if (this.keys[38]) {
            this.controls.getObject().translateZ(-delta * this.speed);
        }
        // down
        if (this.keys[40]) {
            this.controls.getObject().translateZ(delta * this.speed);
        }
        // left
        if (this.keys[37]) {
            this.controls.getObject().translateX(-delta * this.speed);
        }
        // right
        if (this.keys[39]) {
            this.controls.getObject().translateX(delta * this.speed);
        }
    }

    checkRaycaster() {
        this.raycaster.setFromCamera(new THREE.Vector3(), this.camera);

        let intersects = this.raycaster.intersectObjects(this.scene.children);
        if (intersects.length > 0) {
            this.setSelectedCube(intersects[0].object);
        } else {
            this.setSelectedCube(null);
        }
    }

    setSelectedCube(cube: THREE.Mesh) {
        if (cube) {
            cube.material = Cube.SelectedMaterial;
        }

        if (this.selectedCube && this.selectedCube !== cube) {
            this.selectedCube.material = Cube.DefaultMaterial;
        }

        this.selectedCube = cube;
    }

    setPlayerHeight() {
        const height = this.getHighestY() * Cube.SIZE;

        this.controls.getObject().position.y = height + (Cube.SIZE * 2);
    }

    generate() {
        this.generator.generate(this);
    }

    getCurrentCoord(): THREE.Vector3 {
        let position = new THREE.Vector3().copy(this.controls.getObject().position);

        return World.convertSizeToCoord(position);
    }

    getHighestY(): number {
        const position: THREE.Vector3 = this.getCurrentCoord();

        let maxHeight: number = 0;
        this.cubes.forEach((y: Cube[][], height: number) => {
            if (y[position.x] && y[position.x][position.z]) {
                maxHeight = height + 1;
            }
        });

        return maxHeight;
    }

    removeSelectedCube(): void {
        if (!this.selectedCube) {
            return;
        }

        const position = World.convertSizeToCoord(this.selectedCube.position);

        this.scene.remove(this.selectedCube);
        this.selectedCube = null;

        this.cubes[position.y][position.x][position.z] = null;
    }

    addSelectedCube(): void {

    }

    static convertSizeToCoord(position: THREE.Vector3): THREE.Vector3 {
        position.divideScalar(Cube.SIZE);
        position.ceil();

        return position;
    }
}