<template>
  <PageHeader title="Fall Detection Analysis"/>
  <div>
    <h1>MPU6050 Sensor Data</h1>
    <div class="flex space-x-4">
      <div class="w-1/2">
        <h2>Sensor 1 Real-Time Graph</h2>
        <pre>{{ sensor1Data }}</pre>
        <RealTimeChart
            :data="sensor1ChartData"
            :title="'Sensor 1 Data'"
            dataKey="value"
        />
      </div>
      <div class="w-1/2">
        <h2>Sensor 2 Real-Time Graph</h2>
        <pre>{{ sensor2Data }}</pre>
        <RealTimeChart
            :data="sensor2ChartData"
            :title="'Sensor 2 Data'"
            dataKey="value"
        />
      </div>
    </div>
  </div>
  <div class="flex justify-items-center flex-row ...">
    <div v-for="(chart, index) in thingspeakCharts" :key="index">
      <iframe
          width="450"
          height="260"
          style="border: 1px solid #cccccc;"
          :src="chart"
      ></iframe>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import mqtt from 'mqtt';
import PageHeader from "@/components/PageHeader.vue";
import RealTimeChart from '@/components/RealTimeChart.vue';

// Maximum number of data points to display
const MAX_DATA_POINTS = 50;

// Thingspeak chart URLs
const thingspeakCharts = [
  "https://thingspeak.com/channels/2627027/charts/1?bgcolor=%23ffffff&color=%23d62020&days=1&dynamic=true&results=60&type=line",
  "https://thingspeak.com/channels/2627027/charts/2?bgcolor=%23ffffff&color=%23d62020&days=1&dynamic=true&results=60&type=line",
  "https://thingspeak.com/channels/2627027/charts/3?days=1&dynamic=&results=60&type="
];

// Refs for sensor data and chart data
const sensor1Data = ref('');
const sensor2Data = ref('');
const sensor1ChartData = ref({
  x: [],
  y: [],
  z: [],
});
const sensor2ChartData = ref({
  x: [],
  y: [],
  z: [],
});

// MQTT client setup
const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");

// Function to add new data point to chart
const addDataPoint = (chartData, newValues) => {
  const currentTime = new Date().toLocaleTimeString();

  const newPoint = {
    time: currentTime,
    x: parseFloat(newValues.x),
    y: parseFloat(newValues.y),
    z: parseFloat(newValues.z),
  };

  // Add new data points for each axis
  chartData.x.push({ time: newPoint.time, value: newPoint.x });
  chartData.y.push({ time: newPoint.time, value: newPoint.y });
  chartData.z.push({ time: newPoint.time, value: newPoint.z });

  // Trim data to MAX_DATA_POINTS
  if (chartData.x.length > MAX_DATA_POINTS) chartData.x.shift();
  if (chartData.y.length > MAX_DATA_POINTS) chartData.y.shift();
  if (chartData.z.length > MAX_DATA_POINTS) chartData.z.shift();
};

onMounted(() => {
  client.on("connect", () => {
    console.log("Connected to MQTT broker");

    // Subscribe to topics
    client.subscribe("esp32/mpu1", (err) => {
      if (err) {
        console.error("Failed to subscribe to esp32/mpu1", err);
      } else {
        console.log("Subscribed to esp32/mpu1");
      }
    });

    client.subscribe("esp32/mpu2", (err) => {
      if (err) {
        console.error("Failed to subscribe to esp32/mpu2", err);
      } else {
        console.log("Subscribed to esp32/mpu2");
      }
    });
  });

  // Listen for messages on the subscribed topics
  client.on("message", (topic, message) => {
    const data = JSON.parse(message.toString());

    if (topic === "esp32/mpu1") {
      sensor1Data.value = data;
      addDataPoint(sensor1ChartData.value, data.accel);
    } else if (topic === "esp32/mpu2") {
      sensor2Data.value = data;
      addDataPoint(sensor2ChartData.value, data.accel);
    }
  });
});

// Cleanup on component unmount
onUnmounted(() => {
  if (client) {
    client.end();
  }
});
</script>

<style scoped>
.chart-container {
  height: 300px;
  width: 100%;
}
</style>