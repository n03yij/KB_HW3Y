import dayjs from 'dayjs'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { useAuthStore } from './user'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../api/transaction'

export const ALL_FILTER = '전체'

const byNewestDate = (left, right) => {
  const dateDiff = dayjs(right.date).valueOf() - dayjs(left.date).valueOf()

  if (dateDiff !== 0) {
    return dateDiff
  }

  return (right.id ?? 0) - (left.id ?? 0)
}

const normalizeCreatePayload = (payload) => ({
  type: payload.type,
  category: payload.category,
  amount: Number(payload.amount),
  date: payload.date,
  merchant: payload.merchant ?? '',
  memo: payload.memo ?? '',
})

const normalizeUpdatePayload = (payload) => {
  const nextPayload = {}

  if (payload.type !== undefined) nextPayload.type = payload.type
  if (payload.category !== undefined) nextPayload.category = payload.category
  if (payload.amount !== undefined) nextPayload.amount = Number(payload.amount)
  if (payload.date !== undefined) nextPayload.date = payload.date
  if (payload.merchant !== undefined) nextPayload.merchant = payload.merchant
  if (payload.memo !== undefined) nextPayload.memo = payload.memo

  return nextPayload
}

export const useBudgetStore = defineStore('budget', () => {
  const authStore = useAuthStore()

  // 로그인된 유저의 ID를 항상 참조 (하드코딩 제거)
  const userId = computed(() => authStore.currentUser?.id)
  const currentMonth = ref(dayjs().format('YYYY-MM'))
  const selectedFilter = ref(ALL_FILTER)
  const transactions = ref([])
  const isLoading = ref(false)
  const isSaving = ref(false)
  const errorMessage = ref('')

  const monthlyTransactions = computed(() => [...transactions.value].sort(byNewestDate))

  const filterOptions = computed(() => {
    const expenseCategories = new Set(
      monthlyTransactions.value
        .filter((transaction) => transaction.type === 'expense')
        .map((transaction) => transaction.category),
    )

    return [ALL_FILTER, '수입', '지출', ...Array.from(expenseCategories)]
  })

  const filteredTransactions = computed(() => {
    if (selectedFilter.value === ALL_FILTER) {
      return monthlyTransactions.value
    }

    if (selectedFilter.value === '수입') {
      return monthlyTransactions.value.filter((transaction) => transaction.type === 'income')
    }

    if (selectedFilter.value === '지출') {
      return monthlyTransactions.value.filter((transaction) => transaction.type === 'expense')
    }

    return monthlyTransactions.value.filter(
      (transaction) => transaction.category === selectedFilter.value,
    )
  })

  const monthlySummary = computed(() =>
    monthlyTransactions.value.reduce(
      (summary, transaction) => {
        if (transaction.type === 'income') {
          summary.income += transaction.amount
        } else {
          summary.expense += transaction.amount
        }

        summary.balance = summary.income - summary.expense
        return summary
      },
      {
        income: 0,
        expense: 0,
        balance: 0,
      },
    ),
  )

  const categorySummary = computed(() => {
    const totalsByCategory = new Map()

    monthlyTransactions.value
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        const currentAmount = totalsByCategory.get(transaction.category) ?? 0
        totalsByCategory.set(transaction.category, currentAmount + transaction.amount)
      })

    return Array.from(totalsByCategory.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((left, right) => right.amount - left.amount)
  })

  const fetchTransactions = async ({
    targetUserId = userId.value,
    month = currentMonth.value,
  } = {}) => {
    isLoading.value = true
    errorMessage.value = ''
    userId.value = targetUserId
    currentMonth.value = month

    try {
      transactions.value = await getTransactions({
        userId: targetUserId,
        month,
      })
    } catch (error) {
      errorMessage.value = '거래 내역을 불러오지 못했습니다.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const addTransaction = async (payload) => {
    isSaving.value = true
    errorMessage.value = ''

    try {
      const createdTransaction = await createTransaction({
        userId: userId.value,
        ...normalizeCreatePayload(payload),
      })

      if (dayjs(createdTransaction.date).format('YYYY-MM') === currentMonth.value) {
        transactions.value = [...transactions.value, createdTransaction].sort(byNewestDate)
      }

      return createdTransaction
    } catch (error) {
      errorMessage.value = '거래 내역을 저장하지 못했습니다.'
      throw error
    } finally {
      isSaving.value = false
    }
  }

  const editTransaction = async (transactionId, payload) => {
    isSaving.value = true
    errorMessage.value = ''

    try {
      const updatedTransaction = await updateTransaction(
        transactionId,
        normalizeUpdatePayload(payload),
      )

      const shouldDisplay = dayjs(updatedTransaction.date).format('YYYY-MM') === currentMonth.value

      transactions.value = shouldDisplay
        ? transactions.value
            .map((transaction) =>
              transaction.id === transactionId ? updatedTransaction : transaction,
            )
            .sort(byNewestDate)
        : transactions.value.filter((transaction) => transaction.id !== transactionId)

      return updatedTransaction
    } catch (error) {
      errorMessage.value = '거래 내역을 수정하지 못했습니다.'
      throw error
    } finally {
      isSaving.value = false
    }
  }

  const removeTransaction = async (transactionId) => {
    isSaving.value = true
    errorMessage.value = ''

    try {
      await deleteTransaction(transactionId)
      transactions.value = transactions.value.filter(
        (transaction) => transaction.id !== transactionId,
      )
    } catch (error) {
      errorMessage.value = '거래 내역을 삭제하지 못했습니다.'
      throw error
    } finally {
      isSaving.value = false
    }
  }

  const setCurrentMonth = (month) => {
    currentMonth.value = month
  }

  const setSelectedFilter = (filter = ALL_FILTER) => {
    selectedFilter.value = filter
  }

  return {
    addTransaction,
    categorySummary,
    currentMonth,
    editTransaction,
    errorMessage,
    fetchTransactions,
    filteredTransactions,
    filterOptions,
    isLoading,
    isSaving,
    monthlySummary,
    monthlyTransactions,
    removeTransaction,
    selectedFilter,
    setCurrentMonth,
    setSelectedFilter,
    transactions,
    userId,
  }
})
