<script setup>
import dayjs from 'dayjs'
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import TransactionItem from '@/components/transaction/TransactionItem.vue'
import TransactionModal from '@/components/transaction/TransactionModal.vue'
import { ALL_FILTER, useBudgetStore } from '@/stores/useBudgetStore'
import { formatCompactWon, formatSignedWon } from '@/utils/format'

const budgetStore = useBudgetStore()
const {
  currentMonth,
  errorMessage,
  filterOptions,
  groupedTransactions,
  isLoading,
  isSaving,
  monthlySummary,
  selectedFilter,
} = storeToRefs(budgetStore)
const { addTransaction, fetchTransactions, setCurrentMonth, setSelectedFilter } = budgetStore

const isTransactionModalOpen = ref(false)

const currentMonthLabel = computed(() => dayjs(`${currentMonth.value}-01`).format('YYYY년 M월'))

const defaultTransactionDate = computed(() => {
  const today = dayjs()
  return today.format('YYYY-MM') === currentMonth.value
    ? today.format('YYYY-MM-DD')
    : `${currentMonth.value}-01`
})

const summaryCards = computed(() => [
  {
    label: '수입',
    amount: `+${formatCompactWon(monthlySummary.value.income)}`,
    amountClass: 'text-kb-income',
  },
  {
    label: '지출',
    amount: `-${formatCompactWon(monthlySummary.value.expense)}`,
    amountClass: 'text-kb-expense',
  },
  {
    label: '순이익',
    amount: `${monthlySummary.value.balance >= 0 ? '+' : '-'}${formatCompactWon(monthlySummary.value.balance)}`,
    amountClass: monthlySummary.value.balance >= 0 ? 'text-kb-income' : 'text-kb-expense',
  },
])

const moveMonth = (diff) => {
  const nextMonth = dayjs(`${currentMonth.value}-01`).add(diff, 'month').format('YYYY-MM')
  setCurrentMonth(nextMonth)
}

const openTransactionModal = () => {
  isTransactionModalOpen.value = true
}

const closeTransactionModal = () => {
  if (isSaving.value) return
  isTransactionModalOpen.value = false
}

const handleCreateTransaction = async (payload) => {
  try {
    await addTransaction(payload)
    setSelectedFilter(ALL_FILTER)
    closeTransactionModal()
  } catch (error) {
    console.error(error)
  }
}

watch(
  currentMonth,
  async (month) => {
    try {
      await fetchTransactions({ month })
    } catch (error) {
      console.error(error)
    }
  },
  { immediate: true },
)
</script>

<template>
  <main class="relative h-full overflow-hidden bg-kb-app-bg text-kb-profit">
    <div
      class="h-full pb-[120px]"
      :class="isTransactionModalOpen ? 'overflow-hidden' : 'overflow-y-auto scrollbar-hide'"
    >
      <section class="bg-kb-yellow px-5 pb-5 pt-2">
        <div class="flex items-center justify-between pt-1">
          <button
            type="button"
            aria-label="이전 달"
            class="flex h-9 w-9 items-center justify-center text-[28px] font-semibold text-kb-dark-gray"
            @click="moveMonth(-1)"
          >
            ‹
          </button>

          <h1 class="text-[22px] font-extrabold tracking-[-0.03em] text-kb-dark-gray">
            {{ currentMonthLabel }}
          </h1>

          <button
            type="button"
            aria-label="다음 달"
            class="flex h-9 w-9 items-center justify-center text-[28px] font-semibold text-kb-dark-gray"
            @click="moveMonth(1)"
          >
            ›
          </button>
        </div>

        <div class="mt-4 grid grid-cols-3 gap-3">
          <article
            v-for="card in summaryCards"
            :key="card.label"
            class="rounded-[18px] bg-kb-card-yellow px-2 py-2 text-center shadow-sm"
          >
            <p class="text-[13px] font-medium text-kb-gray">{{ card.label }}</p>
            <p class="mt-1 text-[15px] font-extrabold tracking-[-0.03em]" :class="card.amountClass">
              {{ card.amount }}
            </p>
          </article>
        </div>
      </section>

      <section class="px-3 pb-4 pt-3">
        <div class="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          <button
            v-for="option in filterOptions"
            :key="option"
            type="button"
            class="shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold transition"
            :class="
              selectedFilter === option
                ? 'border-kb-yellow bg-kb-yellow text-kb-dark-gray'
                : 'border-kb-line bg-kb-card text-kb-soft-text'
            "
            @click="setSelectedFilter(option)"
          >
            {{ option }}
          </button>
        </div>

        <div v-if="isLoading" class="space-y-5 pt-5">
          <div v-for="index in 4" :key="index" class="space-y-2">
            <div class="h-6 w-28 animate-pulse rounded bg-kb-line"></div>
            <div class="h-24 animate-pulse rounded-[22px] bg-kb-card-yellow"></div>
          </div>
        </div>

        <p
          v-else-if="errorMessage"
          class="mt-4 rounded-[20px] bg-kb-card px-4 py-4 text-[14px] text-kb-expense shadow-sm"
        >
          {{ errorMessage }}
        </p>

        <div v-else-if="groupedTransactions.length" class="space-y-5 pt-4">
          <section v-for="group in groupedTransactions" :key="group.date">
            <div class="mb-2 flex items-center justify-between px-1">
              <h2 class="text-[14px] font-bold text-kb-muted">{{ group.label }}</h2>
              <p class="text-[14px] font-extrabold text-kb-soft-text">
                {{ formatSignedWon(group.total) }}
              </p>
            </div>

            <div class="overflow-hidden rounded-[22px] bg-kb-card shadow-sm">
              <div class="divide-y divide-kb-divider">
                <TransactionItem
                  v-for="transaction in group.items"
                  :key="transaction.id"
                  :transaction="transaction"
                />
              </div>
            </div>
          </section>
        </div>

        <div
          v-else
          class="mt-6 rounded-[22px] bg-kb-card px-5 py-10 text-center text-[14px] text-kb-empty shadow-sm"
        >
          선택한 조건에 맞는 거래내역이 없어요.
        </div>
      </section>
    </div>

    <button
      v-if="!isTransactionModalOpen"
      type="button"
      aria-label="거래 추가"
      class="absolute bottom-[96px] right-6 z-20 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-kb-yellow text-kb-dark-gray shadow-lg"
      @click="openTransactionModal"
    >
      <span class="text-[38px] font-semibold leading-none pb-1">+</span>
    </button>

    <TransactionModal
      v-if="isTransactionModalOpen"
      :default-date="defaultTransactionDate"
      :is-saving="isSaving"
      @close="closeTransactionModal"
      @submit="handleCreateTransaction"
    />
  </main>
</template>
