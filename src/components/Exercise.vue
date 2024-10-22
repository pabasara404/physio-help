<template>
  <PageHeader title="Early Post-operative Exercises"/>
  <div class="mx-4">
  <p>The following exercises will help increase circulation to your legs and feet, which is important for preventing blood clots. They will also help strengthen your muscles and improve knee movement.</p>

    <p>Start the exercises as soon as you are able. You can begin them in the recovery room shortly after surgery. You may feel uncomfortable at first, but these exercises will help speed your recovery and actually diminish your post-operative pain.</p></div>
  <div class="flex justify-evenly flex-wrap px-20">
    <n-card
        @click="handleCardClick('quadricepsSet')"
        title="Quadriceps set"
        hoverable
        class="my-6"
    >
      <div class="flex justify-center">
        <img
            src=".././assets/Quadriceps%20set.jpg"
        />
      </div>
    </n-card>
    <n-card
        class="my-6"
        @click="handleCardClick('straightLegRaises')" title="Straight Leg Raises" hoverable>
      <div class="flex justify-center ">
        <img
            src=".././assets/Straight%20Leg%20Raises.jpg"
        />
      </div>
    </n-card>
    <n-card
        class="my-6"
        @click="handleCardClick('anklePumps')" title="Ankle Pumps" hoverable>
      <div class="flex justify-center ">
        <img  src=".././assets/Ankle%20Pumps.jpg" />
      </div>
    </n-card>
    <n-card
        class="my-6"
        @click="handleCardClick('kneeStraighteningExercise')" title="Knee straightening exercise" hoverable>
      <div class="flex justify-center ">
        <img
            src=".././assets/Knee%20straightening%20exercise.jpg"
        />
      </div>
    </n-card><n-card
        class="my-6"
        @click="handleCardClick('bedSupportedKneeBends')" title="Bed-Supported Knee Bends" hoverable>
      <div class="flex justify-center ">
        <img
            src=".././assets/Bed-Supported%20Knee%20Bends.jpg"
        />
      </div>
    </n-card><n-card
        class="my-6"
        @click="handleCardClick('sittingSupportedKneeBends')" title="Sitting Supported Knee Bends" hoverable>
      <div class="flex justify-center ">
        <img
            src=".././assets/Sitting%20Supported%20Knee%20Bends.jpg"
        />
      </div>
    </n-card><n-card
        class="my-6"
        @click="handleCardClick('sittingUnsupportedKneeBends')" title="Sitting Unsupported Knee Bends" hoverable>
      <div class="flex justify-center ">
        <img
            src=".././assets/Sitting%20Unsupported%20Knee%20Bends.jpg"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup>

import PageHeader from "@/components/PageHeader.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const handleCardClick = (route) => {
  router.push(`${route}`);
  console.log("Clicked");
};
</script>

<style scoped>
.n-card {
  max-width: 350px;
}
</style>