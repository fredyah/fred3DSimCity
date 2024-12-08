import { createScene } from './scene.js';

export function createGame() {
    const scene = createScene();

    scene.initialize();

    // 取得渲染目標的 DOM 節點
    const gameWindow = document.getElementById('render-target');

    // 綁定滑鼠事件
    gameWindow.addEventListener('mousedown', scene.onMouseDown, false);
    gameWindow.addEventListener('mousemove', scene.onMouseMove, false);
    gameWindow.addEventListener('mouseup', scene.onMouseUp, false);

    // 綁定觸控事件
    gameWindow.addEventListener('touchstart', scene.onTouchStart, { passive: false });
    gameWindow.addEventListener('touchmove', scene.onTouchMove, { passive: false });
    gameWindow.addEventListener('touchend', scene.onTouchEnd, false);

    const game = {
        update() {}
    };

    scene.start();

    return game;
}