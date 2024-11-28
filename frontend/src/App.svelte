<script>
  import axios from "axios";

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
      console.log(response.data);
      battleLog = response.data;
      battleError = "";
    })
    .catch((err) => {
      console.error(err);
      battleError = "Logs de bataille introuvables.";
      battleLog = null;
    });
}

  function formatBattleTime(battleTime) {
    return battleTime.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6');
  }

  function getIconUrl(iconId) {
    if (iconId) {
      return `https://cdn.brawlify.com/profile-icons/regular/${iconId}.png`;
    }
    return null;
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
        {#if playerData.icon?.id}
          <img
            src={getIconUrl(playerData.icon.id)}
            alt="Icône du joueur"
            width="100"
          />
        {:else}
          <p>Aucune icône disponible</p>
        {/if}
        <h3>Nom : {playerData.name}</h3>
        <p>Trophées : {playerData.trophies}</p>
        <p>Record de trophées : {playerData.highestTrophies}</p>
        <p>Club : {playerData.club?.name || "Aucun club"}</p>
        <p>Tag du club : {playerData.club?.tag || "Aucun tag de club"}</p>
      </div>
    {/if}
  </div>

  <!-- Affichage des logs de bataille -->
<div class="form">
  {#if battleLog && Array.isArray(battleLog.items) && battleLog.items.length > 0}
    <div class="details">
      <h2>Logs de Bataille</h2>
      <ul>
        {#each battleLog.items as battle}
          <li>
            <strong>Mode :</strong> {battle.event?.mode || "Non disponible"}<br>
            <strong>Carte :</strong> {battle.event?.map || "Non disponible"}<br>
            <strong>Heure de bataille :</strong> 
            {#if battle.battleTime}
              {new Date(formatBattleTime(battle.battleTime)).toLocaleString()}
            {:else}
              Non disponible
            {/if}<br>
            <strong>Classement :</strong> {battle.battle?.rank || "N/A"}<br>
            <strong>Trophées gagnés :</strong> {battle.battle?.trophyChange || 0}<br>
            <strong>Joueurs :</strong>
            {#if battle.battle?.players && Array.isArray(battle.battle.players) && battle.battle.players.length > 0}
              <ul>
                {#each battle.battle.players as player}
                  <li>{player.name || "Inconnu"} - {player.tag || "Non disponible"}</li>
                {/each}
              </ul>
            {:else}
            <span>Aucun joueur disponible.</span>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  {:else if battleLog && Array.isArray(battleLog.items) && battleLog.items.length === 0}
    <div class="error">Aucun log de bataille disponible pour ce joueur.</div>
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
    background-color: #121212;
    color: #e0e0e0;
  }

  .form {
    padding: 16px;
    font-family: Arial, sans-serif;
    background-color: #1c1c1c;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  }

  .form input {
    margin-right: 10px;
    padding: 8px;
    background-color: #333;
    border: 1px solid #444;
    color: #fff;
    border-radius: 4px;
  }

  .form button {
    padding: 8px 12px;
    cursor: pointer;
    background-color: #6200ea;
    color: #fff;
    border: none;
    border-radius: 4px;
  }

  .error {
    color: #ff3b30;
    font-weight: bold;
    background-color: #d32f2f;
    padding: 8px;
    border-radius: 4px;
  }

  .details {
    margin-top: 10px;
    padding: 10px;
    border: 1px solid #444;
    background-color: #2c2c2c;
    border-radius: 4px;
  }
  
  .details ul {
    list-style: none;
    padding: 0;
  }

  .details li {
    margin-top: 20px;
    margin-bottom: 16px;
    padding: 12px;
    border: 1px solid #444;
    border-radius: 4px;
    background: #3a3a3a;
    color: #e0e0e0;
  }

  .form input:hover, .form button:hover {
    background-color: #3700b3;
  }

  .form input:focus, .form button:focus {
    outline: 2px solid #bb86fc;
  }
</style>