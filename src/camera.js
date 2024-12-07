import * as THREE from 'three';

export function createCamera(gameWindow) {
    const DEG2RAD = Math.PI / 180.0;
    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;

    const MIN_CAMERA_RADIUS = 10;
    const MAX_CAMERA_RADIUS = 20;

    const MIN_CAMERA_ELEVATION = 30;
    const MAX_CAMERA_ELEVATION = 90;
    const ROTATION_SENSITIVITY = 0.5;
    const ZOOM_SENSITIVITY = 0.02;
    const PAN_SENSITIVITY = -0.01;

    const Y_AXIS = new THREE.Vector3(0, 1, 0);


    const camera = new THREE.PerspectiveCamera(75, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);
    let cameraOrigin = new THREE.Vector3();
    let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;
    let cameraAzimuth = 135
    let cameraElevation = 45;
    let isLeftMouseDown = false;
    let isRightMouseDown = false;
    let isMiddleMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    updateCameraPosition();


    function onMouseDown(event) {
        console.log('mousedown');
        
        if (event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = true;
        }
        if (event.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = true;
        }
        if (event.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = true;
        }
    }

    function onMouseUp(event) {
        console.log('mouseup');

        if (event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = false;
        }
        if (event.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = false;
        }
        if (event.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = false;
        }
    }

    function onMouseMove(event) {
        console.log('mousemove');
        const deltaX = (event.clientX - prevMouseX);
        const deltaY = (event.clientY - prevMouseY);

        // Left Mouse Down for Handle the rotation of camera
        if (isLeftMouseDown) {
            cameraAzimuth += -(deltaX * 0.5);
            cameraElevation += (deltaY * 0.5);
            cameraElevation = Math.min(180, Math.max(0, cameraElevation));
            updateCameraPosition();
        }

        // Middle Mouse Down for Handle the panning of the camera
        if (isMiddleMouseDown) {
            const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            cameraOrigin.add(forward.multiplyScalar(-0.01 * deltaY));
            cameraOrigin.add(left.multiplyScalar(-0.01 * deltaX));
            updateCameraPosition();
        }

        // Right Mouse Down for Handle the zoom of the camera
        if (isRightMouseDown) {
            cameraRadius += deltaY * 0.02;
            cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
            updateCameraPosition();
        }

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    function updateCameraPosition() {
        camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.y = cameraRadius * Math.sin(cameraElevation * DEG2RAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DEG2RAD) * Math.cos(cameraElevation * DEG2RAD);
        camera.position.add(cameraOrigin);
        camera.lookAt(cameraOrigin);
        camera.updateMatrix();
    }

    return {
        camera,
        onMouseDown,
        onMouseUp,
        onMouseMove
    }
}