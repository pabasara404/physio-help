<template>
  <PageHeader title="Foot Insole Settings"/>
  <div class="flex flex-row">
    <div class="basis-1/2">
      <canvas class="m-1" id="footCanvas"></canvas>
    </div>
    <div class="basis-1/2">
      <div class="flex flex-col ...">
        <div class="m-2"><iframe width="440" height="240" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2627027/charts/1?bgcolor=%23ffffff&color=%23d62020&days=1&dynamic=true&results=60&type=line"></iframe></div>
        <div class="m-2"><iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2627027/charts/3?days=1&dynamic=&results=60&type="></iframe></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import footImageSrc from '@/assets/foot.jpg';
import PageHeader from "@/components/PageHeader.vue";

const ws = ref(null);
const sesamoid = ref(0);
const base = ref(0);
const calcaneus = ref(0);
const head = ref(0);

const footImage = new Image();
footImage.src = footImageSrc;

// Function to determine color based on pressure value
const getColorForPressure = (pressure) => {
  // Normalize negative values to 0
  const normalizedPressure = Math.max(0, pressure);

  if (normalizedPressure <= 47.69) {
    return '#4CAF50'; // Green for low weight
  } else if (normalizedPressure > 47.69 && normalizedPressure < 48) {
    return '#FF9800'; // Orange for medium weight
  } else {
    return '#E53935'; // Red for high weight
  }
};

// Function to calculate circle radius based on pressure
const getCircleRadius = (pressure) => {
  const MIN_RADIUS = 10; // Minimum radius in pixels
  const SCALE_FACTOR = 0.5; // Adjusted scale factor for the new range of values

  // Normalize negative values to 0
  const normalizedPressure = Math.max(0, pressure);

  // Calculate radius with minimum value
  return Math.max(MIN_RADIUS, normalizedPressure * SCALE_FACTOR);
};

const drawFoot = () => {
  const canvas = document.getElementById('footCanvas');
  const ctx = canvas.getContext('2d');

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the foot image
  if (footImage.complete) {
    ctx.drawImage(footImage, 0, 0, canvas.width, canvas.height);
  } else {
    console.error('Foot image not loaded properly.');
  }

  // Function to draw a pressure point
  const drawPressurePoint = (x, y, pressure) => {
    const radius = getCircleRadius(pressure);
    ctx.fillStyle = getColorForPressure(pressure);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Add pressure value text
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(pressure.toFixed(1), x, y + radius + 15);
  };

  // Mirror function for left foot
  const mirrorX = (x) => canvas.width - x;

  // Right foot pressure points
  const pressurePoints = [
    { x: 265, y: 50, pressure: sesamoid.value }, // Sesamoid
    { x: 265, y: 150, pressure: head.value }, // Head
    { x: 340, y: 250, pressure: base.value }, // Base
    { x: 280, y: 460, pressure: calcaneus.value } // Calcaneus
  ];

  // Draw pressure points for both feet
  pressurePoints.forEach(point => {
    // Right foot
    drawPressurePoint(point.x, point.y, point.pressure);
    // Left foot (mirrored)
    drawPressurePoint(mirrorX(point.x), point.y, point.pressure);
  });
};

onMounted(() => {
  // Establish WebSocket connection
  ws.value = new WebSocket('ws://192.168.43.176:81');

  ws.value.onmessage = (event) => {
    console.log('Received data:', event.data);
    const values = event.data.split(',');

    // Parse values and handle potential parsing errors
    sesamoid.value = parseFloat(values[0]) || 0;
    base.value = parseFloat(values[1]) || 0;
    calcaneus.value = parseFloat(values[2]) || 0;
    head.value = parseFloat(values[3]) || 0;

    drawFoot();
  };

  // Setup canvas
  const canvas = document.getElementById('footCanvas');
  canvas.width = 400;
  canvas.height = 510;

  // Draw initial state when image loads
  footImage.onload = drawFoot;
  footImage.onerror = () => console.error('Failed to load foot image.');
});
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>