<script setup>
import { computed } from 'vue';
import { Chart } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale
);

// Props definition
const props = defineProps({
  data: {
    type: Object, // Updated to accept object with datasets
    required: true,
  },
  title: {
    type: String,
    default: 'Real-Time Chart',
  },
});

// Prepare chart data
const chartData = computed(() => ({
  labels: props.data.x.map((item) => item.time),
  datasets: [
    {
      label: `${props.title} - X`,
      data: props.data.x.map((item) => item.value),
      borderColor: '#8884d8',
      tension: 0.1,
    },
    {
      label: `${props.title} - Y`,
      data: props.data.y.map((item) => item.value),
      borderColor: '#82ca9d',
      tension: 0.1,
    },
    {
      label: `${props.title} - Z`,
      data: props.data.z.map((item) => item.value),
      borderColor: '#ff7300',
      tension: 0.1,
    },
  ],
}));

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>

<template>
  <div class="chart-container">
    <Chart
        type="line"
        :data="chartData"
        :options="chartOptions"
        :height="300"
    />
  </div>
</template>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}
</style>
