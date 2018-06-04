<template>
  <div id="app">
    <div class="md-layout">
      <div class="md-layout-item score-card">
        <score-card/>
      </div>
      <div class="md-layout-item dice">
        <dice/>
      </div>
    </div>
    <div class="total-score" v-if="totalScore > 0">
      <h2>Total score:</h2>
      <h1>{{totalScore}}</h1>
      <md-button class="md-raised md-primary" @click="newGame">Start new game</md-button>
    </div>
  </div>
</template>

<script>
import ScoreCard from "@/components/ScoreCard";
import Dice from "@/components/Dice";

export default {
  name: "App",
  components: {
    "score-card": ScoreCard,
    "dice": Dice
  },
  data: function(){
    return {
      totalScore: 0
    }
  },
  mounted: function(){
    this.$root.$on('endGame', score => {
      this.totalScore = score
    });
  },
  methods: {
    newGame: function(){
      location.reload();
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.score-card {
  border-right: 1px solid #f0f0f0;
}

.total-score{
  padding:30px 0;
  h1{
    font-size:40px;
  }
}
</style>
