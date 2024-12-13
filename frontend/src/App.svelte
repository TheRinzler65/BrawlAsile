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

  let playerBrawlerTag = "";
  let playerBrawlers = null;
  let brawlerError = "";

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

  async function getPlayerBrawlers() {
    try {
      const response = await axios.get(
        `http://localhost:3000/brawlers/${playerBrawlerTag}`,
      );
      console.log("Liste des brawlers du joueur: ", response.data);
      playerBrawlers = response.data;
      brawlerError = null;
    } catch (error) {
      console.error(error);
      brawlerError =
        "Impossible de récupérer la liste des brawlers de ce joueur.";
      playerBrawlers = null;
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
      const response = await axios.get(
        `http://localhost:3000/battlelog/${tag}`,
      );
      console.log("Logs de bataille :", response.data);
      battleLog = response.data;
    } catch (err) {
      console.error("Erreur lors de la recherche des logs de bataille :", err);
      battleError = "Logs de bataille introuvables.";
    }
  }

  function formatBattleTime(battleTime) {
    return battleTime.replace(
      /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/,
      "$1-$2-$3T$4:$5:$6",
    );
  }

  function getIconUrl(iconId) {
    if (iconId) {
      return `https://cdn.brawlify.com/profile-icons/regular/${iconId}.png`;
    }
    return null;
  }

  function getIconBrawler(iconBrawlerId) {
    if (iconBrawlerId) {
      return `https://cdn.brawlify.com/brawlers/borders/${iconBrawlerId}.png`;
    }
    return null;
  }

  function getIconStarPower(iconStarPowerId) {
    if (iconStarPowerId) {
      return `https://cdn.brawlify.com/star-powers/borderless/${iconStarPowerId}.png`;
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
      heist: "Braquage",
      duels: "Duels",
      soulCollector: "Voleurs d'âmes",
      spiritWars: "Guerres des esprits",
    };
    return modeNames[mode] || mode;
  }

  function getMapDisplayName(map) {
    if (!map) {
      return "Carte inconnue";
    }

    const mapNames = {
      // Razzia De Gemmes
      Hard_Rock_Mine: "Mine hard-rock",
      Gem_Fort: "Fort de gemmes",
      Undermine: "Tunnel de mine",
      Double_Swoosh: "Bruissements",
      Minecart_Madness: "Berline folle",
      Acute_Angle: "Angle Aigu",
      Rustic_Arcade: "Arcade rustique",
      Open_Space: "Espace ouvert",
      Last_Stop: "Dernier arrêt",
      Sneaky_Sneak: "Furtivité furtive",
      Pineapple_Plaza: "Plaza ananas",
      Corkscrew: "Tire-bouchon",
      // Razzia De Gemmes 5c5
      Artic_extraction: "Extraction arctique",
      Snowman_forest: "Forêt bonhomme de neige",
      Cold_pond_quarry: "Carrière glacée",
      Snowflakes: "Flocons de neige",
      // Survivant Solo
      Skull_Creek: "Crique du crâne",
      Rockwall_Brawl: "Brawl n' roll",
      Feast_or_Famine: "Famine ou festin",
      Cavern_Churn: "Caverne bouillonnante",
      Double_Trouble: "Double danger",
      Stormy_Plains: "Plaines orageuses",
      Dark_Passage: "Passage sombre",
      Flying_Fantasies: "Rêves aériens",
      Safety_Center: "Centre de sécurité",
      Sunset_Vista: "Coucher de soleil",
      "Marksman's_Paradise": "Recoins d'élite",
      // Survivant Trio
      Burger_Bay: "Baie aux burgers",
      Thousand_Jellies: "Méduses par milliers",
      "Ring_'O_Brawlin": "Ring du brawl",
      Bullseye: "Dans le mille",
      Star_Fish: "Poisson Starr",
      Splashing_Rivers: "Rivières éclaboussantes",
      Squad_Out: "Sortie d'escouade",
      // Braquage
      Kaboom_Canyon: "Canyon boum-boum",
      Safe_Zone: "Zone sécurisée",
      Hot_Potato: "C'est chaud patate",
      Bridge_Too_Far: "Pont au loin",
      Secret_or_Mystery: "Secret ou mystère",
      Electric_Storm: "Tempête électrique",
      // Prime
      Snake_Prairie: "Prairie au serpents",
      Shooting_Star: "Etoile filante",
      Canal_Grande: "Grand canal",
      Excel: "Excellence",
      Layer_Cake: "Mille-feuilles",
      Dry_Season: "Saison sèche",
      // Brawl Ball
      Backyard_Bowl: "Ligue junior",
      Triple_Dribble: "Triple dribble",
      Sneaky_Fields: "Champs sournois",
      Super_Beach: "Super plage",
      Pinball_Dreams: "Flipper",
      Center_Stage: "Milieu de scène",
      Beach_Ball: "Ballon de plage",
      Sunny_Soccer: "Foot sous le soleil",
      Penalty_Kick: "Pénalité",
      Back_Pocket: "Coup pas franc",
      Weak_Foot: "Pied d'appui",
      Razzle_Dazzle: "Tout feu tout flamme",
      // Brawl Ball 5c5
      Freezing_ripples: "Ondulations glacées",
      Great_waves: "Grandes vagues",
      Cool_shapes: "Formes gelées",
      Suspenders: "Bretelles",
      // Voleurs d'Âmes
      Paperback_Pond: "Etang de papier",
      Foursquare_Fortress: "Forteresse au carré",
      Boiler_Room: "Salle chaude",
      Hoop_Boot_Hill: "Colline des épreuves",
      Kooky_Gates: "Portail mystérieux",
      Afterpiece_Arena: "Théâtre comique",
      // Guerres Des Esprits
      Divine_Descent: "Décente divine",
      Hellish_Harvest: "Moisson ténébreuse",
      Final_Frontier: "Frontière finale",
      Infernal_Invasion: "Invasion infernale",
      Celestial_Crusade: "Croisade céleste",
      Abyssal_Assault: "Assaut abyssal",
      Radiant_Rampage: "Fureur radieuse",
      Underworld_Uprising: "Révolte des abysses",
      // Zone Réservée
      Open_Business: "C'est ouvert",
      Parallel_Plays: "Stratégies parallèles",
      Ring_of_Fire: "Cercle de feu",
      Duelling_Beetles: "Duel de scarabées",
      Rush: "Ruée",
      From_Dusk_till_Dawn: "Aube et crépuscule",
      // Hors-jeu
      Goldarm_Gulch: "",
      "Belle's_Rock": "",
      Flaring_Phoenix: "",
      Out_in_the_Open: "",
      New_Horizons: "",
      Betweeb_the_Rivers: "",
      Four_Levels: "",
      Twilight_Passage: "",
      Hard_Lane: "",
      Island_Hopping: "",
      Sunset_Spar: "",
      Gratitude: "",
      // Hors-jeu 5c5
      Sizzling_Chambers: "",
      Crispy_Crypt: "",
      Shuffle_City: "",
      Riverbank_Crossing: "",
      // Duels
      Zen_Garden: "",
      Swimming_Skills: "",
      Tangled_Shrubs: "",
      Breaks: "",
      Pillars_of_Doom: "",
      Mantis_Claw: "",
      Line_of_Defense: "",
      Too_cool_for_Summer: "",
    };
    return mapNames[map.replace(/[-\s]/g, "_")] || map;
  }
