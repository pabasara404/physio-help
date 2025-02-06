<template>
  <PageHeader title="Fall Detection Analysis"/>
  <div>
    <div class="flex justify-between items-center mx-4">
      <n-tag round :bordered="false" :type="connectionStatus ? 'success' : 'error'">
        <template #icon>
          <n-icon :component="connectionStatus ? CheckmarkCircle : CloseCircle" />
        </template>
        {{ connectionStatus ? 'Connected' : 'Disconnected' }}
      </n-tag>
      <n-button class="p-2 bg-blue-500 text-white rounded" @click="downloadCSV">Download CSV</n-button>
    </div>
    <div class="flex space-x-4">
      <!-- Acceleration Charts -->
      <div class="w-1/2">
        <n-h2>Sensor 1 Acceleration</n-h2>
        <RealTimeChart
            :data="sensor1AccelChartData"
            :title="'Sensor 1 Acceleration'"
            dataKey="value"
        />
      </div>
      <div class="w-1/2">
        <n-h2>Sensor 2 Acceleration</n-h2>
        <RealTimeChart
            :data="sensor2AccelChartData"
            :title="'Sensor 2 Acceleration'"
            dataKey="value"
        />
      </div>
    </div>
    <div class="flex space-x-4 mt-8">
      <!-- Gyroscope Charts -->
      <div class="w-1/2">
        <n-h2>Sensor 1 Gyroscope</n-h2>
        <RealTimeChart
            :data="sensor1GyroChartData"
            :title="'Sensor 1 Gyroscope'"
            dataKey="value"
        />
      </div>
      <div class="w-1/2">
        <n-h2>Sensor 2 Gyroscope</n-h2>
        <RealTimeChart
            :data="sensor2GyroChartData"
            :title="'Sensor 2 Gyroscope'"
            dataKey="value"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import mqtt from 'mqtt';
import PageHeader from "@/components/PageHeader.vue";
import RealTimeChart from '@/components/RealTimeChart.vue';
import { CheckmarkCircle, CloseCircle } from "@vicons/ionicons5";


// Maximum number of data points to display
const MAX_DATA_POINTS = 100;

// Refs for sensor data and chart data
const sensor1Data = ref('');
const sensor2Data = ref('');
const sensor1AccelChartData = ref({ x: [], y: [], z: [] });
const sensor2AccelChartData = ref({ x: [], y: [], z: [] });
const sensor1GyroChartData = ref({ x: [], y: [], z: [] });
const sensor2GyroChartData = ref({ x: [], y: [], z: [] });

const connectionStatus = ref(false);

// CSV data
const csvData = ref([['Timestamp', 'Sensor', 'Accel X', 'Accel Y', 'Accel Z', 'Gyro X', 'Gyro Y', 'Gyro Z']]);

// MQTT client setup
const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");

// Function to add new data point to chart and CSV
const addDataPoint = (chartData, newValues, sensor, dataType) => {
  const currentTime = new Date().toLocaleTimeString();

  // Extract values and validate
  const values = {
    x: parseFloat(newValues.x) || 0,
    y: parseFloat(newValues.y) || 0,
    z: parseFloat(newValues.z) || 0,
  };

  // Add to chart data
  chartData.x.push({ time: currentTime, value: values.x });
  chartData.y.push({ time: currentTime, value: values.y });
  chartData.z.push({ time: currentTime, value: values.z });

  // Trim data to MAX_DATA_POINTS
  if (chartData.x.length > MAX_DATA_POINTS) chartData.x.shift();
  if (chartData.y.length > MAX_DATA_POINTS) chartData.y.shift();
  if (chartData.z.length > MAX_DATA_POINTS) chartData.z.shift();

  // Set prefix for data type in CSV (Accel or Gyro)
  const csvPrefix = dataType === 'accel' ? 'Accel' : 'Gyro';

  // Add to CSV data
  csvData.value.push([
    currentTime,
    sensor,
    values.x, // X value
    values.y, // Y value
    values.z, // Z value
    csvPrefix
  ]);
};

// Function to download CSV
const downloadCSV = () => {
  const csvContent = csvData.value.map(row => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'sensor_data.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
      console.log(data);
      addDataPoint(sensor1AccelChartData.value, data.accel, 'Sensor 1', 'accel'); // Add acceleration data
      addDataPoint(sensor1GyroChartData.value, data.gyro, 'Sensor 1', 'gyro'); // Add gyroscope data
    } else if (topic === "esp32/mpu2") {
      sensor2Data.value = data;
      console.log(data);
      addDataPoint(sensor2AccelChartData.value, data.accel, 'Sensor 2', 'accel'); // Add acceleration data
      addDataPoint(sensor2GyroChartData.value, data.gyro, 'Sensor 2', 'gyro'); // Add gyroscope data
    }
    connectionStatus.value = sensor1Data.value || sensor2Data.value;
  });
});

// Cleanup on component unmount
onUnmounted(() => {
  if (client) {
    client.end();
  }
});

import axios from 'axios';

// Reactive variables to store sensor data
const sensor1StoredData = ref([]);
const sensor2StoredData = ref([]);

// Fetch stored data from Flask backend
const fetchSensorData = async () => {
  try {
    const sensor1Response = await axios.get('http://localhost:5000/get_data/sensor1');
    sensor1StoredData.value = sensor1Response.data;

    const sensor2Response = await axios.get('http://localhost:5000/get_data/sensor2');
    sensor2StoredData.value = sensor2Response.data;

    console.log("Sensor 1 Data:", sensor1StoredData.value);
    console.log("Sensor 2 Data:", sensor2StoredData.value);
  } catch (error) {
    console.error("Error fetching stored data:", error);
  }
};

// Call the function when the component mounts
onMounted(() => {
  fetchSensorData();
});

</script>

<style scoped>
.chart-container {
  height: 250px;
  width: 100%;
}
</style>