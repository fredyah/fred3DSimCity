import * as THREE from 'three';

export function createCamera(gameWindow) {
    const DEG2RAD = Math.PI / 180.0;
    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;

    const MIN_CAMERA_RADIUS = 1;
    const MAX_CAMERA_RADIUS = 6;

    const MIN_CAMERA_ELEVATION = 30;
    const MAX_CAMERA_ELEVATION = 90;
    const ROTATION_SENSITIVITY = 0.5;
    const ZOOM_SENSITIVITY = 0.02;
    const PAN_SENSITIVITY = -0.01;

    const Y_AXIS = new THREE.Vector3(0, 1, 0);

    const camera = new THREE.PerspectiveCamera(
        75,
        gameWindow.offsetWidth / gameWindow.offsetHeight,
        0.1,
        1000
    );

    let cameraOrigin = new THREE.Vector3();
    let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;
    let cameraAzimuth = 135;
    let cameraElevation = 45;

    let isLeftMouseDown = false;
    let isMiddleMouseDown = false;
    let isRightMouseDown = false;
    let isTouchActive = false;

    let prevMouseX = 0;
    let prevMouseY = 0;

    updateCameraPosition();

    // 滑鼠事件處理
    function onMouseDown(event) {
        event.preventDefault();
        if (event.button === LEFT_MOUSE_BUTTON) isLeftMouseDown = true;
        if (event.button === MIDDLE_MOUSE_BUTTON) isMiddleMouseDown = true;
        if (event.button === RIGHT_MOUSE_BUTTON) isRightMouseDown = true;

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    function onMouseMove(event) {
        if (!isLeftMouseDown && !isMiddleMouseDown && !isRightMouseDown) return;

        event.preventDefault();
        const deltaX = event.clientX - prevMouseX;
        const deltaY = event.clientY - prevMouseY;

        if (isLeftMouseDown) {
            cameraAzimuth -= deltaX * ROTATION_SENSITIVITY;
            cameraElevation += deltaY * ROTATION_SENSITIVITY;
            cameraElevation = Math.max(MIN_CAMERA_ELEVATION, Math.min(MAX_CAMERA_ELEVATION, cameraElevation));
            updateCameraPosition();
        }

        if (isMiddleMouseDown) {
            const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DEG2RAD);
            cameraOrigin.add(forward.multiplyScalar(PAN_SENSITIVITY * deltaY));
            cameraOrigin.add(left.multiplyScalar(PAN_SENSITIVITY * deltaX));
            updateCameraPosition();
        }

        if (isRightMouseDown) {
            cameraRadius += deltaY * ZOOM_SENSITIVITY;
            cameraRadius = Math.max(MIN_CAMERA_RADIUS, Math.min(MAX_CAMERA_RADIUS, cameraRadius));
            updateCameraPosition();
        }

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    function onMouseUp(event) {
        event.preventDefault();
        isLeftMouseDown = false;
        isMiddleMouseDown = false;
        isRightMouseDown = false;
    }

    // 觸控事件處理
    function onTouchStart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            isTouchActive = true;
            prevMouseX = event.touches[0].clientX;
            prevMouseY = event.touches[0].clientY;
        }
    }

    function onTouchMove(event) {
        if (!isTouchActive) return;

        event.preventDefault();
        const deltaX = event.touches[0].clientX - prevMouseX;
        const deltaY = event.touches[0].clientY - prevMouseY;

        cameraAzimuth -= deltaX * ROTATION_SENSITIVITY;
        cameraElevation += deltaY * ROTATION_SENSITIVITY;
        cameraElevation = Math.max(MIN_CAMERA_ELEVATION, Math.min(MAX_CAMERA_ELEVATION, cameraElevation));
        updateCameraPosition();

        prevMouseX = event.touches[0].clientX;
        prevMouseY = event.touches[0].clientY;
    }

    function onTouchEnd(event) {
        event.preventDefault();
        isTouchActive = false;
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
        onMouseMove,
        onMouseUp,
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    };
}