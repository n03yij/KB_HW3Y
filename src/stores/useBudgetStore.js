import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useAuthStore } from './user'

dayjs.locale('ko')

import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from '../api/transaction'
import apiClient from '../api/axios'

export const ALL_FILTER = '전체'

const getTimestamp = (value) => {
  const timestamp = dayjs(value).valueOf()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

const byNewestDate = (left, right) => {
  const dateDiff = getTimestamp(right.date) - getTimestamp(left.date)

  if (dateDiff !== 0) {
    return dateDiff
  }

  const updatedDiff =
    getTimestamp(right.updatedAt ?? right.createdAt) -
    getTimestamp(left.updatedAt ?? left.createdAt)

  if (updatedDiff !== 0) {
    return updatedDiff
  }

  return String(right.id ?? '').localeCompare(String(left.id ?? ''))
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

  const CATEGORY_ORDER = ['식비', '카페', '교통', '쇼핑', '의료', '여가', '주거', '기타']

  const filterOptions = computed(() => {
    const expenseCategories = new Set(
      monthlyTransactions.value
        .filter((transaction) => transaction.type === 'expense')
        .map((transaction) => transaction.category),
    )

    const sorted = CATEGORY_ORDER.filter((c) => expenseCategories.has(c))
    const rest = Array.from(expenseCategories).filter((c) => !CATEGORY_ORDER.includes(c))

    return [ALL_FILTER, '수입', '지출', ...sorted, ...rest]
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

  const groupedTransactions = computed(() => {
    const groups = new Map()

    filteredTransactions.value.forEach((transaction) => {
      const key = transaction.date
      const currentEntry = groups.get(key) ?? {
        date: key,
        label: dayjs(key).format('M월 D일 (dd)'),
        total: 0,
        items: [],
      }

      currentEntry.items.push(transaction)
      currentEntry.total += transaction.type === 'income' ? transaction.amount : -transaction.amount

      groups.set(key, currentEntry)
    })

    return Array.from(groups.values())
  })

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

  const fetchTransactions = async ({ month = currentMonth.value } = {}) => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      transactions.value = await getTransactions({
        userId: userId.value,
        month,
      })
    } catch (error) {
      errorMessage.value = '거래 내역을 불러오지 못했습니다.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const syncChallengeSpent = async (transactionMonth) => {
    const authStore = useAuthStore()
    const currentChallengeId = authStore.currentUser?.currentChallengeId
    if (!currentChallengeId) return

    const [challengeRes, allTransactions] = await Promise.all([
      apiClient.get(`/challenges/${currentChallengeId}`),
      getTransactions({ userId: userId.value, month: transactionMonth }),
    ])
    const challenge = challengeRes.data
    const mcRes = await apiClient.get(`/monthlyChallenge/${challenge.monthlyChallengeId}`)
    const mc = mcRes.data

    const spent = allTransactions
      .filter((t) => t.type === 'expense' && t.category === mc.category)
      .reduce((sum, t) => sum + t.amount, 0)
    const saved = Math.max(mc.targetAmount - spent, 0)

    await apiClient.patch(`/challenges/${currentChallengeId}`, { spentAmount: spent, savedAmount: saved })
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

      // 지출이고 이번 달 거래면 챌린지 금액 동기화
      if (createdTransaction.type === 'expense') {
        const txMonth = dayjs(createdTransaction.date).format('YYYY-MM')
        await syncChallengeSpent(txMonth)
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
    groupedTransactions,
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
  }
})
