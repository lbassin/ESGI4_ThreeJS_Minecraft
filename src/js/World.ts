import * as THREE from "three";
import 'three/examples/js/controls/PointerLockControls';
import Cube from './Cube';
import * as Stats from 'stats.js';
import FlatGenerator from './FlatGenerator';
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/postprocessing/EffectComposer';
import 'three/examples/js/postprocessing/RenderPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/postprocessing/SavePass';
import 'three/examples/js/postprocessing/DotScreenPass';

const viewDistance = 100;
const fov = 60;
const clock = new THREE.Clock();
const raycasterFar = 13;

export default class World {

    scene: any;
    camera: any;
    renderer: any;
    renderPass: any;
    composer: any;
    generator: any;
    controls: any;
    ambientLight: any;
    keys: any;
    raycaster: any;
    speed: number = 100;
    cubes: Cube[][][] = [];

    removeAction: boolean = true;

    selectedCube: THREE.Mesh = null;
    selectedFace: number = null;

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
        this.composer = new THREE.EffectComposer(this.renderer);

        this.initShader();

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

        this.selectedCube = new Cube(new THREE.Vector3(0, -Cube.Size, 0)).select().getObject();
        this.scene.add(this.selectedCube);

        this.generate();

        this.initCamera();
        this.initKeyboard();
        this.initMouse();
        this.initRaycaster();
    }

    initCamera() {
        this.controls = new THREE.PointerLockControls(this.camera);
        this.controls.getObject().position.y = 100;
        this.controls.getObject().position.z = -20;
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

            if (e.keyCode === 17) {
                this.changeAction();
            }

            this.keys[e.keyCode] = true;
        };

        document.onkeyup = (e: any) => {
            e = e || window.event;
            this.keys[e.keyCode] = false;
        };
    }

    initMouse() {
        document.onmousedown = (e: any) => {
            if (e.button !== 0) {
                return;
            }

            if (this.removeAction) {
                this.removeSelectedCube();
            } else {
                this.addSelectedCube();
            }
        }
    }

    initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = raycasterFar;
    }

    initShader() {
        let renderPass = new THREE.RenderPass(this.scene, this.camera);
        renderPass.renderToScreen = true;

        this.composer.addPass(renderPass);
    }

    animate() {
        this.stats.begin();

        this.moveCamera();
        this.checkRaycaster();

        this.setPlayerHeight();

        // this.renderer.render(this.scene, this.camera);
        this.composer.render();
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
            let selected = intersects[0];
            this.setSelectedCube(selected.object, selected.faceIndex);
        } else {
            this.setSelectedCube(null, -1);
        }
    }

    setSelectedCube(cube: THREE.Mesh, faceIndex: number) {
        if (!cube) {
            this.selectedCube.visible = false;
            return;
        }

        this.selectedFace = faceIndex;

        this.selectedCube.visible = true;
        this.selectedCube.position.copy(cube.position);

        if (this.removeAction || cube.uuid === this.selectedCube.uuid) {
            return;
        }

        if (this.selectedFace == 0 || this.selectedFace == 1) {
            this.selectedCube.position.x += Cube.Size;
        }

        if (this.selectedFace == 2 || this.selectedFace == 3) {
            this.selectedCube.position.x -= Cube.Size;
        }

        if (this.selectedFace == 4 || this.selectedFace == 5) {
            this.selectedCube.position.y += Cube.Size;
        }

        if (this.selectedFace == 6 || this.selectedFace == 7) {
            this.selectedCube.position.y -= Cube.Size;
        }

        if (this.selectedFace == 8 || this.selectedFace == 9) {
            this.selectedCube.position.z += Cube.Size;
        }

        if (this.selectedFace == 10 || this.selectedFace == 11) {
            this.selectedCube.position.z -= Cube.Size;
        }
    }

    setPlayerHeight() {
        const height = this.getHighestY() * Cube.Size;

        this.controls.getObject().position.y = height + (Cube.Size * 2);
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
        if (!this.selectedCube.visible) {
            return;
        }

        const position = World.convertSizeToCoord(this.selectedCube.position);
        this.scene.remove(this.cubes[position.y][position.x][position.z].getObject());

        this.cubes[position.y][position.x][position.z] = null;
    }

    addSelectedCube(): void {
        const cube = new Cube(this.selectedCube.position);
        const position = World.convertSizeToCoord(this.selectedCube.position);

        this.scene.add(cube.getObject());

        this.cubes[position.y][position.x][position.z] = cube;

    }

    changeAction(): void {
        this.removeAction = !this.removeAction;
    }

    static convertSizeToCoord(position: THREE.Vector3): THREE.Vector3 {
        position.divideScalar(Cube.Size);
        position.ceil();

        return position;
    }
}

// TOP : 4,5