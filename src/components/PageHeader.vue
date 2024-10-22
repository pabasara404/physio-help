<template>
  <n-page-header class="px-4">
    <template #title>{{ pageTitle }} </template>
    <template #header>
    </template>
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
import {computed, defineComponent} from "vue";
import {NIcon, useMessage} from "naive-ui";
import {PowerOffOutlined as PowerOffOutlinedIcon,
        PowerOutlined as PowerOutlinedIcon }  from "@vicons/material";

const message = useMessage();

const propsData = defineProps({
  title: String,
});

const pageTitle = computed(() => propsData.title);

</script>