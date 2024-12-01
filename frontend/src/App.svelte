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

  function resetState(type) {
    if (type === "player") {
      clubData = null;
      clubError = "";
    } else if (type === "club") {
      playerData = null;
      playerError = "";
    }
    battleLog = null;
    battleError = "";
  }

  async function getPlayerDetails() {
    resetState("player");
    try {
      const response = await axios.get(`http://localhost:3000/${playerTag}`);
      console.log("Données du joueur :", response.data);
      playerData = response.data;
      getBattleLog(playerTag);
    } catch (err) {
      console.error("Erreur lors de la recherche du joueur :", err);
      playerError = "Joueur introuvable.";
    }
  }

  async function getClubDetails() {
    resetState("club");
    try {
      const response = await axios.get(`http://localhost:3000/club/${clubTag}`);
      console.log("Données du club :", response.data);
      clubData = response.data;
    } catch (err) {
      console.error("Erreur lors de la recherche du club :", err);
      clubError = "Club introuvable.";
    }
  }

  async function getBattleLog(tag) {
    try {
      const response = await axios.get(`http://localhost:3000/battlelog/${tag}`);
      console.log("Logs de bataille :", response.data);
      battleLog = response.data;
    } catch (err) {
      console.error("Erreur lors de la recherche des logs de bataille :", err);
      battleError = "Logs de bataille introuvables.";
    }
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

  function getModeDisplayName(mode) {
    const modeNames = {
      soloShowdown: "Survivant Solo",
      duoShowdown: "Survivant Duo",
      trioShowdown: "Survivant Trio",
      brawlBall: "Brawl Ball",
      gemGrab: "Razzia De Gemmes",
      hotzone: "Zone Réservée",
      knockout: "Hors-jeu",
      heist : "Braquage",
      duels : "Duels",
      soulCollector: "Voleurs d'âmes",
      spiritWars: "Guerres des esprits",
    };
    return modeNames[mode] || mode;
  }

  function getMapDisplayName(map) {
    const mapNames = {
      // Razzia De Gemmes
      "Sneaky_Fields": "",
      // Braquage
      // Prime
      // Brawl Ball
      // Survivant Solo
      // Survivant Duo
      // Guerres Des Esprits
      // Zone Réservée
    };
    return mapNames[map.replace(/[-\s]/g, "_")] || map;
  }
</script>

<div class="container">
  <div class="search-form">
    <!-- Statistique joueur -->
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

      <!-- Logs de bataille -->
      {#if battleLog && Array.isArray(battleLog.items) && battleLog.items.length > 0}
        <div class="battle-log">
          <h2>Logs de Bataille</h2>
          <ul>
            {#each battleLog.items as battle}
              <li>
                <div><strong>Mode :</strong> {getModeDisplayName(battle.battle?.mode)}</div>
                <div><strong>Carte :</strong> {getMapDisplayName(battle.event?.map) || "Non disponible"}</div>
                <div><strong>Heure de bataille :</strong>
                  {#if battle.battleTime}
                    {new Date(formatBattleTime(battle.battleTime)).toLocaleString()}
                  {:else}
                    Non disponible
                  {/if}
                </div>
                <div><strong>Classement :</strong> {battle.battle?.rank || "N/A"}</div>
                <div><strong>Trophées gagnés :</strong> {battle.battle?.trophyChange || "N/A"}</div>
                <div><strong>Joueurs :</strong>
                  {#if battle.battle?.players && Array.isArray(battle.battle.players)}
                    <ul>
                      {#each battle.battle.players as player}
                        <li>
                          <strong>Nom :</strong> {player.name || "Inconnu"} 
                          <br /><strong>Brawler :</strong> {player.brawler?.name || "Non disponible"}, {player.brawler?.power || "Non disponible"}
                          {#if player.starPlayer}
                            <br /><span class="star-player">Joueur star</span>
                          {/if}
                        </li>
                      {/each}
                    </ul>
                  {:else}
                    <div>Aucun joueur disponible.</div>
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


    <!-- Information Club -->
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
          <div>{clubData.badgeID}</div>
          <div><strong>Nom du club :</strong> {clubData.name}</div><br>
          <div><strong>Description :</strong> {clubData.description}</div><br>
          <div><strong>Trophées :</strong> {clubData.trophies}</div><br>
          <div><strong>Trophées requis:</strong> {clubData.requiredTrophies}</div><br>
          <div><strong>Nombre de membres :</strong> {clubData.members.length}</div><br>
          <div><strong>Président :</strong> {clubData.members.find(m => m.role === "president")?.name || "-"}</div><br>
          <div><strong>Membres :</strong></div>
          <ul>
            {#each clubData.members as member}
              <li style="color: {member.nameColor};">
                <strong>Nom :</strong> {member.name}<br>
                <strong>Tag :</strong> {member.tag}<br>
                <strong>Rôle :</strong> {member.role}<br>
                <strong>Trophées :</strong> {member.trophies}<br>
              </li><br>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </div>
</div>