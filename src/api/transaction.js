import apiClient from './axios'

// 거래내역 조회
export const getTransactions = async ({ userId, month } = {}) => {
  const params = { userId }
  // json-server v1 beta uses field operators like date:startsWith=2026-04
  if (month) params['date:startsWith'] = month // ex) '2026-04'
  const { data } = await apiClient.get('/transactions', { params })
  return data
}

// 거래내역 추가
export const createTransaction = async (payload) => {
  const timestamp = new Date().toISOString()
  const requestBody = {
    userId: payload.userId,
    type: payload.type,
    category: payload.category,
    amount: Number(payload.amount),
    date: payload.date,
    merchant: payload.merchant ?? '',
    memo: payload.memo ?? '',
    createdAt: payload.createdAt ?? timestamp,
    updatedAt: payload.updatedAt ?? timestamp,
  }

  const { data } = await apiClient.post('/transactions', requestBody)
  return data
}

// 거래내역 수정
export const updateTransaction = async (id, payload) => {
  const requestBody = {
    ...payload,
    amount: payload.amount === undefined ? undefined : Number(payload.amount),
    updatedAt: payload.updatedAt ?? new Date().toISOString(),
  }

  const { data } = await apiClient.patch(`/transactions/${id}`, requestBody)
  return data
}

// 거래내역 삭제
export const deleteTransaction = async (id) => {
  await apiClient.delete(`/transactions/${id}`)
}
