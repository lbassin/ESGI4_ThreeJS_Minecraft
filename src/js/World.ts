import * as THREE from "three";
import 'three/examples/js/controls/PointerLockControls';
import RandomGenerator from './RandomGenerator';

const viewDistance = 1000;
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

        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.ambientLight);

        this.generate();

        this.initCamera();
        this.initKeyboard();
        this.initMouse();
        this.initRaycaster();
    }

    initCamera() {
        this.controls = new THREE.PointerLockControls(this.camera);
        this.controls.getObject().position.y = 200;
        this.controls.getObject().position.z = -200;
        this.controls.getObject().rotation.y = Math.PI;
        this.controls.getObject().rotation.x = Math.PI / 6;

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

        this.renderer.render(this.scene, this.camera);
    }

    moveCamera() {
        let delta = clock.getDelta();
        let speed = 20;

        // up
        if (this.keys[38]) {
            this.controls.getObject().translateZ(-delta * speed);
        }
        // down
        if (this.keys[40]) {
            this.controls.getObject().translateZ(delta * speed);
        }
        // left
        if (this.keys[37]) {
            this.controls.getObject().translateX(-delta * speed);
        }
        // right
        if (this.keys[39]) {
            this.controls.getObject().translateX(delta * speed);
        }
    }

    checkRaycaster() {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        let intersects = this.raycaster.intersectObjects(this.scene.children);

        for (let i = 0; i < intersects.length; i++) {
            // intersects[i].object.material.color.set(0xff0000);
        }
    }

    generate() {
        this.generator.generate(this);
    }
}