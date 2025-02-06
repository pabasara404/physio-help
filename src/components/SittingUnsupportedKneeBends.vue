<template>
  <PageHeader title="Sitting Unsupported Knee Bends"/>
  <div class="flex justify-end items-center mx-4">
    <n-tag round :bordered="false" :type="connectionStatus ? 'success' : 'error'">
      <template #icon>
        <n-icon :component="connectionStatus ? CheckmarkCircle : CloseCircle" />
      </template>
      {{ connectionStatus ? 'Connected' : 'Disconnected' }}
    </n-tag>
  </div>
  <div class="mx-4">
    <div class="flex justify-center">
      <img class="w-96" src=".././assets/Sitting%20Unsupported%20Knee%20Bends.jpg"/>
    </div>
    <n-alert :type="feedbackType" closable>{{ feedbackMessage }}</n-alert>
    <n-h5>Instructions:</n-h5>
    <n-ol>
      <n-li>While sitting at bedside or in a chair with your thigh supported, bend your knee as far as you can until your foot rests on the floor.</n-li>
      <n-li>With your foot lightly resting on the floor, slide your upper body forward in the chair to increase your knee bend. Hold for 5 to 10 seconds.</n-li>
      <n-li>Straighten your knee fully.</n-li>
      <n-li>Repeat several times until your leg feels fatigued or until you can completely bend your knee.</n-li>
      <n-li>This exercise should take 3 minutes.</n-li>
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
        <div class="m-2 flex justify-center"><div v-if="feedbackMessage" class="p-4 text-center">
          <n-alert :type="feedbackType" closable>{{ feedbackMessage }}</n-alert>
        </div></div>
        <n-ol>
          <n-li>With your foot lightly resting on the floor, slide your upper body forward in the chair to increase your knee bend.</n-li>
          <n-li>Hold for 5 to 10 seconds.</n-li>
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
          Straighten your knee fully
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
          Please rate your pain level (1 for bearable pain, 5 for very painful):<br/>
          <n-rate v-model:value="painRating" color="#090088"/>
        </div>
        <n-button class="mt-4" type="primary" @click="finishExercise">
          Finish
        </n-button>
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import PageHeader from "@/components/PageHeader.vue"
import mqtt from 'mqtt'
import {CheckmarkCircle, CloseCircle} from "@vicons/ionicons5";
const connectionStatus = ref(false);

const client = mqtt.connect("wss://broker.emqx.io:8084/mqtt");
// State variables
const showExerciseModal = ref(false)
const currentPhase = ref('initial-countdown')
const countdown = ref(3)
const exerciseCountdown = ref(10)
const restCountdown = ref(5)
const currentSet = ref(1)
const painRating = ref(0)
const feedbackMessage = ref("")
const feedbackType = ref("info") // "success", "warning", "error", etc.
let mqttClient = null

// Timer references
let countdownTimer = null
let exerciseTimer = null
let restTimer = null
let phaseTimer = null

const startExercise = () => {
  showExerciseModal.value = true;
  startInitialCountdown();
}

const finishExercise = () => {
  showExerciseModal.value = false;
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

onMounted(() => {
  client.on("connect", () => {
    client.subscribe("esp32/mpu", (err) => {
      if (err) console.error("Failed to subscribe to topic", err);
    });
  });

  client.on("message", (topic, message) => {
    if (topic === "esp32/fsr") {
      connectionStatus.value = true;
    }
  });
});

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

// Handle MQTT Connection
const connectMQTT = () => {
  mqttClient = mqtt.connect("wss://broker.emqx.io:8084/mqtt")

  mqttClient.on("connect", () => {
    console.log("Connected to MQTT")
    mqttClient.subscribe("exercise/feedback")
  })

  mqttClient.on("message", (topic, message) => {
    if (topic === "exercise/feedback") {
      const feedbackData = JSON.parse(message.toString())
      feedbackMessage.value = feedbackData.feedback

      if (feedbackData.is_correct) {
        feedbackType.value = "success"
      } else {
        feedbackType.value = "warning"
      }
    }
  })

  mqttClient.on("error", (err) => {
    console.error("MQTT Error:", err)
  })
}

// Disconnect MQTT on unmount
onMounted(() => {
  connectMQTT()
})

onUnmounted(() => {
  if (mqttClient) {
    mqttClient.end()
  }
})

</script>

<style scoped>
</style>
