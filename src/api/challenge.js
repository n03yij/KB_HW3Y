import apiClient from './axios'

export const getChallengeHistory = async (userId) => {
  const { data } = await apiClient.get('/challengeHistory', {
    params: { userId: String(userId) },
  })
  return Array.isArray(data) ? data : []
}
