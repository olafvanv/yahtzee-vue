<template>
  <div id="app">
    <md-toolbar class="header md-primary">
      <h1>Yahtzee</h1>
    </md-toolbar>
    <div class="md-layout container">
      <div class="md-layout-item md-medium-size-50 md-small-size-100 dice">
        <dice/>
      </div>
      <div class="md-layout-item md-medium-size-50 md-small-size-100 score-card">
        <score-card v-if="totalScore === 0"/>
        <div class="total-score" v-if="totalScore > 0">
          <h2>Total score:</h2>
          <h1>{{totalScore}}</h1>
          <md-button class="md-raised md-primary" @click="newGame">Start new game</md-button>
        </div>
      </div>
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
#app, .container{
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height:100vh;
}

.header{
  background-color:#111;
  width:100%;
  overflow:auto;
  color:#fff;
  text-align:center;
  h1{
    margin:0 auto;
  }
}

.dice { 
  background-color:#f0f0f0;
  min-height:100%;
}

.score-card {
  border-left: 1px solid #f0f0f0;
}

.total-score{
  padding:30px 0;
  h1{
    font-size:40px;
  }
}
</style>
