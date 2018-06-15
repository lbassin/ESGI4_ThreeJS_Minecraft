import * as THREE from "three";

const topImage = require('../img/top.png');
const sideImage = require('../img/side.png');
const bottomImage = require('../img/bottom.png');

export default class Cube {

    static Size = 3;
    static TopColor = 0xa1d991;
    static SideColor = 0X80583c;

    static TopColorSelected = 0xff0000;
    static SideColorSelected = 0xff0000;

    static DefaultMaterial = [
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sideImage)}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sideImage)}),
        new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(topImage)}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(bottomImage)}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sideImage)}),
        new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load(sideImage)}),
    ];

    static SelectedMaterial = [
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
        new THREE.MeshPhongMaterial({color: Cube.TopColorSelected}),
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
        new THREE.MeshBasicMaterial({color: Cube.SideColorSelected}),
    ];

    private material: any;
    private object: any;

    constructor(position) {
        const geometry = new THREE.BoxGeometry(Cube.Size, Cube.Size, Cube.Size);


        const cube = new THREE.Mesh(geometry, this.material);
        cube.receiveShadow = true;
        cube.castShadow = true;
        cube.position.copy(position);
        cube.material = Cube.DefaultMaterial;

        this.object = cube;
    }

    getObject() {
        return this.object;
    }

    select() {
        this.object.material = Cube.SelectedMaterial;
        return this;
    }

}
//80583c