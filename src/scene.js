// import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import * as THREE from 'three';
import { createCamera } from './camera.js';

export function createScene() {
    // Initial Scene Setup
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x777777);



    // camera.position.z = 5;
    const camera = createCamera(gameWindow);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
    gameWindow.appendChild(renderer.domElement);





    let meshes = [];

    function initialize(city) {
        scene.clear();
        meshes = [];
        for (let x = 0; x < city.size; x++) {
            const column = [];
            for (let y = 0; y < city.size; y++) {
                // 1. Load the mesh/3D object corresponding to the tile at (x, y)
                // 2. Add that mesh to the scene
                // 3. Add that mesh to the meshes array
                // Grass Geometry
                const geometry = new THREE.BoxGeometry(1, 1, 1);
                const material = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(x, -0.5, y);
                scene.add(mesh);
                column.push(mesh);

                // Building Geometry
                const tile = city.data[x][y]

                if (tile.building === 'building') {
                    const buildinggeometry = new THREE.BoxGeometry(1, 1, 1);
                    const buildingmaterial = new THREE.MeshLambertMaterial({ color: 0x777777 });
                    const buildingmesh = new THREE.Mesh(buildinggeometry, buildingmaterial);
                    buildingmesh.position.set(x, 0.5, y);
                    scene.add(buildingmesh);
                    column.push(buildingmesh);
                }
            }
            meshes.push(column);
        }
        
        setupLights();

    }


    function setupLights() {
        const lights = [
            new THREE.AmbientLight(0xffffff, 0.2),
            new THREE.DirectionalLight(0xffffff, 0.3),
            new THREE.DirectionalLight(0xffffff, 0.3),
            new THREE.DirectionalLight(0xffffff, 0.3)
        ];

        lights[1].position.set(0, 1, 0);
        lights[2].position.set(1, 1, 0);
        lights[3].position.set(0, 1, 1);

        scene.add(...lights);
    }


    function draw() {
        // mesh.rotation.x += 0.01;
        // mesh.rotation.y += 0.01;
        renderer.render(scene, camera.camera);
    }

    function start() {
        renderer.setAnimationLoop(draw);
    }

    function stop() {
        renderer.setAnimationLoop(null);
    }

    function onMouseDown(event) {
        camera.onMouseDown(event);
    }

    function onMouseUp(event) {
        camera.onMouseUp(event);
    }

    function onMouseMove(event) {
        camera.onMouseMove(event);
    }



    return {
        initialize,
        start,
        stop,
        onMouseDown,
        onMouseUp,
        onMouseMove
    }
}