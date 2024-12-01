<template>
  <PageHeader title="Quadriceps set"/>
  <div class="mx-4">
    <div class="flex justify-center">
      <img
          class="w-96"
          src=".././assets/Quadriceps%20set.jpg"
      />
    </div>
    <n-h5>Instructions:</n-h5>
    <n-ol>
      <n-li>Tighten your thigh muscle.</n-li>
      <n-li>Try to straighten your knee. Hold for 5 to 10 seconds.</n-li>
      <n-li>Repeat this exercise approximately 10 times during a 2-minute period, rest one minute, and then repeat.</n-li>
      <n-li>Continue until your thigh feels fatigued.</n-li>
    </n-ol>
  </div>
  <div class="flex justify-center p-4">
    <n-button strong secondary round type="info" @click="startExercise">
      Start Exercise
    </n-button>
  </div>

  <!-- Main Exercise Modal -->
  <n-modal v-model:show="showExerciseModal" :mask-closable="false" preset="card"
           :close-on-esc="false" @close="handleModalClose"
           style="width: 800px">
    <div class="text-center p-4">
      <div v-if="currentPhase === 'initial-countdown'" class="text-4xl font-bold">
        {{ countdown }}
      </div>

      <div v-else-if="currentPhase === 'start-message'" class="text-2xl font-bold">
        Start the Exercise!
      </div>

      <div v-else-if="currentPhase === 'exercise'" class="space-y-4">
        <div class="m-2 flex justify-center"><iframe width="450" height="260" style="border: 1px solid #cccccc;" src="https://thingspeak.com/channels/2627027/charts/1?bgcolor=%23ffffff&color=%23d62020&days=1&dynamic=true&results=60&type=line"></iframe></div>
        <n-ol>
          <n-li>Tighten your thigh muscle.</n-li>
          <n-li>Try to straighten your knee. Hold for 5 to 10 seconds.</n-li>
        </n-ol>
        <div class="text-3xl font-bold mt-4">
          {{ exerciseCountdown }}
        </div>
        <div class="text-sm mt-2">
          Set {{ currentSet }}/10
        </div>
      </div>

      <div v-else-if="currentPhase === 'rest'" class="space-y-4">
        <div class="text-xl font-bold">
          Take a Rest
        </div>
        <div class="text-3xl font-bold">
          {{ restCountdown }}
        </div>
      </div>

      <div v-else-if="currentPhase === 'complete'" class="space-y-4">
        <div class="text-2xl font-bold mb-4">
          Exercise Complete!
        </div>
        <div class="text-lg mb-4">
          Please rate your pain level(1 is for bearable pain 5 for very painful):
          <n-rate v-model:value="painRating" color="#090088"/>
        </div>
        <n-button class="mt-4" type="primary" @click="finishExercise">
          Finish
        </n-button>
      </div>
    </div>
  </n-modal>

  <!-- Confirmation Modal -->
  <n-modal v-model:show="showConfirmModal" preset="dialog"
           title="Stop Exercise?"
           content="Are you sure you want to stop the exercise?"
           positive-text="Yes"
           negative-text="No"
           @positive-click="confirmStop"
           @negative-click="resumeExercise"
  />
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import PageHeader from "@/components/PageHeader.vue"

// State variables
const showExerciseModal = ref(false)
const showConfirmModal = ref(false)
const currentPhase = ref('initial-countdown')
const countdown = ref(3)
const exerciseCountdown = ref(10)
const restCountdown = ref(5)
const currentSet = ref(1)
const painRating = ref(0)

// Timer references
let countdownTimer = null
let exerciseTimer = null
let restTimer = null
let phaseTimer = null

// Start exercise flow
const startExercise = () => {
  showExerciseModal.value = true
  startInitialCountdown()
}

// Initial 3-2-1 countdown
const startInitialCountdown = () => {
  currentPhase.value = 'initial-countdown'
  countdown.value = 3

  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value === 0) {
      clearInterval(countdownTimer)
      showStartMessage()
    }
  }, 1000)
}

// Show "Start the Exercise" message
const showStartMessage = () => {
  currentPhase.value = 'start-message'
  phaseTimer = setTimeout(() => {
    startExerciseSet()
  }, 2000)
}

// Start exercise set with 10-second countdown
const startExerciseSet = () => {
  currentPhase.value = 'exercise'
  exerciseCountdown.value = 10

  exerciseTimer = setInterval(() => {
    exerciseCountdown.value--
    if (exerciseCountdown.value === 0) {
      clearInterval(exerciseTimer)
      if (currentSet.value < 10) {
        startRest()
      } else {
        completeExercise()
      }
    }
  }, 1000)
}

// Start rest period
const startRest = () => {
  currentPhase.value = 'rest'
  restCountdown.value = 5

  restTimer = setInterval(() => {
    restCountdown.value--
    if (restCountdown.value === 0) {
      clearInterval(restTimer)
      currentSet.value++
      startExerciseSet()
    }
  }, 1000)
}

// Complete exercise and show rating
const completeExercise = () => {
  currentPhase.value = 'complete'
}

// Handle modal close attempt
const handleModalClose = () => {
  if (currentPhase.value !== 'complete') {
    showConfirmModal.value = true;
  } else {
    // If the exercise is complete, just close the modal normally
    showExerciseModal.value = false;
  }
}

// Confirm stopping exercise
// Confirm stopping exercise (Yes)
const confirmStop = () => {
  clearAllTimers();
  showConfirmModal.value = false;
  showExerciseModal.value = false;
  resetState();
}

// Resume exercise (No)
const resumeExercise = () => {
  showConfirmModal.value = false;
  showExerciseModal.value = true;
}


// Finish exercise after rating
const finishExercise = () => {
  showExerciseModal.value = false
  resetState()
}

// Reset all state variables
const resetState = () => {
  currentPhase.value = 'initial-countdown'
  countdown.value = 3
  exerciseCountdown.value = 10
  restCountdown.value = 5
  currentSet.value = 1
  painRating.value = 0
}

// Clear all active timers
const clearAllTimers = () => {
  clearInterval(countdownTimer)
  clearInterval(exerciseTimer)
  clearInterval(restTimer)
  clearTimeout(phaseTimer)
}

// Cleanup on component unmount
onUnmounted(() => {
  clearAllTimers()
})
</script>

<style scoped>
</style>