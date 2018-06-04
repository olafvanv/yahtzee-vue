import Vue from 'vue'
import Router from 'vue-router'

import ScoreCard from '@/components/ScoreCard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ScoreCard',
      component: ScoreCard
    }
  ]
})
