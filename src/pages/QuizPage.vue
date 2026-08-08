<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { VdChart } from '@vanduo-oss/vd3-cbun/charts'
import '@vanduo-oss/vd3-cbun/charts/css'
import { useSeo } from '@/composables/useSeo'
import { useDisclaimerConsent } from '@/composables/useDisclaimerConsent'
import {
  QUIZ_DIMENSION_MAX,
  QUIZ_ITEMS,
  quizDimensionChartData,
  scoreLabel,
  scoreQuiz,
} from '@/content/quiz'
import { SITE } from '@/data/site'
import { saveQuizScore } from '@/lib/storage'

useSeo({
  title: 'Ikigai-9 quiz',
  description: 'Rate nine statements to get a Purpose Readiness Score, then continue on the map.',
  path: '/quiz',
})

const { accepted } = useDisclaimerConsent()

const answers = reactive<Record<number, number>>({})
const submitted = ref(false)

const score = computed(() => scoreQuiz(answers))
const complete = computed(() => QUIZ_ITEMS.every((item) => answers[item.id] != null))
const dimensionChartData = computed(() =>
  score.value ? quizDimensionChartData(score.value) : [],
)

function brandBarColor() {
  return SITE.brandColor
}

function dimensionTooltip(
  _datum: Record<string, unknown>,
  ctx: { label?: unknown; value?: number },
) {
  const label = ctx.label != null ? String(ctx.label) : 'Dimension'
  const value = ctx.value ?? 0
  return `${label}: ${value} / ${QUIZ_DIMENSION_MAX}`
}

function submit() {
  if (!accepted.value || !score.value) return
  submitted.value = true
  saveQuizScore({ ...score.value, at: new Date().toISOString() })
}

function reset() {
  for (const item of QUIZ_ITEMS) delete answers[item.id]
  submitted.value = false
}
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>Ikigai-9 quiz</h1>
      <p>
        Rate each statement from 1 (does not apply) to 5 (applies a lot). Your score stays in this
        browser unless you clear site data — it is a baseline for reflection, not a diagnosis.
      </p>
    </header>

    <div v-if="!accepted" class="disclaimer" data-testid="quiz-locked" role="status">
      <p>
        The quiz stays locked until you accept the site disclaimer. Interactive scoring and
        localStorage saves require your consent.
      </p>
    </div>

    <template v-else>
      <form class="section" style="padding-top: 0" @submit.prevent="submit">
        <fieldset v-for="item in QUIZ_ITEMS" :key="item.id" class="quiz-item">
          <legend>{{ item.id }}. {{ item.text }}</legend>
          <div class="likert" role="radiogroup" :aria-label="`Item ${item.id}`">
            <label v-for="n in 5" :key="n">
              <input v-model.number="answers[item.id]" type="radio" :name="`q${item.id}`" :value="n" />
              {{ n }}
            </label>
          </div>
        </fieldset>

        <div class="hero-actions">
          <button
            type="submit"
            class="vd-btn vd-btn-primary"
            :disabled="!complete"
            data-testid="quiz-submit"
          >
            See my score
          </button>
          <button type="button" class="vd-btn vd-btn-ghost-primary" @click="reset">Reset</button>
        </div>
      </form>

      <div v-if="submitted && score" class="quiz-result" data-testid="quiz-result">
        <h2>Purpose Readiness Score: {{ score.total }} / {{ score.max }} ({{ score.percent }}%)</h2>
        <p>{{ scoreLabel(score) }}</p>
        <div class="quiz-result-chart" data-testid="quiz-result-chart">
          <VdChart
            type="bar"
            :data="dimensionChartData"
            x="label"
            y="score"
            :color="brandBarColor"
            :height="200"
            :y-min="0"
            :y-max="QUIZ_DIMENSION_MAX"
            :y-include-zero="true"
            :y-tick-count="4"
            :legend="false"
            :responsive="true"
            title="Ikigai-9 dimension scores"
            description="Bar chart of emotions, future attitudes, and meaning scores out of 15"
            :tooltip="dimensionTooltip"
          />
        </div>
        <ul class="quiz-result-dims">
          <li>Emotions toward life: {{ score.emotions }} / {{ QUIZ_DIMENSION_MAX }}</li>
          <li>Attitudes toward the future: {{ score.future }} / {{ QUIZ_DIMENSION_MAX }}</li>
          <li>Meaning of existence: {{ score.meaning }} / {{ QUIZ_DIMENSION_MAX }}</li>
        </ul>
        <p>
          Next: open the
          <RouterLink to="/map">interactive map</RouterLink>
          and start with one specific activity you enjoyed this week.
        </p>
      </div>
    </template>
  </div>
</template>
