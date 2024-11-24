<script>
  import axios from "axios";
  import { onMount } from "svelte";

  // Données pour joueur
  let playerTag = "";
  let playerData = null;
  let playerError = "";

  // Données pour club
  let clubTag = "";
  let clubData = null;
  let clubError = "";

  // Données pour battle log
  let battleLog = null;
  let battleError = "";

  function getPlayerDetails() {
    axios
      .get(`http://localhost:3000/${playerTag}`)
      .then((response) => {
        playerData = response.data;
        playerError = "";
        getBattleLog(playerTag);
      })
      .catch((err) => {
        playerError = "Joueur introuvable.";
        playerData = null;
      });
  }

  function getClubDetails() {
    axios
      .get(`http://localhost:3000/club/${clubTag}`)
      .then((response) => {
        clubData = response.data;
        clubError = "";
      })
      .catch((err) => {
        clubError = "Club introuvable.";
        clubData = null;
      });
  }

  function getBattleLog(playerTag) {
    axios
      .get(`http://localhost:3000/battlelog/${playerTag}`)
      .then((response) => {
        battleLog = response.data;
        battleError = "";
      })
      .catch((err) => {
        battleError = "Logs de bataille introuvables.";
        battleLog = null;
      });
  }

  function formatBattleTime(battleTime) {
    return battleTime.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6');
  }
</script>

<div class="container">

  <!-- Formulaire pour rechercher un joueur -->
  <div class="form">
    <input
      type="text"
      placeholder="Entrez le tag du joueur"
      bind:value={playerTag}
    />
    <button on:click={getPlayerDetails}>Rechercher joueur</button>
    {#if playerError}
      <div class="error">{playerError}</div>
    {:else if playerData}
      <div class="details">
        <h3>Nom : {playerData.name}</h3>
        <p>Icône ID : {playerData.icon?.id}</p>
        <p>Trophées : {playerData.trophies}</p>
        <p>Record de trophées : {playerData.highestTrophies}</p>
        <p>Club : {playerData.club?.name || "Aucun club"}</p>
        <p>Tag du club : {playerData.club?.tag || "Aucun tag de club"}</p>
        <p>Victoires en 3c3 : {playerData["3vs3Victories"]}</p>
        <p>Victoires en Solo : {playerData.soloVictories}</p>
        <p>Victoires en Duo : {playerData.duoVictories}</p>
      </div>
    {/if}
  </div>

  <!-- Affichage des logs de bataille -->
  <div class="form">
    {#if battleLog}
      <div class="details">
        <h2>Logs de Bataille</h2>
        <ul>
          {#each battleLog.items as battle, index}
            <li>
              <strong>Mode :</strong> {battle.event.mode} <br><br>
              <strong>Carte :</strong> {battle.event.map} <br><br>
              <strong>Heure de bataille :</strong> {new Date(formatBattleTime(battle.battleTime)).toLocaleString()} <br><br>
              <strong>Classement :</strong> {battle.battle.rank} <br><br>
              <strong>Trophées gagnés :</strong> {battle.battle.trophyChange} <br><br>
              <strong>Joueurs :</strong><br><br>
              <ul>
                {#each battle.battle.players as player}
                  <li>{player.name} - {player.tag}</li> <br><br>
                {/each}
              </ul>
            </li>
          {/each}
        </ul>
      </div>
    {:else if battleError}
      <div class="error">{battleError}</div>
    {/if}
  </div>

  <!-- Formulaire pour rechercher un club -->
  <div class="form">
    <input
      type="text"
      placeholder="Entrez le tag du club"
      bind:value={clubTag}
    />
    <button on:click={getClubDetails}>Rechercher club</button>
    {#if clubError}
      <div class="error">{clubError}</div>
    {:else if clubData}
      <div class="details">
        <h3>Nom du club : {clubData.name}</h3>
        <p>Membres : {clubData.members.length}</p>
        <p>Président : {clubData.members.find(m => m.role === "President")?.name || "-"}</p>
      </div>
    {/if}
  </div>

  <!-- <div class="form">
    <input
      type="text"
      placeholder="Entrez le tag du joueur"
      bind:value={}
    />
    <button on:click={}>Voir les Brawlers</button>
  </div> -->
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .form {
    margin-bottom: 20px;
  }

  .form input {
    margin-right: 10px;
    padding: 8px;
  }

  .form button {
    padding: 8px 12px;
    cursor: pointer;
  }

  .error {
    color: red;
    margin-top: 10px;
  }

  .details {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #ccc;
  }
</style>
