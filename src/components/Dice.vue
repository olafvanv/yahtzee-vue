<template>
  <div class="dice-container">
    <h1>Dice</h1>
    <div class="dice">
      <div class="die" :class="{ 'locked': die.locked }" v-for="(die, index) in dice" :key="die.id">
        <img :src="require('../assets/img/' + die.value + '.png')" @click="lock(index)" />
        <button type="button" v-on:click="lock(index)">
          <span v-if="isLocked(index)">Locked</span>
          <span v-if="!isLocked(index)">Lock</span>
        </button>
      </div>
    </div>
    <div class="buttons">
      <md-button class="md-raised md-primary" v-on:click="roll()">Roll</md-button>
      <md-button v-on:click="reset()">Reset</md-button>
    </div>
  </div>
</template>

<script>
import { _ } from "vue-underscore";

export default {
  name: "Dice",
  data: function() {
    return {
      availableRolls: 3,
      dice: [
        { id: 0, value: 1, locked: false },
        { id: 1, value: 1, locked: false },
        { id: 2, value: 1, locked: false },
        { id: 3, value: 1, locked: false },
        { id: 4, value: 1, locked: false }
      ],
      lockedDice: [],
      totalScore: 0
    };
  },
  mounted: function() {
    this.$root.$on("endTurn", () => {
      this.reset();
    });
  },
  methods: {
    roll: function() {
      if (this.availableRolls > 0) {
        this.totalScore = 0;
        for (var i = 0; i < 5; i++) {
          var id = _.indexOf(this.lockedDice, i);

          if (id === -1) {
            var randomNo = Math.floor(Math.random() * 6) + 1;
            this.dice[i].value = randomNo;
          }
        }

        this.$root.$emit("updateDice", this.dice);
        this.availableRolls--;
      } else {
        return false;
      }
    },
    lock: function(index) {
      var id = _.indexOf(this.lockedDice, index);
      if (id === -1) {
        this.lockedDice.push(index);
        this.dice[index].locked = true;
      } else {
        this.lockedDice.splice(id, 1);
        this.dice[index].locked = false;
      }
    },
    isLocked: function(index) {
      return _.indexOf(this.lockedDice, index) !== -1 ? true : false;
    },
    reset: function() {
      this.totalScore = 0;
      this.availableRolls = 3;
      this.lockedDice = [];
      for (var i = 0; i < 5; i++) {
        this.dice[i].value = 0;
        this.dice[i].locked = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.dice {
  display: inline-block;
  margin: 20px auto;
  overflow: auto;
  text-align:center;

  .die {
    width:20%;
    max-width: 120px;
    padding: 0 10px;
    float: left;
    transition-duration: .3s;
    img{
      &:hover{
        cursor:pointer;
      }
      &:active{
        transform:scale(.90);
      }
    }
    img {
      width: 100%;
      margin: 10px 0;
    }
    &.locked {
      background-color: #c5cfe7;
    }
  }
}
</style>
