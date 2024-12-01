<template>
  <PageHeader title="Fall Detection Analysis"/>
  <div class="flex justify-items-center flex-row ...">
    <div><iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2627027/charts/1?bgcolor=%23ffffff&color=%23d62020&days=1&dynamic=true&results=60&type=line"></iframe></div>
    <div><iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2627027/charts/2?bgcolor=%23ffffff&color=%23d62020&days=1&dynamic=true&results=60&type=line"></iframe></div>
    <div><iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2627027/charts/3?days=1&dynamic=&results=60&type="></iframe></div>
  </div>
  <div class="flex justify-items-center flex-row ...">
    <div><iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2627027/charts/4?days=1&dynamic=&results=60&type="></iframe></div>
    <div><iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2627027/charts/5?days=1&dynamic=&results=60&type="></iframe></div>
    <div><iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2627027/charts/6?days=1&dynamic=&results=60&type="></iframe></div>
  </div>
</template>

<script setup>

import PageHeader from "@/components/PageHeader.vue";
</script>

<style scoped>
div div{
  padding-right: 10px;
  padding-left: 10px;
}
</style>