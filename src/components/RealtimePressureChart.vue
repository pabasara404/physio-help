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

const props = defineProps({
  data: {
    type: Array, // Array of data points
    required: true,
  },
  title: {
    type: String,
    default: 'Real-Time Chart',
  },
  series: {
    type: Array,
    default: () => ['Series 1'], // Array of series names
  },
  keys: {
    type: Array,
    default: () => ['value'], // Array of keys corresponding to series
  },
});

const chartData = computed(() => {
  const labels = props.data.map((item) => item.time);
  const datasets = props.series.map((series, index) => ({
    label: series,
    data: props.data.map((item) => item[props.keys[index]] || 0),
    borderColor: `hsl(${(index / props.series.length) * 360}, 70%, 50%)`,
    tension: 0.1,
  }));

  return {
    labels,
    datasets,
  };
});

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
