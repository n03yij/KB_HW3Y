<script setup>
import { ref, computed } from 'vue'
import house from '@/assets/home.svg'
import cutlery from '@/assets/cutlery.svg'
import shoppingBag from '@/assets/shoppingBag.svg'
import coffee from '@/assets/coffee.svg'
import bus from '@/assets/bus.svg'

//TODO: api 연결 하면... 아래 임시 데이터 제거
const monthlyData = ref([
  { month: '1월', income: 10000000, expense: 99999 },
  { month: '2월', income: 3849800, expense: 22222 },
  { month: '3월', income: 2000, expense: 1500000 },
  { month: '4월', income: 3500000, expense: 457000 },
  { month: '5월', income: 500000, expense: 800000 },
  { month: '6월', income: 11111111, expense: 222222 },
])

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

const categoryData = ref([
  { icon: house, name: '주거', amount: 250000, max: 500000 },
  { icon: cutlery, name: '식비', amount: 73000, max: 500000 },
  { icon: shoppingBag, name: '쇼핑', amount: 89000, max: 500000 },
  { icon: coffee, name: '카페', amount: 32000, max: 500000 },
  { icon: bus, name: '교통', amount: 12500, max: 500000 },
])

// SVG 차트 계산
const chartWidth = 300 // 간격을 더 예쁘게 빼기 위해 300으로 살짝 넓혔습니다.
const chartHeight = 100
const barWidth = 12

// 각 월이 차지할 영역의 너비
const gap = computed(() => chartWidth / monthlyData.value.length)

const maxValue = computed(() =>
  Math.max(...monthlyData.value.flatMap((d) => [d.income, d.expense]), 1),
)

// 막대 높이 (금액이 작아도 최소 3px은 보이도록 보정)
function barHeight(value) {
  if (value === 0) return 0
  const height = (value / maxValue.value) * chartHeight
  return Math.max(height, 3)
}

// 수입 막대 위치: 각 영역의 정중앙(gap/2)에서 왼쪽으로 이동
function incomeX(i) {
  return i * gap.value + gap.value / 2 - barWidth - 1
}

// 지출 막대 위치: 수입 막대 바로 옆
function expenseX(i) {
  return incomeX(i) + barWidth + 2
}

// Y좌표 계산
function barY(value) {
  return chartHeight - barHeight(value)
}

// 금액 포맷 (만원 단위)
function formatAmount(value) {
  if (Math.abs(value) >= 10000) {
    return (value / 10000).toLocaleString() + '만원'
  }
  return value.toLocaleString() + '원'
}

// 순이익 부호 표시
function profitSign(value) {
  return value >= 0 ? '+' : ''
}
</script>

<template>
  <div class="flex flex-col gap-[12px] p-[16px] bg-[#f5f5f5] flex-1 overflow-y-auto">
    <section class="bg-white rounded-[16px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h2 class="text-[15px] font-[700] text-[#222] m-0 mb-[16px]">월별 수입·지출</h2>

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
              class="fill-[#81c784]"
              rx="3"
            />
            <rect
              v-if="data.expense > 0"
              :x="expenseX(i)"
              :y="barY(data.expense)"
              :width="barWidth"
              :height="barHeight(data.expense)"
              class="fill-[#ef9a9a]"
              rx="3"
            />

            <text
              :x="i * gap + gap / 2"
              y="116"
              text-anchor="middle"
              class="fill-[#999] text-[11px]"
            >
              {{ data.month }}
            </text>
          </g>
        </svg>

        <div class="flex gap-[16px] mt-[10px]">
          <span class="text-[12px] text-[#81c784]">● 수입</span>
          <span class="text-[12px] text-[#ef9a9a]">● 지출</span>
        </div>
      </div>
    </section>

    <section class="bg-white rounded-[16px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h2 class="text-[15px] font-[700] text-[#222] m-0 mb-[16px]">월별 순이익</h2>
      <table class="w-full border-collapse text-[14px]">
        <thead>
          <tr class="border-b border-[#f0f0f0]">
            <th class="text-left py-[4px] pr-0 pl-0 pb-[8px] text-[12px] font-[500] text-[#aaa]">
              월
            </th>
            <th class="text-right py-[4px] pr-0 pl-0 pb-[8px] text-[12px] font-[500] text-[#aaa]">
              수입
            </th>
            <th class="text-right py-[4px] pr-0 pl-0 pb-[8px] text-[12px] font-[500] text-[#aaa]">
              지출
            </th>
            <th class="text-right py-[4px] pr-0 pl-0 pb-[8px] text-[12px] font-[500] text-[#aaa]">
              순이익
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in profitData"
            :key="row.month"
            class="border-b border-[#f8f8f8] last:border-b-0"
          >
            <td class="py-[10px] text-left font-[700] text-[#333]">{{ row.month }}</td>
            <td class="py-[10px] text-right font-[600] text-[#4caf50]">
              +{{ formatAmount(row.income) }}
            </td>
            <td class="py-[10px] text-right font-[600] text-[#f44336]">
              {{ formatAmount(row.expense) }}
            </td>
            <td class="py-[10px] text-right font-[600] text-[#2196f3]">
              {{ profitSign(row.profit) }}{{ formatAmount(row.profit) }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="bg-white rounded-[16px] p-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
      <h2 class="text-[15px] font-[700] text-[#222] m-0 mb-[16px]">카테고리별 지출</h2>
      <ul class="list-none m-0 p-0 flex flex-col gap-[14px]">
        <li v-for="item in categoryData" :key="item.name" class="flex items-center gap-[8px]">
          <div class="w-[20px] h-[20px] flex items-center justify-center flex-shrink-0">
            <img :src="item.icon" :alt="item.name" class="w-full h-full object-contain" />
          </div>

          <span class="text-[13px] text-[#444] w-[32px] flex-shrink-0">{{ item.name }}</span>
          <div class="flex-1 h-[8px] bg-[#f0f0f0] rounded-full overflow-hidden">
            <div
              class="h-full bg-[#ffc107] rounded-full transition-all duration-[0.4s] ease-in-out"
              :style="{ width: (item.amount / item.max) * 100 + '%' }"
            ></div>
          </div>
          <span class="text-[13px] font-[600] text-[#333] w-[80px] text-right flex-shrink-0">
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
