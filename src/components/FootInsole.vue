<template>
  <div>
    <canvas id="footCanvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Import the foot image correctly using `import` in Vite
import footImageSrc from '@/assets/foot.jpg'; // Adjust the path according to your project structure

const ws = ref(null); // WebSocket object
const sesamoid = ref(0);
const base = ref(0);
const calcaneus = ref(0);
const head = ref(0);

const footImage = new Image();
footImage.src = footImageSrc; // Set the image source using the imported path

// Function to determine color based on pressure value
const getColorForPressure = (pressure) => {
  if (pressure < 4000) {
    return '#00FF00'; // Green for low pressure
  } else if (pressure < 6600) {
    return '#FFA500'; // Orange for medium pressure
  } else {
    return '#FF0000'; // Red for high pressure
  }
};

const drawFoot = () => {
  const canvas = document.getElementById('footCanvas');
  const ctx = canvas.getContext('2d');

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the foot image on the canvas when it's loaded
  if (footImage.complete) {
    ctx.drawImage(footImage, 0, 0, canvas.width, canvas.height);
  } else {
    console.error('Foot image not loaded properly.');
  }

  // Scale pressure values to fit within a reasonable range for circle size
  const scale = 0.005; // Scaling factor to reduce pressure value range

  // Right Foot Pressure Points
  // Sesamoid (around the big toe area)
  ctx.fillStyle = getColorForPressure(sesamoid.value); // Get color based on pressure
  ctx.beginPath();
  ctx.arc(300, 50, sesamoid.value * scale, 0, 2 * Math.PI); // Right foot position
  ctx.fill();

  // Base (middle of the arch area)
  ctx.fillStyle = getColorForPressure(base.value); // Get color based on pressure
  ctx.beginPath();
  ctx.arc(390, 310, base.value * scale, 0, 2 * Math.PI); // Right foot position
  ctx.fill();

  // Calcaneus (heel area)
  ctx.fillStyle = getColorForPressure(calcaneus.value); // Get color based on pressure
  ctx.beginPath();
  ctx.arc(315, 525, calcaneus.value * scale, 0, 2 * Math.PI); // Right foot position
  ctx.fill();

  // Head (ball of the foot area)
  ctx.fillStyle = getColorForPressure(head.value); // Get color based on pressure
  ctx.beginPath();
  ctx.arc(300, 150, head.value * scale, 0, 2 * Math.PI); // Right foot position
  ctx.fill();

  // Left Foot Pressure Points (Mirrored across the canvas)
  const mirrorX = (x) => 450 - x; // Assuming canvas width is 450px, mirror the X-coordinate

  // Sesamoid (around the big toe area - left foot)
  ctx.fillStyle = getColorForPressure(sesamoid.value); // Get color based on pressure
  ctx.beginPath();
  ctx.arc(mirrorX(300), 50, sesamoid.value * scale, 0, 2 * Math.PI); // Left foot position
  ctx.fill();

  // Base (middle of the arch area - left foot)
  ctx.fillStyle = getColorForPressure(base.value); // Get color based on pressure
  ctx.beginPath();
  ctx.arc(mirrorX(390), 310, base.value * scale, 0, 2 * Math.PI); // Left foot position
  ctx.fill();

  // Calcaneus (heel area - left foot)
  ctx.fillStyle = getColorForPressure(calcaneus.value); // Get color based on pressure
  ctx.beginPath();
  ctx.arc(mirrorX(315), 525, calcaneus.value * scale, 0, 2 * Math.PI); // Left foot position
  ctx.fill();

  // Head (ball of the foot area - left foot)
  ctx.fillStyle = getColorForPressure(head.value); // Get color based on pressure
  ctx.beginPath();
  ctx.arc(mirrorX(300), 150, head.value * scale, 0, 2 * Math.PI); // Left foot position
  ctx.fill();
};

onMounted(() => {
  // Establish WebSocket connection to ESP32
  ws.value = new WebSocket('ws://192.168.43.176:81'); // Use ESP32 IP address

  // Handle incoming messages from WebSocket
  ws.value.onmessage = (event) => {
    console.log('Received data:', event.data);
    const [sesamoidData, baseData, calcaneusData, headData] = event.data.split(',');
    sesamoid.value = parseInt(sesamoidData);
    base.value = parseInt(baseData);
    calcaneus.value = parseInt(calcaneusData);
    head.value = parseInt(headData);
    drawFoot();
  };

  // Setup canvas dimensions
  const canvas = document.getElementById('footCanvas');
  canvas.width = 450;
  canvas.height = 600;

  // Draw the foot image on the canvas when it's fully loaded
  footImage.onload = () => {
    drawFoot();
  };

  // Handle image loading errors
  footImage.onerror = () => {
    console.error('Failed to load foot image.');
  };
});
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
