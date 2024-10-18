const pupil = document.getElementById('pupil');
const eyeSvg = document.getElementById('eye-svg');
const iris = document.querySelector('.cls-2'); // White circle (iris)
const light = document.querySelector('.cls-3'); // Small light reflection
const eyePath = document.querySelector('.cls-1'); // The main eye outline
let isWinking = false;
let isTouching = false; // New flag to manage touch events

// Function to apply the wink to all parts of the eye
function applyWink(scaleY) {
    pupil.setAttribute('transform', `scale(1, ${scaleY})`);
    iris.setAttribute('transform', `scale(1, ${scaleY})`);
    light.setAttribute('transform', `scale(1, ${scaleY})`);
    eyePath.setAttribute('transform', `scale(1, ${scaleY})`);
}

// Function to ensure consistent wink across all elements
function wink() {
    if (!isWinking) {
        isWinking = true;
        // Apply the wink by scaling the Y-axis
        applyWink(0.03); // Shrink the eye on the Y-axis

        setTimeout(() => {
            applyWink(1); // Reset the eye back to its original scale
            isWinking = false;
        }, 400); // Wink duration
    }
}

// Function to follow the pointer
function followPointer(clientX, clientY) {
    if (isTouching) return; // Prevent movement while touching

    const { left, top, width, height } = eyeSvg.getBoundingClientRect();
    
    // Eye's center point
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate the mouse position relative to the eye's center
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Calculate movement limits for the pupil and iris
    const maxMovement = width / 45; // Updated movement range
    const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
    
    // Clamp the pupil and iris movement within the eye boundaries
    const clampedX = (distance > maxMovement) ? (deltaX / distance) * maxMovement : deltaX;
    const clampedY = (distance > maxMovement) ? (deltaY / distance) * maxMovement : deltaY;

    // Move the pupil and iris together
    pupil.setAttribute('transform', `translate(${clampedX}, ${clampedY})`);
    iris.setAttribute('transform', `translate(${clampedX}, ${clampedY})`);

    // Move the light reflection (cls-3) in the opposite direction
    const oppositeX = -clampedX / 2; // Moving contrary to the pupil (inverted and reduced)
    const oppositeY = -clampedY / 2; // Adjusted for the contrary movement effect
    light.setAttribute('transform', `translate(${oppositeX}, ${oppositeY})`);
}

// Mouse and Touch Event Listeners
document.addEventListener('mousemove', (event) => {
    followPointer(event.clientX, event.clientY);
});

// Click and Touch Event for Winking
eyeSvg.addEventListener('click', () => {
    isTouching = false; // Reset the touch flag on click
    wink();
});
eyeSvg.addEventListener('touchstart', (event) => {
    isTouching = true; // Set the touch flag
    wink(); // Trigger wink on touch
});

// Reset the touch flag when touch ends
eyeSvg.addEventListener('touchend', () => {
    isTouching = false; // Reset the touch flag on touch end
});
