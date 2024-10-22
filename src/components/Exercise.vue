<template>
  <PageHeader title="Early Post-operative Exercises"/>
  <div class="mx-4">
  <p>The following exercises will help increase circulation to your legs and feet, which is important for preventing blood clots. They will also help strengthen your muscles and improve knee movement.</p>

    <p>Start the exercises as soon as you are able. You can begin them in the recovery room shortly after surgery. You may feel uncomfortable at first, but these exercises will help speed your recovery and actually diminish your post-operative pain.</p></div>
  <div class="flex justify-evenly flex-wrap px-20">
    <n-card
        @click="handleCardClick('timberCuttingApplication')"
        title="Apply to a Timber Cutting Permit"
        hoverable
        class="my-6"
    >
      <div class="flex justify-center">
        <img
            width="125"
            src="../../.././images/Timber%20cutting%20permit%20req4.jpeg"
        />
      </div>
    </n-card>
    <n-card
        class="my-6"
        @click="handleCardClick('timberCuttingPermitStatus')" title="View Timber Cutting Permit Status" hoverable>
      <div class="flex justify-center ">
        <img
            width="125"
            src="../../.././images/application status tracking black and white simple clipart.jpeg"
        />
      </div>
    </n-card>
    <n-card
        class="my-6"
        @click="handleCardClick('timberCuttingReviewApplication')" title="Review the Applications" hoverable>
      <div class="flex justify-center ">
        <img width="125" src="../../.././images/review.jpeg" />
      </div>
    </n-card>
    <n-card
        class="my-6"
        @click="handleCardClick('timberCuttingIssuePermits')" title="Issue Permits" hoverable>
      <div class="flex justify-center ">
        <img
            width="125"
            src="../../.././images/issue.jpeg"
        />
      </div>
    </n-card>
  </div>
</template>

<script setup>

import PageHeader from "@/components/PageHeader.vue";

const router = useRouter();

const handleCardClick = (route) => {
  router.push(`${route}`);
  console.log("Clicked");
};
</script>

<style scoped>

</style>