<script>
  import axios from "axios";

  let playerTag = "";
  let playerData = null;
  let playerError = "";

  let clubTag = "";
  let clubData = null;
  let clubError = "";

  let battleLog = null;
  let battleError = "";

  function getPlayerDetails() {
    clubData = null;
    clubError = "";
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
    playerData = null;
    playerError = "";
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

  function getIconUrl(iconId) {
    if (iconId) {
      return `https://cdn.brawlify.com/profile-icons/regular/${iconId}.png`;
    }
    return null;
  }
</script>

<div class="container">
  <!-- Recherche joueur et club côte à côte -->
  <div class="search-container">
    <div class="search-form">
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
          <div class="player-info">
            <div><strong>Nom :</strong> {playerData.name}</div>
            <div><strong>Trophées :</strong> {playerData.trophies}</div>
            <div><strong>Record de trophées :</strong> {playerData.highestTrophies}</div>
            <div><strong>Club :</strong> {playerData.club?.name || "Aucun club"}</div>
            <div><strong>Tag du club :</strong> {playerData.club?.tag || "Aucun tag de club"}</div>
          </div>
        </div>
        {#if battleLog && Array.isArray(battleLog.items) && battleLog.items.length > 0}
          <div class="battle-log">
            <h2>Logs de Bataille</h2>
            <ul>
              {#each battleLog.items as battle}
                <li>
                  <div><strong>Mode :</strong> {battle.event?.mode || "Non disponible"}</div>
                  <div><strong>Carte :</strong> {battle.event?.map || "Non disponible"}</div>
                  <div><strong>Heure de bataille :</strong> 
                    {#if battle.battleTime}
                      {new Date(formatBattleTime(battle.battleTime)).toLocaleString()}
                    {:else}
                      <p>Non disponible</p>
                    {/if}</div>
                  <div><strong>Classement :</strong> {battle.battle?.rank || "N/A"}</div>
                  <div><strong>Trophées gagnés :</strong> {battle.battle?.trophyChange || 0}</div>
                  <div><strong>Joueurs :</strong>
                    {#if battle.battle?.players && Array.isArray(battle.battle.players) && battle.battle.players.length > 0}
                      <ul>
                        {#each battle.battle.players as player}
                          <li>{player.name || "Inconnu"} - {player.tag || "Non disponible"}</li>
                        {/each}
                      </ul>
                    {:else}
                      <span>Aucun joueur disponible.</span>
                    {/if}
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        {:else if battleError}
          <div class="error">{battleError}</div>
        {/if}
      {/if}
    </div>

    <div class="search-form">
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
          <div><strong>Nom du club :</strong> {clubData.name}</div>
          <div><strong>Membres :</strong> {clubData.members.length}</div>
          <div><strong>Président :</strong> {clubData.members.find(m => m.role === "President")?.name || "-"}</div>
        </div>
      {/if}
    </div>
  </div>
</div>