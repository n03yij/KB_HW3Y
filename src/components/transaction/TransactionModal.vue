<script setup>
import dayjs from 'dayjs'
import { computed, onMounted, ref, watch } from 'vue'


const HEADER_HEIGHT = 60
const DEFAULT_HEIGHT = 520

const isVisible = ref(false)

const sectionRef = ref(null)
const modalHeight = ref(DEFAULT_HEIGHT)
const isDragging = ref(false)
const dragStartY = ref(0)
const dragStartHeight = ref(DEFAULT_HEIGHT)

const modalStyle = computed(() => ({
  height: `${modalHeight.value}px`,
  transition: isDragging.value
    ? 'none'
    : 'height 0.3s cubic-bezier(0.32, 0.72, 0, 1), transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
  transform: isVisible.value ? 'translateY(0)' : 'translateY(100%)',
}))

const getMaxHeight = () => {
  const containerHeight = sectionRef.value?.parentElement?.offsetHeight ?? window.innerHeight
  return containerHeight - HEADER_HEIGHT
}

const onPointerDown = (e) => {
  isDragging.value = true
  dragStartY.value = e.clientY
  dragStartHeight.value = modalHeight.value
  e.currentTarget.setPointerCapture(e.pointerId)
}

const onPointerMove = (e) => {
  if (!isDragging.value) return
  const delta = dragStartY.value - e.clientY
  const maxH = getMaxHeight()
  modalHeight.value = Math.min(Math.max(dragStartHeight.value + delta, DEFAULT_HEIGHT), maxH)
}

const onPointerUp = () => {
  if (!isDragging.value) return
  isDragging.value = false
  const maxH = getMaxHeight()
  const midpoint = (DEFAULT_HEIGHT + maxH) / 2
  modalHeight.value = modalHeight.value > midpoint ? maxH : DEFAULT_HEIGHT
}

import busIcon from '@/assets/bus.svg'
import coffeeIcon from '@/assets/coffee.svg'
import cutleryIcon from '@/assets/cutlery.svg'
import etcIcon from '@/assets/Etc.svg'
import homeIcon from '@/assets/home.svg'
import investIcon from '@/assets/Invest.svg'
import leisureIcon from '@/assets/leisure.svg'
import medicalIcon from '@/assets/Medical.svg'
import salaryIcon from '@/assets/Salary.svg'
import shoppingBagIcon from '@/assets/shoppingBag.svg'
import sideJobIcon from '@/assets/SideJob.svg'