</script>

<div class="container">
  <div class="search-form">
    <!-- Statistique joueur -->
    <h2>Information du joueur</h2>
    <input
      type="text"
      placeholder="Entrez le tag du joueur pour voir ses informations"
      bind:value={playerTag}
    />
    <button on:click={getPlayerDetails}>Afficher le joueur</button>
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
          <p>-</p>
        {/if}
        <div class="player-info">
          <div><strong>Nom :</strong> {playerData.name}</div>
          <div><strong>Niveau :</strong> {playerData.expLevel}</div>
          <div><strong>Nombre d'exp:</strong> {playerData.expPoints}</div>
          <div><strong>Trophées :</strong> {playerData.trophies}</div>
          <div>
            <strong>Record de trophées :</strong>
            {playerData.highestTrophies}
          </div>
          <div>
            <strong>Club :</strong>
            {playerData.club?.name || "Aucun club"}
          </div>
          <div>
            <strong>Tag du club :</strong>
            {playerData.club?.tag || "-"}
          </div>
        </div>
      </div>

      <!-- Logs de bataille -->
      {#if battleLog && Array.isArray(battleLog.items) && battleLog.items.length > 0}
        <div class="battle-log">
          <h2>Journal de combat</h2>
          <ul>
            {#each battleLog.items as battle}
              <li>
                <div>
                  <strong>Mode :</strong>
                  {getModeDisplayName(battle.battle?.mode)}
                </div>
                <div>
                  <strong>Carte :</strong>
                  {getMapDisplayName(battle.event?.map)}
                </div>
                <div>
                  <strong>Heure de bataille :</strong>
                  {#if battle.battleTime}
                    {new Date(
                      formatBattleTime(battle.battleTime),
                    ).toLocaleString()}
                  {:else}
                    <p>-</p>
                  {/if}
                </div>
                {#if battle.battle?.mode === "soloShowdown"}
                  <div>
                    <strong>Joueurs :</strong>
                    {#if battle.battle?.players && Array.isArray(battle.battle.players)}
                      <ul>
                        {#each battle.battle.players as player}
                          <li>
                            <strong>Nom :</strong>
                            {player.name || "Inconnu"}
                            <br /><strong>Brawler :</strong>
                            {player.brawler?.name || "-"}, {player.brawler
                              ?.power || "-"}
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
                {:else if battle.battle?.mode === "duoShowdown"}
                  <div>
                    <strong>Équipes :</strong>
                    <ul>
                      {#each battle.battle.teams as team}
                        <li>
                          <ul>
                            {#each team as player}
                              <li>{player.name} - {player.brawler.name}</li>
                            {/each}
                          </ul>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {:else if battle.battle?.mode === "brawlBall" || battle.battle?.mode === "knockout" || battle.battle?.mode === "gemGrab" || battle.battle?.mode === "heist"}
                  <div>
                    <strong>Durée :</strong>
                    {battle.battle?.duration || "-"}
                  </div>
                  <div>
                    <strong>Résultat :</strong>
                    {battle.battle?.result || "-"}
                  </div>
                  {#if battle.battle?.starPlayer}
                    <div>
                      <strong>Joueur star :</strong>
                      {battle.battle.starPlayer.name} - {battle.battle
                        .starPlayer.brawler.name}
                    </div>
                  {/if}
                  <div>
                    <strong>Équipes :</strong>
                    <ul>
                      {#each battle.battle.teams as team, index}
                        <li>
                          <strong>Équipe {index + 1} :</strong>
                          <ul>
                            {#each team as player}
                              <li>
                                {player.name} - {player.brawler.name}
                                (Trophées : {player.brawler.trophies} | Pouvoir : {player.brawler.power})
                              </li>
                            {/each}
                          </ul>
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
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
      <!-- Formulaire pour les Brawlers -->
      <h2>Recherche des Brawlers</h2>
      <input
        type="text"
        placeholder="Entrez le tag du joueur pour voir ses Brawlers"
        bind:value={playerBrawlerTag}
      />
      <button on:click={getPlayerBrawlers}>Rechercher Brawlers</button>
      {#if brawlerError}
        <div class="error">{brawlerError}</div>
      {:else if playerBrawlers}
        <div class="details">
          <h3>Brawlers de {playerBrawlers.playerName}</h3>
          <ul>
            {#each playerBrawlers.brawlers as brawler}
              <li class="information-brawler">
                {#if brawler.id}
                  <img
                    src={getIconBrawler(brawler.id)}
                    alt="Icône du brawler"
                    width="100"
                  />
                {:else}
                  <p>-</p>
                {/if}
                <div><strong>Nom :</strong> {brawler.name}</div>
                <div><strong>Pouvoir :</strong> {brawler.power}</div>
                <div><strong>Trophées :</strong> {brawler.trophies}</div>
                <div><strong>Palier :</strong> {brawler.rank}</div>
                <div>
                  <strong>Gadgets :</strong>
                  {#if brawler.gadgets && brawler.gadgets.length > 0}
                    <ul>
                      {#each brawler.gadgets as gadget}
                        <li>{gadget.name}</li>
                      {/each}
                    </ul>
                  {:else}
                    <p>-</p>
                  {/if}
                </div>
                <div>
                  <strong>Equipement :</strong>
                  {#if brawler.gears && brawler.gears.length > 0}
                    <ul>
                      {#each brawler.gears as gear}
                        <li>{gear.name}</li>
                      {/each}
                    </ul>
                  {:else}
                    <p>-</p>
                  {/if}
                </div>
                <div>
                  <strong>Pouvoir Stars :</strong>
                  {#if brawler.starPowers && brawler.starPowers.length > 0}
                    <ul>
                      {#each brawler.starPowers as starPower}
                        <li>{starPower.name}</li>
                      {/each}
                    </ul>
                  {:else}
                    <p>-</p>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>

    <!-- Information Club -->
    <div class="search-form">
      <h2>Information du club</h2>
      <input
        type="text"
        placeholder="Entrez le tag du club pour voir ses informations"
        bind:value={clubTag}
      />
      <button on:click={getClubDetails}>Rechercher club</button>
      {#if clubError}
        <div class="error">{clubError}</div>
      {:else if clubData}
        <div class="details">
          <div>{clubData.badgeID}</div>
          <div><strong>Nom du club :</strong> {clubData.name}</div>
          <div><strong>Description :</strong> {clubData.description}</div>
          <div><strong>Trophées :</strong> {clubData.trophies}</div>
          <div>
            <strong>Trophées requis:</strong>
            {clubData.requiredTrophies}
          </div>
          <div>
            <strong>Nombre de membres :</strong>
            {clubData.members.length}
          </div>
          <div>
            <strong>Président :</strong>
            {clubData.members.find((m) => m.role === "president")?.name ||
              "Non disponible"}
          </div>
          <div><strong>Membres :</strong></div>
          <ol>
            {#each clubData.members as member}
              <li style="color: {member.nameColor};">
                <strong>Nom :</strong>
                {member.name}<br />
                <strong>Tag :</strong>
                {member.tag}<br />
                <strong>Rôle :</strong>
                {member.role}<br />
                <strong>Trophées :</strong>
                {member.trophies}<br />
              </li>
            {/each}
          </ol>
        </div>
      {/if}
    </div>
</div>