<template>
  <div class="score-card-container">
    <h1>Score Card</h1>
    <div class="md-layout">
      <div class="md-layout-item">
        <div class="uppersection" v-for="score in scoreCard.upperScores" :key="score.id">
          <span class="name">{{score.name}}</span>:
          <button class="score" :disabled="score.isScored" v-on:click="selectScore(score, score.calculate(score.id))">
            <span v-if="score.scratched">x</span>
            <span v-else>{{score.calculate(score.id)}}</span>
          </button>
        </div>
        <div class="uppersection" :class="{'bonus': score.name === 'Bonus', 'total': score.name==='Total'}" v-for="score in scoreCard.upperTotals" :key="score.id">
          <span class="name">{{score.name}}</span>:<button class="score disabled">{{score.calculate()}}</button>
        </div>
      </div>
      <div class="md-layout-item">
        <div class="lowersection" v-for="score in scoreCard.lowerScores" :key="score.id">
          <span class="name">{{score.name}}</span>:
          <button type="button" class="score" :disabled="score.isScored" v-on:click="selectScore(score, score.calculate(score.id))">
            <span v-if="score.scratched">x</span>
            <span v-else>{{score.calculate(score.id)}}</span>
          </button>
        </div>
        <div class="lowersection" :class="{'bonus': score.name === 'Bonus', 'total': score.name==='Total'}" v-for="score in scoreCard.lowerTotals" :key="score.id">
          <span class="name">{{score.name}}</span>:<button class="score disabled">{{score.calculate()}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScoreCard",
  data: function() {
    return {
      scoreCard: {
        upperScores: [
          { name: "Ones", score: null, isScored: false, id: 1, calculate: this.checkUpperScores, scratched:false },
          { name: "Twos", score: null, isScored: false, id: 2, calculate: this.checkUpperScores, scratched:false },
          { name: "Threes", score: null, isScored: false, id: 3, calculate: this.checkUpperScores, scratched:false },
          { name: "Fours", score: null, isScored: false, id: 4, calculate: this.checkUpperScores, scratched:false },
          { name: "Fives", score: null, isScored: false, id: 5, calculate: this.checkUpperScores, scratched:false },
          { name: "Sixes", score: null, isScored: false, id: 6, calculate: this.checkUpperScores, scratched:false }
        ],
        upperTotals:[
          { name: "Bonus", score: null, id: 7, calculate: this.checkIfBonus },
          { name: "Total", score: null, id: 8, calculate: this.getUpperTotal },
        ],
        lowerScores: [
          { name: "3 of a kind", score: null, isScored: false, calculate: this.checkThreeOfAKind, scratched:false },
          { name: "4 of a kind", score: null, isScored: false, calculate: this.checkFourOfAKind, scratched:false },
          { name: "Full House", score: null, isScored: false, calculate: this.checkFullHouse, scratched:false },
          { name: "Small Straight", score: null, isScored: false, calculate: this.checkSmStraight, scratched:false },
          { name: "Large Straight", score: null, isScored: false, calculate: this.checkLgStraight, scratched:false },
          { name: "Yahtzee", score: null, isScored: false, calculate: this.checkYahtzee, scratched:false },
          { name: "Chance", score: null, isScored: false, calculate: this.checkChance, scratched:false }
        ],
        lowerTotals:[
          { name: "Total", score: null, id: 8, calculate: this.getLowerTotal },
        ],
      },
      dice: [],
      score: {},
      totalTurns: 0,
      totalScore: 0,
      gameOver: false
    };
  },
  mounted: function() {
    this.$root.$on("updateDice", dice => {
      this.dice = dice;
    });
  },
  methods: {
    checkUpperScores: function(number) {
      if (!this.dice || this.dice.length < 1) return 0;
      var total = 0;
      for (var i = 0; i < 5; i++) {
        if (this.dice[i].value === number) {
          total += number;
        }
      }
      return total;
    },
    selectScore: function(score, val) {
      if(score.isScored) return;
      if((val === 0 || val === null) && !score.isScored) {
        console.log("scratch");
        score.scratched = true;
        console.log(score);
      }
      score.score = val;
      score.isScored = true;
      score.calculate = function(){return val};
      this.totalTurns++;

      if(this.totalTurns === 13){
        this.endGame();
        return;
      }

      this.reset();
    },
    checkIfBonus: function() {
      var upperTotal = this.getUpperTotal();

      if(upperTotal >= 63){
        return 35;
      }
      return 0;
    },
    getUpperTotal: function() {
      var upperScores = this.scoreCard.upperScores;
      var total = 0;

      for (var i = 0; i < upperScores.length; i++) {
        total += upperScores[i].score;
      }

      return total;
    },
    getLowerTotal: function() {
      var lowerScores = this.scoreCard.lowerScores;
      var total = 0;

      for(var i = 0; i < lowerScores.length; i++){
        total += lowerScores[i].score;
      }
      return total
    },
    getValues: function(arr){
      var values = [] ;
      for(var i = 0; i < arr.length; i++){
        values.push(arr[i].value);
      }
      return values;
    },
    countValue: function(arr, index){
      if(arr.length === 0 ) return;
      var count = 0;
      for(var i = 0; i < arr.length; i++){
        var value = arr[i];
        if(value === index) count++;
      }
      return count;
    },
    addValues: function(arr){
      var total = 0;
      for(var i = 0; i < arr.length; i++){
        total += arr[i];
      }
      return total;
    },
    checkThreeOfAKind: function(){
      var self = this;
      var values = self.getValues(this.dice);
      for(var i = 1; i <= 6; i++){
        var total = self.countValue(values, i);
        if(total >= 3) return self.addValues(values);
      }
      return 0;
    },
    checkFourOfAKind: function(){
      var self = this;
      var values = self.getValues(this.dice);
      for(var i = 1; i <= 6; i++){
        var total = self.countValue(values, i);
        if(total >= 4) return self.addValues(values);
      }
      return 0;
    },
    checkFullHouse: function() {
      var self = this;
      var values = self.getValues(this.dice);
      var ordered = values.sort();
      var double = false;
      var triple = false;
      
      for(var i = 0; i <= 6; i++){
        var total = self.countValue(values, i);
        if(total == 2) double = true;
        if(total === 3) triple = true;
      }
      
      if(double && triple){
        return 25;
      }
      return 0;
    },
    checkStraight: function(values){
      var sorted = values.sort();
      var straight = [];
      var le = 1;
      for(var i = 0; i < sorted.length; i++){
        if(sorted[i + 1] - sorted[i] === 1){
          straight.push(sorted[i])
          le += 1;
        }
      }
      return le;
    },
    checkSmStraight: function(){
      var self = this;
      var values = self.getValues(self.dice);
      var straight = self.checkStraight(values);

      if(straight >= 4) return 30;

      return 0;
    },
    checkLgStraight: function(){
      var self = this;
      var values = self.getValues(self.dice);
      var straight = self.checkStraight(values);

      if(straight === 5) return 40;

      return 0;
    },
    checkChance: function(){
      var self = this;
      var values = self.getValues(self.dice);
      var total = self.addValues(values);

      return total;
    },
    checkYahtzee: function(){
      var self = this;
      var values = self.getValues(this.dice);
      for(var i = 1; i <= 6; i++){
        var total = self.countValue(values, i);
        if(total >= 5) return 50;
      }
      return 0;
    },
    reset: function(){
      this.$root.$emit('endTurn');
      for(var key in this.scoreCard){
        var sheet = this.scoreCard[key];
        this.resetScoreSheet(sheet);
      }
    },
    resetScoreSheet: function(sheet){
      sheet.forEach(score => {
        if(!score.isScored){
          score.score = null;
        }
      });
    },
    endGame: function(){
      var self = this;
      var total = self.getUpperTotal() + self.getLowerTotal();

      self.totalScore = total;
      self.gameOver = true;
      
      this.$root.$emit('endGame', self.totalScore);
    },
    newGame: function(){
      location.reload();
    }
  }
};
</script>
 
 <style lang="scss" scoped>
.score-card-container {
  width: 100%;
  margin: 0;
  padding: 0 10px;
}
.uppersection, .lowersection {
  width: 90%;
  text-align: left;
  height: 45px;
  line-height: 45px;
  padding: 0 5px;
  border-bottom: 1px solid #e0e0e0;
  overflow: hiddenf;
  &.bonus {
    background-color: #f0f0f0;
  }
  &.total {
    background-color: #dcdcdc;
  }
  .name {
    font-size: 105%;
  }
  .score {
    display: block;
    float: right;
    width: 50px;
    height: 30px;
    background-color: #fff;
    border: 1px solid #f0f0f0;
    margin: 7px 0;
    text-align: center;
    font-size:15px;
    &:hover:not(:disabled) {
      cursor: pointer;
      box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.2);
    }
    &.disabled, &:disabled {  
      background-color:rgba(0,0,0,0);
      border:0;
    }
  }
}
</style>
 