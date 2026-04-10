<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTransactions } from '@/api/transaction'
import { iconMap } from '@/utils/icons'
import { useAuthStore } from '@/stores/user'

const categoryIconMap = {
  주거: iconMap.home,
  식비: iconMap.cutlery,
  쇼핑: iconMap.shopping,
  카페: iconMap.coffee,
  교통: iconMap.bus,
  의료: iconMap.medical,
  여가: iconMap.leisure,
  투자: iconMap.invest,
  기타: iconMap.etc,
}

const authStore = useAuthStore()

const monthlyData = ref([])
const categoryData = ref([])

onMounted(async () => {
  const transactions = await getTransactions({ userId: authStore.currentUser?.id })

  // 월별 데이터 가공
  const monthMap = {}
  transactions.forEach((t) => {
    const month = String(Number(t.date.slice(5, 7))) + '월'
    if (!monthMap[month]) monthMap[month] = { month, income: 0, expense: 0 }
    if (t.type === 'income') monthMap[month].income += t.amount
    else monthMap[month].expense += t.amount
  })
  monthlyData.value = Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month))

  // 카테고리별 데이터 가공 (지출만)
  const categoryMap = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      if (!categoryMap[t.category]) categoryMap[t.category] = 0
      categoryMap[t.category] += t.amount
    })

  const maxAmount = Math.max(...Object.values(categoryMap), 1)
  categoryData.value = Object.entries(categoryMap).map(([name, amount]) => ({
    icon: categoryIconMap[name] ?? iconMap.etc,
    name,
    amount,
    max: maxAmount,
  }))
})

const profitData = computed(() =>
  monthlyData.value
    .filter((d) => d.income > 0 || d.expense > 0)
    .map((d) => ({
      month: d.month,
      income: d.income,
      expense: -d.expense,
      profit: d.income - d.expense,
    })),
)

const chartWidth = computed(() => Math.max(monthlyData.value.length * 50, 150))
const chartHeight = 100
const barWidth = 12

const gap = computed(() => chartWidth.value / monthlyData.value.length)

const maxValue = computed(() =>
  Math.max(...monthlyData.value.flatMap((d) => [d.income, d.expense]), 1),
)

function barHeight(value) {
  if (value === 0) return 0
  const height = (value / maxValue.value) * chartHeight
  return Math.max(height, 3)
}

function incomeX(i) {
  return i * gap.value + gap.value / 2 - barWidth - 1
}

function expenseX(i) {
  return incomeX(i) + barWidth + 2
}

function barY(value) {
  return chartHeight - barHeight(value)
}

function formatAmount(value) {
  if (Math.abs(value) >= 10000) {
    return (value / 10000).toLocaleString() + '만원'
  }
  return value.toLocaleString() + '원'
}

function profitSign(value) {
  return value >= 0 ? '+' : ''
}
</script>

<template>
  <div
    class="flex flex-col gap-[12px] p-[16px] pb-[120px] bg-kb-app-bg overflow-y-auto scrollbar-hide flex-1 min-h-0"
  >
    <section class="bg-kb-card rounded-[16px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h2 class="text-[15px] font-[700] text-kb-profit m-0 mb-[16px]">월별 수입·지출</h2>

      <div class="flex flex-col items-center">
        <svg
          :viewBox="`0 0 ${chartWidth} 120`"
          class="w-full h-[120px] overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g v-for="(data, i) in monthlyData" :key="data.month">
            <rect
              v-if="data.income > 0"
              :x="incomeX(i)"
              :y="barY(data.income)"
              :width="barWidth"
              :height="barHeight(data.income)"
              class="fill-kb-income"
              rx="3"
            />
            <rect
              v-if="data.expense > 0"
              :x="expenseX(i)"
              :y="barY(data.expense)"
              :width="barWidth"
              :height="barHeight(data.expense)"
              class="fill-kb-expense"
              rx="3"
            />
            <text
              :x="i * gap + gap / 2"
              y="116"
              text-anchor="middle"
              class="fill-kb-muted text-[11px]"
            >
              {{ data.month }}
            </text>
          </g>
        </svg>

        <div class="flex gap-[16px] mt-[10px]">
          <span class="text-[12px] text-kb-income">● 수입</span>
          <span class="text-[12px] text-kb-expense">● 지출</span>
        </div>
      </div>
    </section>

    <section class="bg-kb-card rounded-[16px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h2 class="text-[15px] font-[700] text-kb-profit m-0 mb-[16px]">월별 순이익</h2>
      <table class="w-full border-collapse text-[14px]">
        <thead>
          <tr class="border-b border-kb-divider">
            <th class="text-left py-[4px] pr-0 pl-0 pb-[8px] text-[12px] font-[500] text-kb-muted">
              월
            </th>
            <th class="text-right py-[4px] pr-0 pl-0 pb-[8px] text-[12px] font-[500] text-kb-muted">
              수입
            </th>
            <th class="text-right py-[4px] pr-0 pl-0 pb-[8px] text-[12px] font-[500] text-kb-muted">
              지출
            </th>
            <th class="text-right py-[4px] pr-0 pl-0 pb-[8px] text-[12px] font-[500] text-kb-muted">
              순이익
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in profitData"
            :key="row.month"
            class="border-b border-kb-divider last:border-b-0"
          >
            <td class="py-[10px] text-left font-[700] text-kb-profit">{{ row.month }}</td>
            <td class="py-[10px] text-right font-[600] text-kb-income">
              +{{ formatAmount(row.income) }}
            </td>
            <td class="py-[10px] text-right font-[600] text-kb-expense">
              {{ formatAmount(row.expense) }}
            </td>
            <td class="py-[10px] text-right font-[600] text-kb-profit">
              {{ profitSign(row.profit) }}{{ formatAmount(row.profit) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="bg-kb-card rounded-[16px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h2 class="text-[15px] font-[700] text-kb-profit m-0 mb-[16px]">카테고리별 지출</h2>
      <ul class="list-none m-0 p-0 flex flex-col gap-[14px]">
        <li v-for="item in categoryData" :key="item.name" class="flex items-center gap-[8px]">
          <div class="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
            <img :src="item.icon" :alt="item.name" class="w-full h-full object-contain" />
          </div>
          <span class="text-[13px] text-kb-soft-text w-[32px] flex-shrink-0">{{ item.name }}</span>
          <div class="flex-1 h-[8px] bg-kb-divider rounded-full overflow-hidden">
            <div
              class="h-full bg-kb-yellow rounded-full transition-all duration-[0.4s] ease-in-out"
              :style="{ width: (item.amount / item.max) * 100 + '%' }"
            ></div>
          </div>
          <span class="text-[13px] font-[600] text-kb-profit w-[80px] text-right flex-shrink-0">
            {{ item.amount.toLocaleString() }}원
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
/* Tailwind로 모든 스타일이 대체되어 별도의 CSS가 필요하지 않습니다. */
</style>
