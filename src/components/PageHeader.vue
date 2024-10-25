<template>
  <n-page-header class="px-3">
    <template #title>
      <n-button v-if="pageTitle !== 'Foot Insole Settings' && pageTitle !== 'Early Post-operative Exercises' && pageTitle !== 'Fall Detection Analysis'" strong secondary circle class="mx-2" @click="goBack">
        <n-icon><ArrowBackOutlinedIcon/></n-icon>
      </n-button>
      {{ pageTitle }}
    </template>
    <template #header></template>
    <n-divider />
    <template #extra v-if="pageTitle === 'Foot Insole Settings'">
      <n-space>
        <n-tooltip trigger="hover" placement="right">
          <template #trigger>
            <n-switch v-model:value="active" size="medium">
              <template #checked-icon>
                <n-icon><PowerOutlinedIcon/></n-icon>
              </template>
              <template #unchecked-icon>
                <n-icon><PowerOffOutlinedIcon/></n-icon>
              </template>
            </n-switch>
          </template>
          Turn On/Off Vibration
        </n-tooltip>
      </n-space>
    </template>
  </n-page-header>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router'; // Import the useRouter hook
import { PowerOffOutlined as PowerOffOutlinedIcon, PowerOutlined as PowerOutlinedIcon, ArrowBackOutlined as ArrowBackOutlinedIcon } from '@vicons/material';

const router = useRouter(); // Get the router instance

const propsData = defineProps({
  title: String,
});

const pageTitle = computed(() => propsData.title);

// Function to go back to the previous route
const goBack = () => {
  router.back();
};
</script>
