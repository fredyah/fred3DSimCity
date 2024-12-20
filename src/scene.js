import * as THREE from 'three';
import { createCamera } from './camera.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function createScene() {
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x777777);

    const camera = createCamera(gameWindow);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
    gameWindow.appendChild(renderer.domElement);

    let loadedModels = [];
    let mixer = null; // AnimationMixer
    const clock = new THREE.Clock(); // 用於計算時間差

    // 初始化場景
    function initialize() {
        scene.clear();
        setupLights();

        const loader = new GLTFLoader();
        loader.load(
            './models/untitled.glb',
            (gltf) => {
                const model = gltf.scene;
                model.position.set(0, 0, 0);
                scene.add(model);
                loadedModels.push(model);

                // 初始化 AnimationMixer 並播放動畫
                if (gltf.animations.length > 0) {
                    mixer = new THREE.AnimationMixer(model);
                    gltf.animations.forEach((clip) => {
                        const action = mixer.clipAction(clip);
                        action.play();
                    });
                }
            },
            undefined,
            (error) => {
                console.error('Error loading GLTF model:', error);
            }
        );
    }

    // 燈光設置
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

    // 繪製函數
    function draw() {
        const delta = clock.getDelta(); // 更新時間差
        if (mixer) {
            mixer.update(delta); // 更新動畫
        }
        renderer.render(scene, camera.camera);
    }

    // 控制動畫循環
    function start() {
        renderer.setAnimationLoop(draw);
    }

    function stop() {
        renderer.setAnimationLoop(null);
    }

    // 處理滑鼠事件
    function onMouseDown(event) {
        camera.onMouseDown(event);
    }

    function onMouseMove(event) {
        camera.onMouseMove(event);
    }

    function onMouseUp(event) {
        camera.onMouseUp(event);
    }

    // 處理觸控事件
    function onTouchStart(event) {
        camera.onTouchStart(event);
    }

    function onTouchMove(event) {
        camera.onTouchMove(event);
    }

    function onTouchEnd(event) {
        camera.onTouchEnd(event);
    }

    return {
        initialize,
        start,
        stop,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onTouchStart,
        onTouchMove,
        onTouchEnd
    };
}