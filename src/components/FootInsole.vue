<template>
  <PageHeader title="Foot Insole Settings"/>
  <div class="flex flex-row">
    <div class="basis-1/2">
      <canvas class="m-1" id="footCanvas"></canvas>
    </div>
    <div class="basis-1/2 ">
      <div class="flex justify-between items-center mx-4">
        <n-tag round :bordered="false" :type="connectionStatus ? 'success' : 'error'">
          <template #icon>
            <n-icon :component="connectionStatus ? CheckmarkCircle : CloseCircle" />
          </template>
          {{ connectionStatus ? 'Connected' : 'Disconnected' }}
        </n-tag>
        <n-button class="p-2 bg-blue-500 text-white rounded" @click="exportToCSV">Download CSV</n-button>
      </div>
      <div class="mx-10">
        <RealtimePressureChart
            :data="multiLineChartData"
            :title="'Foot Pressure Data'"
            :series="['Sesamoid', 'Base', 'Calcaneus', 'Head']"
            :keys="['sesamoid', 'base', 'calcaneus', 'head']"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import footImageSrc from '@/assets/foot.jpg';
import PageHeader from "@/components/PageHeader.vue";
import RealtimePressureChart from "@/components/RealtimePressureChart.vue";
import mqtt from 'mqtt';
import { CheckmarkCircle, CloseCircle } from "@vicons/ionicons5";

const connectionStatus = ref(false);
const multiLineChartData = ref([]);
const csvData = ref([]);
const MAX_DATA_POINTS = 50;
const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");

const sesamoid = ref(0);
const base = ref(0);
const calcaneus = ref(0);
const head = ref(0);

const footImage = new Image();
footImage.src = footImageSrc;

const getColorForPressure = (pressure) => {
  const normalizedPressure = Math.max(0, pressure);
  return normalizedPressure <= 47.69
      ? '#4CAF50'
      : normalizedPressure < 48
          ? '#FF9800'
          : '#E53935';
};

const getCircleRadius = (pressure) => {
  const MIN_RADIUS = 10;
  const SCALE_FACTOR = 0.5;
  return Math.max(MIN_RADIUS, Math.max(0, pressure) * SCALE_FACTOR);
};

const drawFoot = () => {
  const canvas = document.getElementById('footCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (footImage.complete) ctx.drawImage(footImage, 0, 0, canvas.width, canvas.height);

  const drawPressurePoint = (x, y, pressure) => {
    ctx.fillStyle = getColorForPressure(pressure);
    ctx.beginPath();
    ctx.arc(x, y, getCircleRadius(pressure), 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(pressure.toFixed(1), x, y + 25);
  };

  const mirrorX = (x) => canvas.width - x;
  const points = [
    { x: 265, y: 50, pressure: sesamoid.value },
    { x: 265, y: 150, pressure: head.value },
    { x: 340, y: 250, pressure: base.value },
    { x: 280, y: 460, pressure: calcaneus.value }
  ];
  points.forEach(p => {
    drawPressurePoint(p.x, p.y, p.pressure);
    drawPressurePoint(mirrorX(p.x), p.y, p.pressure);
  });
};

const addMultiLineDataPoint = () => {
  const currentTime = new Date().toLocaleTimeString();
  const newData = {
    time: currentTime,
    sesamoid: sesamoid.value,
    base: base.value,
    calcaneus: calcaneus.value,
    head: head.value,
  };
  multiLineChartData.value.push(newData);
  csvData.value.push([currentTime, sesamoid.value, base.value, calcaneus.value, head.value]);

  if (multiLineChartData.value.length > MAX_DATA_POINTS) multiLineChartData.value.shift();
};

const exportToCSV = () => {
  const headers = ['Time', 'Sesamoid', 'Base', 'Calcaneus', 'Head'];
  const rows = [headers, ...csvData.value];
  const csvContent = rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'foot_pressure_data.csv';
  link.click();
};

onMounted(() => {
  const canvas = document.getElementById('footCanvas');
  if (canvas) {
    canvas.width = 400;
    canvas.height = 525;
  }

  client.on("connect", () => {
    client.subscribe("esp32/fsr", (err) => {
      if (err) console.error("Failed to subscribe to topic", err);
    });
  });

  client.on("message", (topic, message) => {
    if (topic === "esp32/fsr") {
      const values = message.toString().split(',').map(parseFloat);
      [sesamoid.value, base.value, calcaneus.value, head.value] = values;
      connectionStatus.value = true;
      addMultiLineDataPoint();
      drawFoot();
    }
  });
});

onUnmounted(() => {
  if (client) client.end();
});
</script>

<style scoped>
canvas {
  border: 1px solid black;
}
</style>
