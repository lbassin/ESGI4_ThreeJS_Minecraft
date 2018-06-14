import * as THREE from "three";
import 'three/examples/js/controls/PointerLockControls';
import RandomGenerator from './RandomGenerator';
import Cube from './Cube';

const viewDistance = 750;
const fov = 60;
const clock = new THREE.Clock();

export default class World {

    scene: any;
    camera: any;
    renderer: any;
    generator: any;
    controls: any;

    ambientLight: any;

    keys: any;

    raycaster: any;
    mouse: any;

    speed: number = 100;

    cubes: Cube[][][] = [];

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, viewDistance);
        this.renderer = new THREE.WebGLRenderer({antialias: true});

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;

        this.generator = new RandomGenerator();
    }

    init() {
        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }, false);

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
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

    initMouse() {
        this.mouse = new THREE.Vector2();

        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
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

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
    }

    onMouseMove(event: any) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.moveCamera();
        this.checkRaycaster();

        this.setPlayerHeight();

        this.renderer.render(this.scene, this.camera);
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
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // let intersects = this.raycaster.intersectObjects(this.scene.children);
        // for (let i = 0; i < intersects.length; i++) {
            // let obj = intersects[i].object;
        // }
    }

    setPlayerHeight() {
        const height = this.getHighestY() * Cube.SIZE;

        this.controls.getObject().position.y = height + (Cube.SIZE);
    }

    generate() {
        this.generator.generate(this);
    }

    getCurrentCoord(): THREE.Vector3 {
        let position = new THREE.Vector3().copy(this.controls.getObject().position);
        position.divideScalar(Cube.SIZE);
        position.ceil();

        return position;
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
}