const props = defineProps({
  defaultDate: {
    type: String,
    required: true,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'submit'])

const expenseCategories = [
  { label: '식비', icon: cutleryIcon, iconBg: 'bg-kb-icon-yellow' },
  { label: '카페', icon: coffeeIcon, iconBg: 'bg-kb-icon-beige' },
  { label: '교통', icon: busIcon, iconBg: 'bg-kb-icon-blue' },
  { label: '쇼핑', icon: shoppingBagIcon, iconBg: 'bg-kb-icon-pink' },
  { label: '의료', icon: medicalIcon, iconBg: 'bg-kb-icon-ivory' },
  { label: '여가', icon: leisureIcon, iconBg: 'bg-kb-icon-beige' },
  { label: '주거', icon: homeIcon, iconBg: 'bg-kb-icon-ivory' },
  { label: '기타', icon: etcIcon, iconBg: 'bg-kb-icon-ivory' },
]

const incomeCategories = [
  { label: '급여', icon: salaryIcon, iconBg: 'bg-kb-icon-blue' },
  { label: '부업', icon: sideJobIcon, iconBg: 'bg-kb-icon-green' },
  { label: '투자', icon: investIcon, iconBg: 'bg-kb-icon-blue' },
  { label: '기타', icon: etcIcon, iconBg: 'bg-kb-icon-ivory' },
]

const selectedType = ref('expense')
const amountInput = ref('')
const selectedCategory = ref(expenseCategories[0].label)
const selectedDate = ref(props.defaultDate)
const memo = ref('')

const categoryOptions = computed(() =>
  selectedType.value === 'expense' ? expenseCategories : incomeCategories,
)

const canSubmit = computed(
  () =>
    Number(amountInput.value) > 0 &&
    Boolean(selectedCategory.value) &&
    Boolean(selectedDate.value) &&
    !props.isSaving,
)

const formattedDate = computed(() => dayjs(selectedDate.value).format('YYYY. MM. DD.'))

const resetForm = () => {
  selectedType.value = 'expense'
  amountInput.value = ''
  selectedCategory.value = expenseCategories[0].label
  selectedDate.value = props.defaultDate
  memo.value = ''
}

watch(
  () => props.defaultDate,
  () => {
    resetForm()
  },
  { immediate: true },
)

watch(selectedType, () => {
  selectedCategory.value = categoryOptions.value[0]?.label ?? ''
})

const updateAmount = (event) => {
  amountInput.value = event.target.value.replace(/\D/g, '')
}

onMounted(() => {
  requestAnimationFrame(() => {
    isVisible.value = true
  })
})

const closeModal = () => {
  if (props.isSaving) return
  isVisible.value = false
  setTimeout(() => emit('close'), 320)
}

const handleBackdropClick = (event) => {
  if (event.target === event.currentTarget) {
    closeModal()
  }
}

const handleSubmit = () => {
  if (!canSubmit.value) return

  const trimmedMemo = memo.value.trim()

  emit('submit', {
    type: selectedType.value,
    amount: Number(amountInput.value),
    category: selectedCategory.value,
    date: selectedDate.value,
    memo: trimmedMemo,
    merchant: trimmedMemo,
  })
}
</script>

<template>
  <Teleport to="#app-container">
  <div
    class="absolute inset-0 z-30 flex items-end transition-[background-color] duration-300"
    :class="isVisible ? 'bg-kb-overlay' : 'bg-transparent'"
    role="dialog"
    aria-modal="true"
    aria-label="거래 추가"
    @click="handleBackdropClick"
  >
    <section
      ref="sectionRef"
      class="flex w-full flex-col rounded-t-[28px] bg-kb-card px-4 pb-4 pt-3 shadow-2xl"
      :style="modalStyle"
    >
      <div
        class="mx-auto h-[5px] w-[80px] cursor-grab touch-none rounded-full bg-kb-line active:cursor-grabbing"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
      ></div>

      <div class="mt-4 flex items-center justify-between">
        <h2 class="text-[22px] font-black tracking-[-0.05em] text-kb-profit">거래 추가</h2>
      </div>

      <div class="mt-4 flex-1 overflow-y-auto pr-1">
        <div class="rounded-[16px] bg-kb-app-bg p-[5px]">
          <div class="grid grid-cols-2 gap-[5px]">
            <button
              type="button"
              class="h-[46px] rounded-[12px] border bg-kb-card text-[15px] font-extrabold transition"
              :class="
                selectedType === 'expense'
                  ? 'border-kb-line text-kb-expense shadow-sm'
                  : 'border-transparent bg-transparent text-kb-muted shadow-none'
              "
              @click="selectedType = 'expense'"
            >
              지출
            </button>
            <button
              type="button"
              class="h-[46px] rounded-[12px] border bg-kb-card text-[15px] font-extrabold transition"
              :class="
                selectedType === 'income'
                  ? 'border-kb-line text-kb-income shadow-sm'
                  : 'border-transparent bg-transparent text-kb-muted shadow-none'
              "
              @click="selectedType = 'income'"
            >
              수입
            </button>
          </div>
        </div>

        <div class="mt-4">
          <label class="text-[13px] font-semibold text-kb-muted">금액</label>
          <div class="mt-1 border-b-[2px] border-kb-yellow pb-1">
            <input
              :value="amountInput"
              type="text"
              inputmode="numeric"
              placeholder="0"
              class="w-full border-none bg-transparent text-[34px] font-black leading-none tracking-[-0.05em] text-kb-profit outline-none placeholder:text-kb-profit"
              @input="updateAmount"
            />
          </div>
        </div>

        <div class="mt-3">
          <label class="text-[13px] font-semibold text-kb-muted">카테고리</label>
          <div class="mt-2 grid grid-cols-4 gap-2">
            <button
              v-for="category in categoryOptions"
              :key="category.label"
              type="button"
              class="flex h-[68px] flex-col items-center justify-center gap-[5px] rounded-[14px] border px-2 text-center transition"
              :class="
                selectedCategory === category.label
                  ? 'border-kb-yellow bg-kb-icon-yellow'
                  : 'border-kb-line bg-kb-card'
              "
              @click="selectedCategory = category.label"
            >
              <img :src="category.icon" :alt="category.label" class="h-5 w-5 object-contain" />
              <span
                class="text-[11px]"
                :class="selectedCategory === category.label ? 'font-black text-kb-dark-gray' : 'font-semibold text-kb-gray'"
              >
                {{ category.label }}
              </span>
            </button>
          </div>
        </div>

        <div class="mt-4">
          <label class="text-[13px] font-semibold text-kb-muted">날짜</label>
          <div class="relative mt-1">
            <input
              v-model="selectedDate"
              type="date"
              class="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />
            <div
              class="flex h-[56px] items-center justify-between rounded-[16px] border border-kb-line bg-kb-app-bg px-4"
            >
              <span class="text-[16px] font-medium tracking-[-0.02em] text-kb-profit">
                {{ formattedDate }}
              </span>
              <span class="text-[13px] font-semibold text-kb-muted">달력</span>
            </div>
          </div>
        </div>

        <div class="mt-4">
          <label class="text-[13px] font-semibold text-kb-muted">메모</label>
          <textarea
            v-model="memo"
            rows="2"
            maxlength="40"
            placeholder="어디서"
            class="mt-1 h-[80px] w-full resize-none rounded-[16px] border border-kb-line bg-kb-app-bg px-4 py-3 text-[16px] text-kb-profit outline-none placeholder:text-kb-muted"
          ></textarea>
        </div>
      </div>

      <button
        type="button"
        class="mt-4 flex h-[64px] w-full items-center justify-center rounded-[22px] bg-kb-yellow text-[20px] font-black tracking-[-0.04em] text-kb-dark-gray shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
        :disabled="isSaving"
        @click="handleSubmit"
      >
        {{ isSaving ? '저장 중...' : '저장하기' }}
      </button>
    </section>
  </div>
  </Teleport>
</template>
