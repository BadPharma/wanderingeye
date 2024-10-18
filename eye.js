const pupil = document.getElementById('pupil');
const eyeSvg = document.getElementById('eye-svg');
const iris = document.querySelector('.cls-2'); // White circle (iris)
const light = document.querySelector('.cls-3'); // Small light reflection
const eyePath = document.querySelector('.cls-1'); // The main eye outline (cls-1)
let isWinking = false;
let isTouching = false; // To manage touch events
let canMove = true; // Flag to control movement during wink

// Helper function to get the current transformation
function getTransform(element) {
    return element.getAttribute('transform') || ''; // Return the current transform or an empty string if none exists
}

// Helper function to combine transformations for a specific element
function combineTransforms(originalTransform, scaleX, scaleY) {
    if (originalTransform.includes('scale')) {
        // If a scale already exists, replace it
        return originalTransform.replace(/scale\(.*?\)/, `scale(${scaleX}, ${scaleY})`);
    } else {
        // Otherwise, add the new scale transformation
        return `${originalTransform} scale(${scaleX}, ${scaleY})`;
    }
}

// Function to apply the wink with individual scale values
function applyWink(pupilScaleY, irisScaleY, lightScaleY, eyePathScaleY) {
    const pupilTransform = getTransform(pupil);
    const irisTransform = getTransform(iris);
    const lightTransform = getTransform(light);
    const eyePathTransform = getTransform(eyePath);

    // Apply the individual wink scale for each element
    pupil.setAttribute('transform', combineTransforms(pupilTransform, 1, pupilScaleY));
    iris.setAttribute('transform', combineTransforms(irisTransform, 1, irisScaleY));
    light.setAttribute('transform', combineTransforms(lightTransform, 1, lightScaleY));
    eyePath.setAttribute('transform', combineTransforms(eyePathTransform, 1, eyePathScaleY));
}

// Function to ensure consistent wink across all elements
function wink() {
    if (!isWinking) {
        isWinking = true;
        canMove = false; // Disable movement during wink

        // Apply the wink with individual scale values for each element
        applyWink(0.0, 0.0, 0.0, 0.5); // Adjust the scaleY values as needed

        setTimeout(() => {
            // Reset each element back to its original scale
            applyWink(1, 1, 1, 1);
            isWinking = false;
            canMove = true; // Re-enable movement after wink
        }, 400); // Wink duration
    }
}

// Attach the wink event to all key elements within the eye
function attachWinkListeners() {
    [eyeSvg, pupil, iris, light, eyePath].forEach((element) => {
        element.addEventListener('click', () => {
            isTouching = false; // Reset the touch flag on click
            wink();
        });

        element.addEventListener('touchstart', (event) => {
            isTouching = true; // Set the touch flag
            wink(); // Trigger wink on touch
        });
    });
}

// Function to follow the pointer
function followPointer(clientX, clientY) {
    if (!canMove || isTouching) return; // Prevent movement during wink or touch events

    const { left, top, width, height } = eyeSvg.getBoundingClientRect();
    
    // Eye's center point
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Calculate the mouse position relative to the eye's center
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;

    // Calculate movement limits for the pupil and iris
    const maxMovement = width / 55; // Updated movement range
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

// Initialize wink listeners for all parts of the eye
attachWinkListeners();
