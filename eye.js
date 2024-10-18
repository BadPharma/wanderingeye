const eyes = [
    { svg: document.getElementById('eye-svg-1'), pupil: document.getElementById('pupil-1'), iris: document.querySelector('#eye-svg-1 .cls-2'), light: document.querySelector('#eye-svg-1 .cls-3'), path: document.querySelector('#eye-svg-1 .cls-1') },
    { svg: document.getElementById('eye-svg-2'), pupil: document.getElementById('pupil-2'), iris: document.querySelector('#eye-svg-2 .cls-2'), light: document.querySelector('#eye-svg-2 .cls-3'), path: document.querySelector('#eye-svg-2 .cls-1') },
    { svg: document.getElementById('eye-svg-3'), pupil: document.getElementById('pupil-3'), iris: document.querySelector('#eye-svg-3 .cls-2'), light: document.querySelector('#eye-svg-3 .cls-3'), path: document.querySelector('#eye-svg-3 .cls-1') }
];

let isWinking = false;
let canMove = true;

function getTransform(element) {
    return element.getAttribute('transform') || '';
}

function combineTransforms(originalTransform, scaleX, scaleY) {
    if (originalTransform.includes('scale')) {
        return originalTransform.replace(/scale\(.*?\)/, `scale(${scaleX}, ${scaleY})`);
    } else {
        return `${originalTransform} scale(${scaleX}, ${scaleY})`;
    }
}

function applyWink(pupil, iris, light, path, pupilScaleY, irisScaleY, lightScaleY, pathScaleY) {
    const pupilTransform = getTransform(pupil);
    const irisTransform = getTransform(iris);
    const lightTransform = getTransform(light);
    const pathTransform = getTransform(path);

    pupil.setAttribute('transform', combineTransforms(pupilTransform, 1, pupilScaleY));
    iris.setAttribute('transform', combineTransforms(irisTransform, 1, irisScaleY));
    light.setAttribute('transform', combineTransforms(lightTransform, 1, lightScaleY));
    path.setAttribute('transform', combineTransforms(pathTransform, 1, pathScaleY));
}

function wink(eye) {
    if (!isWinking) {
        isWinking = true;
        canMove = false;

        applyWink(eye.pupil, eye.iris, eye.light, eye.path, 0.0, 0.0, 0.0, 0.05);

        setTimeout(() => {
            applyWink(eye.pupil, eye.iris, eye.light, eye.path, 1, 1, 1, 1);
            isWinking = false;
            canMove = true;
        }, 400);
    }
}

function attachWinkListeners() {
    eyes.forEach(eye => {
        [eye.svg, eye.pupil, eye.iris, eye.light, eye.path].forEach(element => {
            element.addEventListener('click', () => {
                wink(eye);
            });
        });
    });
}

function followPointer(event) {
    if (!canMove) return;

    eyes.forEach(eye => {
        const { left, top, width } = eye.svg.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + width / 2;

        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;

        const maxMovement = width / 55;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

        const clampedX = (distance > maxMovement) ? (deltaX / distance) * maxMovement : deltaX;
        const clampedY = (distance > maxMovement) ? (deltaY / distance) * maxMovement : deltaY;

        eye.pupil.setAttribute('transform', `translate(${clampedX}, ${clampedY})`);
        eye.iris.setAttribute('transform', `translate(${clampedX}, ${clampedY})`);
        eye.light.setAttribute('transform', `translate(${-clampedX / 2}, ${-clampedY / 2})`);
    });
}

document.addEventListener('mousemove', followPointer);

attachWinkListeners();
