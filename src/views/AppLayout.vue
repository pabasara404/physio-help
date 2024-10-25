<template>
  <n-space vertical>
    <n-layout>
      <n-layout-header class="h-10" bordered>
        <p class="text-2xl font-medium py-1 px-2">
          <n-icon :component="PlusSquareIcon"/>
          PhysioHelp
        </p>
      </n-layout-header>
      <n-layout has-sider>
        <n-layout-sider
            bordered
            show-trigger
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :native-scrollbar="false"
            class="h-[calc(100vh-49px-16px)] flex flex-col"
            v-model:collapsed="collapsed"
        >
          <div class="flex-grow overflow-auto">
            <n-menu
                :collapsed-width="64"
                :collapsed-icon-size="22"
                :options="menuOptions"
            />
          </div>
          <div v-if="!collapsed" class="my-96"></div>
          <div v-if="collapsed" class="my-80"></div>
          <div class="flex justify-center">
            <div class="flex flex-col gap-2 items-center">
              <!-- Using template to properly handle v-if and v-else -->
              <template v-if="collapsed">
                <n-tooltip trigger="hover" placement="right">
                  <template #trigger>
                    <n-button strong tertiary type="info" circle size="large">
                      <n-icon><UserAvatarIcon /></n-icon>
                    </n-button>
                  </template>
                  Account
                </n-tooltip>
                <n-tooltip trigger="hover" placement="right">
                  <template #trigger>
                    <n-button strong tertiary type="error" circle size="large">
                      <n-icon><LogoutIcon /></n-icon>
                    </n-button>
                  </template>
                  Logout
                </n-tooltip>
              </template>

              <template v-else>
                <div class="flex gap-2">
                  <n-button strong tertiary type="info">
                    <n-icon class="me-2">
                      <UserAvatarIcon />
                    </n-icon>
                    Account
                  </n-button>
                  <n-button strong tertiary type="error">
                    <n-icon class="me-2">
                      <LogoutIcon />
                    </n-icon>
                    Logout
                  </n-button>
                </div>
              </template>
            </div>
          </div>
        </n-layout-sider>
        <n-layout-content class="h-[calc(100vh-49px-16px)]">
          <!-- Show Component Relevant to the menu options -->
            <router-view />
        </n-layout-content>
      </n-layout>
      <n-layout-footer bordered align="center" class="h-6">
        Copyright © P. S. Kurera. All Rights Reserved.
      </n-layout-footer>
    </n-layout>
  </n-space>
</template>

<script setup>
import { defineComponent, h, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { NIcon } from "naive-ui";
import { BookOutline as BookIcon, FootstepsOutline as FootstepsOutlineIcon } from "@vicons/ionicons5";
import { PlusSquare as PlusSquareIcon } from "@vicons/fa";
import { Fall as FallIcon, Logout as LogoutIcon } from "@vicons/tabler";
import { SnowshoeingRound as SnowshoeingRoundIcon } from "@vicons/material";
import { UserAvatar as UserAvatarIcon } from "@vicons/carbon";
import { useMessage } from 'naive-ui'

const message = useMessage();

const router = useRouter();
const collapsed = ref(false);

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: () => h(
        RouterLink,
        { to: { name: "exercise" } },
        { default: () => "Early Post-Op Exercises" }
    ),
    key: "exercise",
    icon: renderIcon(SnowshoeingRoundIcon),
  },
  {
    label: () => h(
        RouterLink,
        { to: { name: "footInsole" } },
        { default: () => "Foot Insole Settings" }
    ),
    key: "footInsole",
    icon: renderIcon(FootstepsOutlineIcon),
  },
  {
    label: () => h(
        RouterLink,
        { to: { name: "fallDetection" } },
        { default: () => "Fall Detection" }
    ),
    key: "fallDetection",
    icon: renderIcon(FallIcon),
  },
];
</script>
