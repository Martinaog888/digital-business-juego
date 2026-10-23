/* Motor de reglas, independiente del navegador y sin jugadores automáticos. */
(function (root) {
  "use strict";
  class ChairGame {
    constructor(count = 4) { this.reset(count); }
    reset(count) {
      if (![2, 3, 4].includes(count)) throw new RangeError("Se necesitan 2, 3 o 4 personas.");
      this.players = Array.from({length:count}, (_, id) => ({id, active:true, seats:0, eliminatedRound:null}));
      this.round = 0; this.phase = "ready"; this.claims = []; this.held = new Set(); this.winner = null;
    }
    get active() { return this.players.filter(p => p.active); }
    get chairs() { return Math.max(0, this.active.length - 1); }
    startRound() {
      if (!["ready","result","paused"].includes(this.phase)) return false;
      if (this.phase !== "paused") this.round++;
      this.claims = []; this.phase = "music"; return true;
    }
    stopMusic() { if (this.phase !== "music") return false; this.phase = "claim"; return true; }
    release(id) { this.held.delete(id); }
    press(id, repeat = false) {
      if (repeat || this.held.has(id)) return {type:"ignored"};
      this.held.add(id);
      const player = this.players[id];
      if (!player || !player.active) return {type:"ignored"};
      if (this.phase === "music") return {type:"early"};
      if (this.phase !== "claim" || this.claims.includes(id)) return {type:"ignored"};
      this.claims.push(id);
      if (this.claims.length < this.chairs) return {type:"seat",id};
      this.claims.forEach(i => this.players[i].seats++);
      const loser = this.active.find(p => !this.claims.includes(p.id));
      loser.active = false; loser.eliminatedRound = this.round;
      if (this.active.length === 1) { this.phase = "finished"; this.winner = this.active[0].id; }
      else this.phase = "result";
      return {type:"elimination",id,loser:loser.id,winner:this.winner};
    }
    pause() {
      if (!["music","claim"].includes(this.phase)) return false;
      this.phase = "paused"; this.claims = []; this.held.clear(); return true;
    }
  }
  if (typeof module !== "undefined" && module.exports) module.exports = ChairGame;
  else root.ChairGame = ChairGame;
})(typeof globalThis !== "undefined" ? globalThis : this);
