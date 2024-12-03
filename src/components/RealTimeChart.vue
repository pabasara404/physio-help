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

<script setup>
import { computed } from 'vue';
import {Chart} from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  CategoryScale
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
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Real-Time Chart'
  },
  dataKey: {
    type: String,
    default: 'value'
  }
});

// Prepare chart data
const chartData = computed(() => ({
  labels: props.data.map(item => item.time),
  datasets: [
    {
      label: props.title,
      data: props.data.map(item => item.value),
      borderColor: '#8884d8',
      tension: 0.1
    }
  ]
}));

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true
    }
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
}
</style>
