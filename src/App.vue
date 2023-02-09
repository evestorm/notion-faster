<script setup lang="ts">
import { ref, Ref } from "vue";
import storage from "./utils/storage/index";

const tools: Ref<{ key: string; name: string; open: boolean }[]> = ref([
  {
    key: "outline",
    name: "Show Outline",
    open: true,
  },
  {
    key: "fullPages",
    name: "Full width for all pages",
    open: true,
  },
  {
    key: "smallText",
    name: "Small text for all pages",
    open: false,
  },
]);

function onToggle(e: Event, key: string) {
  const targetEle = e.target as HTMLInputElement;
  if (targetEle.nodeName === "INPUT" && key) {
    sendMessage(key, targetEle);
  }
}

function sendMessage(id: string, target: HTMLInputElement) {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    tabs => {
      let message = { id };
      chrome.tabs.sendMessage(tabs[0].id!, message, res => {
        target.checked = res;
      });
    },
  );
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const target = tools.value.find(v => v.key === request.id);
  if (target) {
    target.open = request[request.id + "Info"].show;
  }
});

async function initState() {
  for (const item of tools.value) {
    const res = await storage[`get${item.key[0].toUpperCase() + item.key.slice(1)}Info`]();
    item.open = res.show;
  }
}

initState();
</script>

<template>
  <div class="container px-2 py-2 bg-orange-50 overflow-y-scroll box-border">
    <header class="box-border text-lg font-bold flex justify-center items-center py-2">Notion Tools</header>
    <main>
      <div class="item flex items-center justify-between leading-10 text-base px-2" v-for="item of tools" :key="item.key" @click="onToggle($event, item.key)">
        <div class="title overflow-ellipsis">{{ item.name }}</div>
        <div class="switch">
          <label class="switch">
            <input type="checkbox" id="qb-popup-outline" data-id="outline" :checked="item.open" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.container {
  width: 300px;
}

.container main .item .switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 24px;
}
.container main .item .switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(18px);
  -ms-transform: translateX(18px);
  transform: translateX(18px);
}
</style>
