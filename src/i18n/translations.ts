export type Language = 'en' | 'fr' | 'es' | 'de' | 'pt' | 'zh' | 'ja' | 'ar';

export interface Translations {
  // Home
  home_title: string;
  home_subtitle: string;
  play_now: string;
  ranking: string;
  stats: string;
  profile: string;
  games_short: string;
  best_short: string;
  accuracy_short: string;

  // Name Entry
  enter_name: string;
  enter_name_desc: string;
  name_placeholder: string;
  continue: string;
  back: string;

  // Mode Select
  choose_mode: string;
  mode_desc: string;
  back_to_modes: string;
  select_difficulty: string;
  diff_desc: string;
  easy: string;
  medium: string;
  hard: string;
  expert: string;
  unlock_at_level: string;

  // Modes
  classic_mode: string;
  classic_desc: string;
  survival_mode: string;
  survival_desc: string;
  chrono_mode: string;
  chrono_desc: string;
  map_mode: string;
  map_desc: string;

  // Game Screen
  which_flag: string;
  which_capital: string;
  guess_clue: string;
  which_shape: string;
  streak: string;
  next_question: string;
  see_results: string;
  correct: string;
  wrong: string;
  times_up: string;
  excellent: string;
  incorrect: string;
  answer: string;
  combo_text: string;

  // Game Over
  game_over: string;
  final_score: string;
  accuracy: string;
  best_combo: string;
  correct_answers: string;
  play_again: string;
  go_home: string;
  share_score: string;
  legendary: string;
  excellent_grade: string;
  great: string;
  good: string;
  keep_trying: string;
  new_best_score: string;
  xp_gained: string;

  // Leaderboard
  leaderboard: string;
  leaderboard_desc: string;
  your_best: string;
  no_scores: string;
  play_to_appear: string;
  you_badge: string;

  // Stats
  statistics: string;
  stats_desc: string;
  games_played: string;
  avg_score: string;
  total_score: string;
  total_xp: string;
  total_correct: string;
  games_by_mode: string;

  // Chat
  chat_title: string;
  chat_subtitle: string;
  chat_help: string;
  chat_topics_title: string;
  how_to_play: string;
  how_to_play_desc: string;
  country_hints: string;
  country_hints_desc: string;
  progress_tips: string;
  progress_tips_desc: string;
  other_questions: string;
  back_to_game: string;
  powered_by: string;

  // Chat responses
  how_to_play_response: string;
  country_hints_response: string;
  progress_tips_response: string;

  // Share
  share_title: string;
  share_desc: string;
  share_tiktok: string;
  share_whatsapp: string;
  share_discord: string;
  share_copy: string;
  share_copy_fallback: string;
  share_twitter: string;
  share_facebook: string;
  share_telegram: string;
  share_native: string;
  share_success: string;
  close: string;
  share_score_text: string;
  copied_clipboard: string;
  join_discord_title: string;
  join_discord_subtitle: string;
  join_discord_button: string;
  copy_discord_link: string;
  discord_help: string;
  share_copied: string;

  // Language selector
  select_language: string;
  language_hint: string;

  // Profile
  my_profile: string;
  profile_desc: string;
  member_since: string;
  level_title: string;
  progress: string;
  unlocked_difficulties: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    home_title: 'GUESS THE',
    home_subtitle: 'Ultimate Geography Challenge',
    play_now: 'PLAY NOW',
    ranking: 'Ranking',
    stats: 'Stats',
    profile: 'Profile',
    games_short: 'Games',
    best_short: 'Best',
    accuracy_short: 'Accuracy',

    enter_name: 'Enter Your Name',
    enter_name_desc: 'Choose your player identity',
    name_placeholder: 'Your name...',
    continue: 'Continue',
    back: 'Back',

    choose_mode: 'Choose Game Mode',
    mode_desc: 'Each mode offers a unique challenge',
    back_to_modes: 'Back to modes',
    select_difficulty: 'Select Difficulty',
    diff_desc: 'Higher difficulty = more XP & points!',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    expert: 'Expert',
    unlock_at_level: 'Unlock at level',

    classic_mode: 'Classic',
    classic_desc: '15 questions with progressive difficulty',
    survival_mode: 'Survival',
    survival_desc: 'One life. How far can you go?',
    chrono_mode: 'Chrono',
    chrono_desc: '30 seconds. Answer as many as you can!',
    map_mode: 'Map',
    map_desc: 'Guess the country from its shape',

    which_flag: 'Which country has this flag?',
    which_capital: 'Which country has this capital?',
    guess_clue: 'Guess from this clue',
    which_shape: 'Which country has this shape?',
    streak: 'streak!',
    next_question: 'Next Question →',
    see_results: 'See Results',
    correct: 'Correct!',
    wrong: 'Wrong!',
    times_up: "Time's Up!",
    excellent: 'EXCELLENT!',
    incorrect: 'INCORRECT',
    answer: 'Answer',
    combo_text: 'COMBO',

    game_over: 'GAME OVER',
    final_score: 'Final Score',
    accuracy: 'Accuracy',
    best_combo: 'Best Combo',
    correct_answers: 'Correct',
    play_again: 'Play Again',
    go_home: 'Home',
    share_score: 'Share my score',
    legendary: 'LEGENDARY',
    excellent_grade: 'EXCELLENT',
    great: 'GREAT',
    good: 'GOOD',
    keep_trying: 'KEEP TRYING',
    new_best_score: 'NEW BEST SCORE!',
    xp_gained: 'XP Gained',

    leaderboard: 'Leaderboard',
    leaderboard_desc: 'Top players ranking',
    your_best: 'Your Best Score',
    no_scores: 'No scores yet!',
    play_to_appear: 'Play a game to appear here',
    you_badge: '(you)',

    statistics: 'Statistics',
    stats_desc: 'Your gameplay overview',
    games_played: 'Games Played',
    avg_score: 'Avg Score',
    total_score: 'Total Score',
    total_xp: 'Total XP',
    total_correct: 'Correct Answers',
    games_by_mode: 'Games by Mode',

    chat_title: 'GeoBot',
    chat_subtitle: 'Your geography AI assistant',
    chat_help: 'Need help? Ask me!',
    chat_topics_title: 'How can I help you today?',
    how_to_play: 'How to play?',
    how_to_play_desc: 'Learn the basics of the game',
    country_hints: 'Country hints',
    country_hints_desc: 'Tips to recognize difficult countries',
    progress_tips: 'Tips to progress',
    progress_tips_desc: 'How to improve your score quickly',
    other_questions: '← Other questions',
    back_to_game: 'Back to game',
    powered_by: '💡 Powered by clever geography knowledge',

    how_to_play_response: 'Choose a mode from the home screen. Answer questions before the timer runs out. Fast correct answers give you more points and combos!',
    country_hints_response: '• Look at the map shape in Map mode\n• African flags often have pan-African colors\n• Eastern European countries often have crosses or eagles\n• Australia looks like a lying kangaroo',
    progress_tips_response: '• Always aim for the combo! Each successive correct answer multiplies your points\n• Start with Classic mode on Easy to level up quickly\n• Learn the capitals of medium countries\n• Survival mode gives the most XP',

    share_title: 'Share your score',
    share_desc: 'Let your friends know you scored',
    share_tiktok: 'Share on TikTok',
    share_whatsapp: 'Share on WhatsApp',
    share_discord: 'Share on Discord',
    share_copy: 'Copy text to clipboard',
    share_copy_fallback: 'Text copied! Paste it manually:',
    share_twitter: 'Share on X (Twitter)',
    share_facebook: 'Share on Facebook',
    share_telegram: 'Share on Telegram',
    share_native: 'More options...',
    share_success: 'Score copied! Share it now 🎉',
    close: 'Close',
    share_score_text: "🌍 I just scored {score} points in Guess The Country! {correct}/{total} correct. Can you beat me? {record}",
    copied_clipboard: '✅ Score copied to clipboard!',
    join_discord_title: 'Join the Community & Share Your Score',
    join_discord_subtitle: 'Challenge other players and enter the official leaderboard 🔥',
    join_discord_button: '🏆 Join Discord Community',
    copy_discord_link: '📋 Copy Discord link',
    discord_help: "If the button doesn't work, copy this link:",
    share_copied: 'Link copied!',

    select_language: 'Select Language',
    member_since: 'Member since',
    level_title: 'Level',
    my_profile: 'My Profile',
    profile_desc: 'Your player information',
    language_hint: 'Choose your preferred language',
    progress: 'Progress',
    unlocked_difficulties: 'Unlocked Difficulties',
  },

  fr: {
    home_title: 'DEVINE LE',
    home_subtitle: 'Le défi géographique ultime',
    play_now: 'JOUER',
    ranking: 'Classement',
    stats: 'Statistiques',
    profile: 'Profil',
    games_short: 'Parties',
    best_short: 'Meilleur',
    accuracy_short: 'Précision',

    enter_name: 'Entre ton nom',
    enter_name_desc: 'Choisis ton identité de joueur',
    name_placeholder: 'Ton nom...',
    continue: 'Continuer',
    back: 'Retour',

    choose_mode: 'Choisis ton mode de jeu',
    mode_desc: 'Chaque mode offre un défi unique',
    back_to_modes: 'Retour aux modes',
    select_difficulty: 'Choisis la difficulté',
    diff_desc: 'Plus difficile = plus de XP et de points !',
    easy: 'Facile',
    medium: 'Moyen',
    hard: 'Difficile',
    expert: 'Expert',
    unlock_at_level: 'Débloquer au niveau',

    classic_mode: 'Classique',
    classic_desc: '15 questions avec difficulté progressive',
    survival_mode: 'Survie',
    survival_desc: 'Une seule vie. Jusqu\'où iras-tu ?',
    chrono_mode: 'Chrono',
    chrono_desc: '30 secondes. Réponds un max !',
    map_mode: 'Carte',
    map_desc: 'Devine le pays à partir de sa forme',

    which_flag: 'Quel pays a ce drapeau ?',
    which_capital: 'Quel pays a cette capitale ?',
    guess_clue: 'Devine avec cet indice',
    which_shape: 'Quel pays a cette forme ?',
    streak: 'série !',
    next_question: 'Question suivante →',
    see_results: 'Voir les résultats',
    correct: 'Correct !',
    wrong: 'Faux !',
    times_up: 'Temps écoulé !',
    excellent: 'EXCELLENT !',
    incorrect: 'INCORRECT',
    answer: 'Réponse',
    combo_text: 'COMBO',

    game_over: 'FIN DE PARTIE',
    final_score: 'Score Final',
    accuracy: 'Précision',
    best_combo: 'Meilleur Combo',
    correct_answers: 'Correct',
    play_again: 'Rejouer',
    go_home: 'Accueil',
    share_score: 'Partager mon score',
    legendary: 'LÉGENDAIRE',
    excellent_grade: 'EXCELLENT',
    great: 'GÉNIAL',
    good: 'BIEN',
    keep_trying: 'CONTINUE',
    new_best_score: 'NOUVEAU MEILLEUR SCORE !',
    xp_gained: 'XP gagnés',

    leaderboard: 'Classement',
    leaderboard_desc: 'Classement des meilleurs joueurs',
    your_best: 'Ton meilleur score',
    no_scores: 'Pas encore de scores !',
    play_to_appear: 'Joue une partie pour apparaître ici',
    you_badge: '(toi)',

    statistics: 'Statistiques',
    stats_desc: 'Vue d\'ensemble de tes parties',
    games_played: 'Parties jouées',
    avg_score: 'Score moyen',
    total_score: 'Score total',
    total_xp: 'XP total',
    total_correct: 'Réponses correctes',
    games_by_mode: 'Parties par mode',

    chat_title: 'GeoBot',
    chat_subtitle: 'Ton assistant géographie IA',
    chat_help: 'Besoin d\'aide ? Demande-moi !',
    chat_topics_title: 'Comment puis-je t\'aider ?',
    how_to_play: 'Comment jouer ?',
    how_to_play_desc: 'Apprends les bases du jeu',
    country_hints: 'Indices sur les pays',
    country_hints_desc: 'Astuces pour reconnaître les pays difficiles',
    progress_tips: 'Conseils pour progresser',
    progress_tips_desc: 'Comment améliorer ton score rapidement',
    other_questions: '← Autres questions',
    back_to_game: 'Retour au jeu',
    powered_by: '💡 Propulsé par la connaissance géographique',

    how_to_play_response: 'Choisis un mode depuis l\'écran d\'accueil. Réponds aux questions avant la fin du chrono. Les bonnes réponses rapides te donnent plus de points et de combos !',
    country_hints_response: '• Regarde la forme de la carte en mode Carte\n• Les drapeaux africains ont souvent des couleurs pan-africaines\n• Les pays d\'Europe de l\'Est ont souvent des croix ou des aigles\n• L\'Australie ressemble à un kangourou couché',
    progress_tips_response: '• Vise toujours le combo ! Chaque bonne réponse successive multiplie tes points\n• Commence par le mode Classique en Facile pour monter de niveau rapidement\n• Apprends les capitales des pays moyens\n• Le mode Survie donne le plus d\'XP',

    share_title: 'Partage ton score',
    share_desc: 'Montre à tes amis que tu as marqué',
    share_tiktok: 'Partager sur TikTok',
    share_whatsapp: 'Partager sur WhatsApp',
    share_discord: 'Partager sur Discord',
    share_copy: 'Copier le texte',
    share_copy_fallback: 'Texte copié ! Collez-le manuellement :',
    share_twitter: 'Partager sur X (Twitter)',
    share_facebook: 'Partager sur Facebook',
    share_telegram: 'Partager sur Telegram',
    share_native: 'Plus d\'options...',
    share_success: 'Score copié ! Partage-le 🎉',
    close: 'Fermer',
    share_score_text: "🌍 J'ai marqué {score} points à Guess The Country ! {correct}/{total} correct. Peux-tu faire mieux ? {record}",
    copied_clipboard: '✅ Score copié dans le presse-papiers !',
    join_discord_title: 'Rejoins la communauté et partage ton score',
    join_discord_subtitle: 'Affronte les autres joueurs et entre dans le classement officiel 🔥',
    join_discord_button: '🏆 Rejoindre la communauté Discord',
    copy_discord_link: '📋 Copier le lien Discord',
    discord_help: 'Si le bouton ne marche pas, copie ce lien :',
    share_copied: 'Lien copié !',

    select_language: 'Choisir la langue',
    member_since: 'Membre depuis',
    level_title: 'Niveau',
    my_profile: 'Mon Profil',
    profile_desc: 'Tes informations de joueur',
    language_hint: 'Choisissez votre langue préférée',
    progress: 'Progrès',
    unlocked_difficulties: 'Difficultés débloquées',
  },

  es: {
    home_title: 'ADIVINA EL',
    home_subtitle: 'El desafío geográfico definitivo',
    play_now: 'JUGAR AHORA',
    ranking: 'Clasificación',
    stats: 'Estadísticas',
    profile: 'Perfil',
    games_short: 'Partidas',
    best_short: 'Mejor',
    accuracy_short: 'Precisión',

    enter_name: 'Ingresa tu nombre',
    enter_name_desc: 'Elige tu identidad de jugador',
    name_placeholder: 'Tu nombre...',
    continue: 'Continuar',
    back: 'Volver',

    choose_mode: 'Elige el modo de juego',
    mode_desc: 'Cada modo ofrece un desafío único',
    back_to_modes: 'Volver a modos',
    select_difficulty: 'Selecciona la dificultad',
    diff_desc: 'Mayor dificultad = ¡más XP y puntos!',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    expert: 'Experto',
    unlock_at_level: 'Desbloquear en nivel',

    classic_mode: 'Clásico',
    classic_desc: '15 preguntas con dificultad progresiva',
    survival_mode: 'Supervivencia',
    survival_desc: 'Una sola vida. ¿Hasta dónde llegarás?',
    chrono_mode: 'Crono',
    chrono_desc: '30 segundos. ¡Responde lo más que puedas!',
    map_mode: 'Mapa',
    map_desc: 'Adivina el país por su forma',

    which_flag: '¿Qué país tiene esta bandera?',
    which_capital: '¿Qué país tiene esta capital?',
    guess_clue: 'Adivina con esta pista',
    which_shape: '¿Qué país tiene esta forma?',
    streak: '¡racha!',
    next_question: 'Siguiente pregunta →',
    see_results: 'Ver resultados',
    correct: '¡Correcto!',
    wrong: '¡Incorrecto!',
    times_up: '¡Tiempo agotado!',
    excellent: '¡EXCELENTE!',
    incorrect: 'INCORRECTO',
    answer: 'Respuesta',
    combo_text: 'COMBO',

    game_over: 'FIN DEL JUEGO',
    final_score: 'Puntuación Final',
    accuracy: 'Precisión',
    best_combo: 'Mejor Combo',
    correct_answers: 'Correctas',
    play_again: 'Jugar de nuevo',
    go_home: 'Inicio',
    share_score: 'Compartir mi puntuación',
    legendary: 'LEGENDARIO',
    excellent_grade: 'EXCELENTE',
    great: 'GENIAL',
    good: 'BUENO',
    keep_trying: 'SIGUE INTENTANDO',
    new_best_score: '¡NUEVA MEJOR PUNTUACIÓN!',
    xp_gained: 'XP ganados',

    leaderboard: 'Clasificación',
    leaderboard_desc: 'Ranking de los mejores jugadores',
    your_best: 'Tu mejor puntuación',
    no_scores: '¡Aún no hay puntuaciones!',
    play_to_appear: 'Juega una partida para aparecer aquí',
    you_badge: '(tú)',

    statistics: 'Estadísticas',
    stats_desc: 'Resumen de tus partidas',
    games_played: 'Partidas jugadas',
    avg_score: 'Promedio',
    total_score: 'Puntuación total',
    total_xp: 'XP total',
    total_correct: 'Respuestas correctas',
    games_by_mode: 'Partidas por modo',

    chat_title: 'GeoBot',
    chat_subtitle: 'Tu asistente de geografía IA',
    chat_help: '¿Necesitas ayuda? ¡Pregúntame!',
    chat_topics_title: '¿Cómo puedo ayudarte hoy?',
    how_to_play: '¿Cómo jugar?',
    how_to_play_desc: 'Aprende las bases del juego',
    country_hints: 'Pistas sobre países',
    country_hints_desc: 'Consejos para reconocer países difíciles',
    progress_tips: 'Consejos para progresar',
    progress_tips_desc: 'Cómo mejorar tu puntuación rápidamente',
    other_questions: '← Otras preguntas',
    back_to_game: 'Volver al juego',
    powered_by: '💡 Impulsado por conocimiento geográfico',

    how_to_play_response: 'Elige un modo desde la pantalla de inicio. Responde las preguntas antes de que se acabe el tiempo. ¡Las respuestas rápidas correctas te dan más puntos y combos!',
    country_hints_response: '• Mira la forma del mapa en modo Mapa\n• Las banderas africanas suelen tener colores panafricanos\n• Los países del este de Europa suelen tener cruces o águilas\n• Australia parece un canguro acostado',
    progress_tips_response: '• ¡Apunta siempre al combo! Cada respuesta correcta sucesiva multiplica tus puntos\n• Empieza con el modo Clásico en Fácil para subir de nivel rápidamente\n• Aprende las capitales de los países medios\n• El modo Supervivencia da más XP',

    share_title: 'Comparte tu puntuación',
    share_desc: 'Diles a tus amigos que lograste',
    share_tiktok: 'Compartir en TikTok',
    share_whatsapp: 'Compartir en WhatsApp',
    share_discord: 'Compartir en Discord',
    share_copy: 'Copiar texto',
    share_copy_fallback: '¡Texto copiado! Pégalo manualmente:',
    share_twitter: 'Compartir en X (Twitter)',
    share_facebook: 'Compartir en Facebook',
    share_telegram: 'Compartir en Telegram',
    share_native: 'Más opciones...',
    share_success: '¡Puntuación copiada! Compártela 🎉',
    close: 'Cerrar',
    share_score_text: "🌍 ¡Acabo de lograr {score} puntos en Guess The Country! {correct}/{total} correctas. ¿Puedes superarme? {record}",
    copied_clipboard: '✅ ¡Puntuación copiada al portapapeles!',
    join_discord_title: 'Únete a la comunidad y comparte tu puntuación',
    join_discord_subtitle: 'Desafía a otros jugadores y entra en la clasificación oficial 🔥',
    join_discord_button: '🏆 Unirse a la comunidad de Discord',
    copy_discord_link: '📋 Copiar enlace de Discord',
    discord_help: 'Si el botón no funciona, copia este enlace:',
    share_copied: '¡Enlace copiado!',

    select_language: 'Seleccionar idioma',
    member_since: 'Miembro desde',
    level_title: 'Nivel',
    my_profile: 'Mi Perfil',
    profile_desc: 'Tu información de jugador',
    language_hint: 'Elige tu idioma preferido',
    progress: 'Progreso',
    unlocked_difficulties: 'Dificultades desbloqueadas',
  },

  de: {
    home_title: 'ERRATE DAS',
    home_subtitle: 'Die ultimative Geographie-Herausforderung',
    play_now: 'JETZT SPIELEN',
    ranking: 'Rangliste',
    stats: 'Statistik',
    profile: 'Profil',
    games_short: 'Spiele',
    best_short: 'Bestes',
    accuracy_short: 'Genauigkeit',

    enter_name: 'Gib deinen Namen ein',
    enter_name_desc: 'Wähle deine Spieleridentität',
    name_placeholder: 'Dein Name...',
    continue: 'Weiter',
    back: 'Zurück',

    choose_mode: 'Spielmodus wählen',
    mode_desc: 'Jeder Modus bietet eine einzigartige Herausforderung',
    back_to_modes: 'Zurück zu den Modi',
    select_difficulty: 'Schwierigkeit wählen',
    diff_desc: 'Höhere Schwierigkeit = mehr XP & Punkte!',
    easy: 'Leicht',
    medium: 'Mittel',
    hard: 'Schwer',
    expert: 'Experte',
    unlock_at_level: 'Freischalten ab Stufe',

    classic_mode: 'Klassisch',
    classic_desc: '15 Fragen mit steigendem Schwierigkeitsgrad',
    survival_mode: 'Überleben',
    survival_desc: 'Ein Leben. Wie weit kommst du?',
    chrono_mode: 'Chrono',
    chrono_desc: '30 Sekunden. Antworte so viele wie möglich!',
    map_mode: 'Karte',
    map_desc: 'Errate das Land anhand seiner Form',

    which_flag: 'Welches Land hat diese Flagge?',
    which_capital: 'Welches Land hat diese Hauptstadt?',
    guess_clue: 'Rate mit diesem Hinweis',
    which_shape: 'Welches Land hat diese Form?',
    streak: 'in Folge!',
    next_question: 'Nächste Frage →',
    see_results: 'Ergebnisse ansehen',
    correct: 'Richtig!',
    wrong: 'Falsch!',
    times_up: 'Zeit abgelaufen!',
    excellent: 'AUSGEZEICHNET!',
    incorrect: 'FALSCH',
    answer: 'Antwort',
    combo_text: 'COMBO',

    game_over: 'SPIELENDE',
    final_score: 'Endpunktzahl',
    accuracy: 'Genauigkeit',
    best_combo: 'Bester Combo',
    correct_answers: 'Richtig',
    play_again: 'Nochmal spielen',
    go_home: 'Startseite',
    share_score: 'Mein Ergebnis teilen',
    legendary: 'LEGENDÄR',
    excellent_grade: 'AUSGEZEICHNET',
    great: 'GROßARTIG',
    good: 'GUT',
    keep_trying: 'WEITERMACHEN',
    new_best_score: 'NEUER REKORD!',
    xp_gained: 'XP verdient',

    leaderboard: 'Rangliste',
    leaderboard_desc: 'Ranking der besten Spieler',
    your_best: 'Dein bestes Ergebnis',
    no_scores: 'Noch keine Ergebnisse!',
    play_to_appear: 'Spiele ein Spiel, um hier zu erscheinen',
    you_badge: '(du)',

    statistics: 'Statistiken',
    stats_desc: 'Deine Spielübersicht',
    games_played: 'Gespielte Spiele',
    avg_score: 'Durchschnitt',
    total_score: 'Gesamtpunktzahl',
    total_xp: 'Gesamt-XP',
    total_correct: 'Richtige Antworten',
    games_by_mode: 'Spiele nach Modus',

    chat_title: 'GeoBot',
    chat_subtitle: 'Dein Geographie-KI-Assistent',
    chat_help: 'Brauchst du Hilfe? Frag mich!',
    chat_topics_title: 'Wie kann ich dir helfen?',
    how_to_play: 'Wie spielt man?',
    how_to_play_desc: 'Lerne die Grundlagen des Spiels',
    country_hints: 'Länderhinweise',
    country_hints_desc: 'Tipps zum Erkennen schwieriger Länder',
    progress_tips: 'Tipps zum Fortschritt',
    progress_tips_desc: 'Wie du dein Ergebnis schnell verbesserst',
    other_questions: '← Andere Fragen',
    back_to_game: 'Zurück zum Spiel',
    powered_by: '💡 Angetrieben von geographischem Wissen',

    how_to_play_response: 'Wähle einen Modus vom Startbildschirm. Beantworte die Fragen, bevor die Zeit abläuft. Schnelle richtige Antworten geben mehr Punkte und Combos!',
    country_hints_response: '• Schau dir die Kartenform im Kartenmodus an\n• Afrikanische Flaggen haben oft panafrikanische Farben\n• Osteuropäische Länder haben oft Kreuze oder Adler\n• Australien sieht aus wie ein liegendes Känguru',
    progress_tips_response: '• Ziele immer auf den Combo! Jede aufeinanderfolgende richtige Antwort multipliziert deine Punkte\n• Beginne mit Klassisch auf Leicht, um schnell aufzusteigen\n• Lerne die Hauptstädte der mittleren Länder\n• Der Überlebensmodus gibt die meisten XP',

    share_title: 'Teile dein Ergebnis',
    share_desc: 'Lass deine Freunde wissen, dass du',
    share_tiktok: 'Auf TikTok teilen',
    share_whatsapp: 'Auf WhatsApp teilen',
    share_discord: 'Auf Discord teilen',
    share_copy: 'Text kopieren',
    share_copy_fallback: 'Text kopiert! Füge ihn manuell ein:',
    share_twitter: 'Auf X (Twitter) teilen',
    share_facebook: 'Auf Facebook teilen',
    share_telegram: 'Auf Telegram teilen',
    share_native: 'Mehr Optionen...',
    share_success: 'Ergebnis kopiert! Teile es jetzt 🎉',
    close: 'Schließen',
    share_score_text: "🌍 Ich habe gerade {score} Punkte in Guess The Country erreicht! {correct}/{total} richtig. Kannst du mich schlagen? {record}",
    copied_clipboard: '✅ Ergebnis in die Zwischenablage kopiert!',
    join_discord_title: 'Tritt der Community bei & teile dein Ergebnis',
    join_discord_subtitle: 'Fordere andere Spieler heraus und tritt der offiziellen Rangliste bei 🔥',
    join_discord_button: '🏆 Discord-Community beitreten',
    copy_discord_link: '📋 Discord-Link kopieren',
    discord_help: 'Wenn der Button nicht funktioniert, kopiere diesen Link:',
    share_copied: 'Link kopiert!',

    select_language: 'Sprache wählen',
    member_since: 'Mitglied seit',
    level_title: 'Stufe',
    my_profile: 'Mein Profil',
    profile_desc: 'Deine Spielerinformationen',
    language_hint: 'Wähle deine bevorzugte Sprache',
    progress: 'Fortschritt',
    unlocked_difficulties: 'Freigeschaltete Schwierigkeiten',
  },

  pt: {
    home_title: 'ADIVINHE O',
    home_subtitle: 'O desafio geográfico definitivo',
    play_now: 'JOGAR AGORA',
    ranking: 'Classificação',
    stats: 'Estatísticas',
    profile: 'Perfil',
    games_short: 'Jogos',
    best_short: 'Melhor',
    accuracy_short: 'Precisão',

    enter_name: 'Digite seu nome',
    enter_name_desc: 'Escolha sua identidade de jogador',
    name_placeholder: 'Seu nome...',
    continue: 'Continuar',
    back: 'Voltar',

    choose_mode: 'Escolha o modo de jogo',
    mode_desc: 'Cada modo oferece um desafio único',
    back_to_modes: 'Voltar aos modos',
    select_difficulty: 'Selecione a dificuldade',
    diff_desc: 'Maior dificuldade = mais XP e pontos!',
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil',
    expert: 'Expert',
    unlock_at_level: 'Desbloquear no nível',

    classic_mode: 'Clássico',
    classic_desc: '15 perguntas com dificuldade progressiva',
    survival_mode: 'Sobrevivência',
    survival_desc: 'Uma vida. Até onde você vai?',
    chrono_mode: 'Crono',
    chrono_desc: '30 segundos. Responda o máximo que puder!',
    map_mode: 'Mapa',
    map_desc: 'Adivinhe o país pela sua forma',

    which_flag: 'Qual país tem esta bandeira?',
    which_capital: 'Qual país tem esta capital?',
    guess_clue: 'Adivinhe com esta dica',
    which_shape: 'Qual país tem esta forma?',
    streak: 'sequência!',
    next_question: 'Próxima pergunta →',
    see_results: 'Ver resultados',
    correct: 'Correto!',
    wrong: 'Errado!',
    times_up: 'Tempo esgotado!',
    excellent: 'EXCELENTE!',
    incorrect: 'INCORRETO',
    answer: 'Resposta',
    combo_text: 'COMBO',

    game_over: 'FIM DE JOGO',
    final_score: 'Pontuação Final',
    accuracy: 'Precisão',
    best_combo: 'Melhor Combo',
    correct_answers: 'Corretas',
    play_again: 'Jogar novamente',
    go_home: 'Início',
    share_score: 'Compartilhar minha pontuação',
    legendary: 'LENDÁRIO',
    excellent_grade: 'EXCELENTE',
    great: 'ÓTIMO',
    good: 'BOM',
    keep_trying: 'CONTINUE TENTANDO',
    new_best_score: 'NOVO RECORDE!',
    xp_gained: 'XP ganhos',

    leaderboard: 'Classificação',
    leaderboard_desc: 'Ranking dos melhores jogadores',
    your_best: 'Sua melhor pontuação',
    no_scores: 'Ainda sem pontuações!',
    play_to_appear: 'Jogue uma partida para aparecer aqui',
    you_badge: '(você)',

    statistics: 'Estatísticas',
    stats_desc: 'Visão geral dos seus jogos',
    games_played: 'Jogos jogados',
    avg_score: 'Média',
    total_score: 'Pontuação total',
    total_xp: 'XP total',
    total_correct: 'Respostas corretas',
    games_by_mode: 'Jogos por modo',

    chat_title: 'GeoBot',
    chat_subtitle: 'Seu assistente de geografia IA',
    chat_help: 'Precisa de ajuda? Pergunte-me!',
    chat_topics_title: 'Como posso ajudar você hoje?',
    how_to_play: 'Como jogar?',
    how_to_play_desc: 'Aprenda o básico do jogo',
    country_hints: 'Dicas sobre países',
    country_hints_desc: 'Dicas para reconhecer países difíceis',
    progress_tips: 'Dicas para progredir',
    progress_tips_desc: 'Como melhorar sua pontuação rapidamente',
    other_questions: '← Outras perguntas',
    back_to_game: 'Voltar ao jogo',
    powered_by: '💡 Impulsionado pelo conhecimento geográfico',

    how_to_play_response: 'Escolha um modo na tela inicial. Responda às perguntas antes do tempo acabar. Respostas corretas rápidas dão mais pontos e combos!',
    country_hints_response: '• Olhe a forma do mapa no modo Mapa\n• Bandeiras africanas frequentemente têm cores pan-africanas\n• Países do leste europeu frequentemente têm cruzes ou águias\n• A Austrália parece um canguru deitado',
    progress_tips_response: '• Sempre mire no combo! Cada resposta correta sucessiva multiplica seus pontos\n• Comece com o modo Clássico no Fácil para subir de nível rapidamente\n• Aprenda as capitais dos países médios\n• O modo Sobrevivência dá mais XP',

    share_title: 'Compartilhe sua pontuação',
    share_desc: 'Mostre aos amigos que você marcou',
    share_tiktok: 'Compartilhar no TikTok',
    share_whatsapp: 'Compartilhar no WhatsApp',
    share_discord: 'Compartilhar no Discord',
    share_copy: 'Copiar texto',
    share_copy_fallback: 'Texto copiado! Cole manualmente:',
    share_twitter: 'Compartilhar no X (Twitter)',
    share_facebook: 'Compartilhar no Facebook',
    share_telegram: 'Compartilhar no Telegram',
    share_native: 'Mais opções...',
    share_success: 'Pontuação copiada! Compartilhe agora 🎉',
    close: 'Fechar',
    share_score_text: "🌍 Acabei de marcar {score} pontos no Guess The Country! {correct}/{total} corretas. Você consegue me superar? {record}",
    copied_clipboard: '✅ Pontuação copiada para a área de transferência!',
    join_discord_title: 'Junte-se à comunidade e compartilhe sua pontuação',
    join_discord_subtitle: 'Desafie outros jogadores e entre na classificação oficial 🔥',
    join_discord_button: '🏆 Entrar na comunidade Discord',
    copy_discord_link: '📋 Copiar link do Discord',
    discord_help: 'Se o botão não funcionar, copie este link:',
    share_copied: 'Link copiado!',

    select_language: 'Selecionar idioma',
    member_since: 'Membro desde',
    level_title: 'Nível',
    my_profile: 'Meu Perfil',
    profile_desc: 'Suas informações de jogador',
    language_hint: 'Escolha seu idioma preferido',
    progress: 'Progresso',
    unlocked_difficulties: 'Dificuldades desbloqueadas',
  },

  zh: {
    home_title: '猜猜这个',
    home_subtitle: '终极地理挑战',
    play_now: '开始游戏',
    ranking: '排行榜',
    stats: '统计',
    profile: '个人资料',
    games_short: '游戏',
    best_short: '最佳',
    accuracy_short: '准确率',

    enter_name: '输入你的名字',
    enter_name_desc: '选择你的玩家身份',
    name_placeholder: '你的名字...',
    continue: '继续',
    back: '返回',

    choose_mode: '选择游戏模式',
    mode_desc: '每种模式都有独特的挑战',
    back_to_modes: '返回模式',
    select_difficulty: '选择难度',
    diff_desc: '难度越高 = 更多经验和分数！',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    expert: '专家',
    unlock_at_level: '在等级解锁',

    classic_mode: '经典',
    classic_desc: '15个问题，难度递增',
    survival_mode: '生存',
    survival_desc: '一条命。你能走多远？',
    chrono_mode: '计时',
    chrono_desc: '30秒。尽可能多地回答！',
    map_mode: '地图',
    map_desc: '从形状猜国家',

    which_flag: '哪个国家有这个国旗？',
    which_capital: '哪个国家有这个首都？',
    guess_clue: '根据线索猜测',
    which_shape: '哪个国家有这个形状？',
    streak: '连胜！',
    next_question: '下一题 →',
    see_results: '查看结果',
    correct: '正确！',
    wrong: '错误！',
    times_up: '时间到！',
    excellent: '太棒了！',
    incorrect: '不正确',
    answer: '答案',
    combo_text: '连击',

    game_over: '游戏结束',
    final_score: '最终得分',
    accuracy: '准确率',
    best_combo: '最佳连击',
    correct_answers: '正确',
    play_again: '再来一局',
    go_home: '主页',
    share_score: '分享我的分数',
    legendary: '传奇',
    excellent_grade: '优秀',
    great: '很好',
    good: '不错',
    keep_trying: '继续努力',
    new_best_score: '新纪录！',
    xp_gained: '获得经验',

    leaderboard: '排行榜',
    leaderboard_desc: '顶级玩家排名',
    your_best: '你的最高分',
    no_scores: '还没有分数！',
    play_to_appear: '玩一局就能出现在这里',
    you_badge: '(你)',

    statistics: '统计数据',
    stats_desc: '你的游戏概览',
    games_played: '已玩游戏',
    avg_score: '平均分',
    total_score: '总分',
    total_xp: '总经验',
    total_correct: '正确答案',
    games_by_mode: '各模式游戏数',

    chat_title: 'GeoBot',
    chat_subtitle: '你的地理AI助手',
    chat_help: '需要帮助？问我！',
    chat_topics_title: '今天我能帮你什么？',
    how_to_play: '怎么玩？',
    how_to_play_desc: '学习游戏基础知识',
    country_hints: '国家提示',
    country_hints_desc: '识别难辨认国家的技巧',
    progress_tips: '进步技巧',
    progress_tips_desc: '如何快速提高分数',
    other_questions: '← 其他问题',
    back_to_game: '返回游戏',
    powered_by: '💡 由地理知识驱动',

    how_to_play_response: '从主页选择一个模式。在时间结束前回答问题。快速正确的答案会给你更多分数和连击！',
    country_hints_response: '• 在地图模式中查看国家形状\n• 非洲国旗通常有泛非色彩\n• 东欧国家通常有十字架或鹰\n• 澳大利亚看起来像一只躺着的袋鼠',
    progress_tips_response: '• 始终瞄准连击！每个连续正确答案都会倍增你的分数\n• 从经典模式的简单难度开始快速升级\n• 学习中等国家的首都\n• 生存模式给的经验最多',

    share_title: '分享你的分数',
    share_desc: '告诉你的朋友你得了',
    share_tiktok: '分享到TikTok',
    share_whatsapp: '分享到WhatsApp',
    share_discord: '分享到Discord',
    share_copy: '复制文本',
    share_copy_fallback: '文本已复制！请手动粘贴：',
    share_twitter: '分享到 X (Twitter)',
    share_facebook: '分享到 Facebook',
    share_telegram: '分享到 Telegram',
    share_native: '更多选项...',
    share_success: '分数已复制！快去分享吧 🎉',
    close: '关闭',
    share_score_text: "🌍 我在猜猜这个国家得了{score}分！{correct}/{total}正确。你能超过我吗？{record}",
    copied_clipboard: '✅ 分数已复制到剪贴板！',
    join_discord_title: '加入社区并分享你的分数',
    join_discord_subtitle: '挑战其他玩家并进入官方排行榜 🔥',
    join_discord_button: '🏆 加入 Discord 社区',
    copy_discord_link: '📋 复制 Discord 链接',
    discord_help: '如果按钮不起作用，请复制此链接：',
    share_copied: '链接已复制！',

    select_language: '选择语言',
    member_since: '加入时间',
    level_title: '等级',
    my_profile: '我的资料',
    profile_desc: '你的玩家信息',
    language_hint: '选择你的首选语言',
    progress: '进度',
    unlocked_difficulties: '已解锁难度',
  },

  ja: {
    home_title: '国を当てろ',
    home_subtitle: '究極の地理チャレンジ',
    play_now: 'プレイ',
    ranking: 'ランキング',
    stats: '統計',
    profile: 'プロフィール',
    games_short: 'ゲーム',
    best_short: 'ベスト',
    accuracy_short: '正確率',

    enter_name: '名前を入力',
    enter_name_desc: 'プレイヤー名を決めよう',
    name_placeholder: 'あなたの名前...',
    continue: '続ける',
    back: '戻る',

    choose_mode: 'ゲームモードを選択',
    mode_desc: '各モードに独自の挑戦があります',
    back_to_modes: 'モードに戻る',
    select_difficulty: '難易度を選択',
    diff_desc: '難易度が高いほど = より多くのXP＆ポイント！',
    easy: '簡単',
    medium: '普通',
    hard: '難しい',
    expert: 'エキスパート',
    unlock_at_level: 'レベルで解除',

    classic_mode: 'クラシック',
    classic_desc: '難易度が上がる15問',
    survival_mode: 'サバイバル',
    survival_desc: 'ライフは1つ。どこまで行ける？',
    chrono_mode: 'タイムアタック',
    chrono_desc: '30秒。できるだけ多く答えよう！',
    map_mode: 'マップ',
    map_desc: '形から国を当てよう',

    which_flag: 'この国旗の国はどこ？',
    which_capital: 'この首都のある国はどこ？',
    guess_clue: 'この手がかりから推測',
    which_shape: 'この形の国はどこ？',
    streak: '連続！',
    next_question: '次の問題 →',
    see_results: '結果を見る',
    correct: '正解！',
    wrong: '不正解！',
    times_up: '時間切れ！',
    excellent: '素晴らしい！',
    incorrect: '不正解',
    answer: '答え',
    combo_text: 'コンボ',

    game_over: 'ゲームオーバー',
    final_score: '最終スコア',
    accuracy: '正確率',
    best_combo: '最大コンボ',
    correct_answers: '正解',
    play_again: 'もう一度プレイ',
    go_home: 'ホーム',
    share_score: 'スコアを共有',
    legendary: '伝説',
    excellent_grade: '素晴らしい',
    great: '良い',
    good: 'まあまあ',
    keep_trying: '続けて',
    new_best_score: '新記録！',
    xp_gained: 'XP獲得',

    leaderboard: 'リーダーボード',
    leaderboard_desc: 'トッププレイヤーランキング',
    your_best: 'あなたの最高スコア',
    no_scores: 'まだスコアがありません！',
    play_to_appear: 'ゲームをプレイしてここに表示されよう',
    you_badge: '(あなた)',

    statistics: '統計',
    stats_desc: 'ゲームの概要',
    games_played: 'プレイしたゲーム',
    avg_score: '平均スコア',
    total_score: '合計スコア',
    total_xp: '合計XP',
    total_correct: '正解数',
    games_by_mode: 'モード別ゲーム数',

    chat_title: 'GeoBot',
    chat_subtitle: '地理AIアシスタント',
    chat_help: 'ヘルプが必要？聞いて！',
    chat_topics_title: 'どうお手伝いしましょうか？',
    how_to_play: '遊び方？',
    how_to_play_desc: 'ゲームの基本を学ぼう',
    country_hints: '国のヒント',
    country_hints_desc: '難しい国を識別するコツ',
    progress_tips: '上達のコツ',
    progress_tips_desc: 'スコアを素早く上げる方法',
    other_questions: '← 他の質問',
    back_to_game: 'ゲームに戻る',
    powered_by: '💡 地理知識で動作',

    how_to_play_response: 'ホーム画面からモードを選択。タイマーが切れる前に質問に答えよう。素早い正解でより多くのポイントとコンボが得られます！',
    country_hints_response: '• マップモードで国の形を見る\n• アフリカの国旗はパン・アフリカカラーが多い\n• 東欧の国は十字架や鷲が多い\n• オーストラリアは横たわったカンガルーに似ている',
    progress_tips_response: '• 常にコンボを狙おう！連続正解でポイントが倍増\n• クラシックモードの簡単で素早くレベルアップ\n• 中級国の首都を覚えよう\n• サバイバルモードが最もXPをもらえる',

    share_title: 'スコアを共有',
    share_desc: '友達にスコアを知らせよう',
    share_tiktok: 'TikTokで共有',
    share_whatsapp: 'WhatsAppで共有',
    share_discord: 'Discordで共有',
    share_copy: 'テキストをコピー',
    share_copy_fallback: 'テキストをコピーしました！手動で貼り付けてください：',
    share_twitter: 'X (Twitter) で共有',
    share_facebook: 'Facebook で共有',
    share_telegram: 'Telegram で共有',
    share_native: 'その他のオプション...',
    share_success: 'スコアをコピーしました！共有しましょう 🎉',
    close: '閉じる',
    share_score_text: "🌍 Guess The Countryで{score}点獲得！{correct}/{total}正解。私を超えられる？{record}",
    copied_clipboard: '✅ スコアをクリップボードにコピー！',
    join_discord_title: 'コミュニティに参加してスコアを共有',
    join_discord_subtitle: '他のプレイヤーに挑戦して公式ランキングに参加 🔥',
    join_discord_button: '🏆 Discord コミュニティに参加',
    copy_discord_link: '📋 Discordリンクをコピー',
    discord_help: 'ボタンが機能しない場合は、このリンクをコピーしてください：',
    share_copied: 'リンクがコピーされました！',

    select_language: '言語を選択',
    member_since: '加入日',
    level_title: 'レベル',
    my_profile: 'マイプロフィール',
    profile_desc: 'プレイヤー情報',
    language_hint: 'お好みの言語を選択してください',
    progress: '進行状況',
    unlocked_difficulties: '解除された難易度',
  },

  ar: {
    home_title: 'خمن الدولة',
    home_subtitle: 'تحدي الجغرافيا النهائي',
    play_now: 'العب الآن',
    ranking: 'الترتيب',
    stats: 'الإحصائيات',
    profile: 'الملف الشخصي',
    games_short: 'ألعاب',
    best_short: 'الأفضل',
    accuracy_short: 'الدقة',

    enter_name: 'أدخل اسمك',
    enter_name_desc: 'اختر هوية اللاعب',
    name_placeholder: 'اسمك...',
    continue: 'متابعة',
    back: 'رجوع',

    choose_mode: 'اختر وضع اللعب',
    mode_desc: 'كل وضع يمثل تحديًا فريدًا',
    back_to_modes: 'العودة للأوضاع',
    select_difficulty: 'اختر الصعوبة',
    diff_desc: 'صعوبة أعلى = نقاط وخبرة أكثر!',
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
    expert: 'خبير',
    unlock_at_level: 'فتح في المستوى',

    classic_mode: 'كلاسيكي',
    classic_desc: '15 سؤال بصعوبة تدريجية',
    survival_mode: 'بقاء',
    survival_desc: 'حياة واحدة. إلى أين ستصل؟',
    chrono_mode: 'زمني',
    chrono_desc: '30 ثانية. أجب على أكبر عدد!',
    map_mode: 'خريطة',
    map_desc: 'خمن الدولة من شكلها',

    which_flag: 'أي دولة لها هذا العلم؟',
    which_capital: 'أي دولة لها هذه العاصمة؟',
    guess_clue: 'خمن من هذه التلميح',
    which_shape: 'أي دولة لها هذا الشكل؟',
    streak: '!متتالية',
    next_question: '← السؤال التالي',
    see_results: 'عرض النتائج',
    correct: '!صحيح',
    wrong: '!خطأ',
    times_up: '!انتهى الوقت',
    excellent: '!ممتاز',
    incorrect: 'خطأ',
    answer: 'الإجابة',
    combo_text: 'كومبو',

    game_over: 'انتهت اللعبة',
    final_score: 'النتيجة النهائية',
    accuracy: 'الدقة',
    best_combo: 'أفضل كومبو',
    correct_answers: 'صحيح',
    play_again: 'العب مرة أخرى',
    go_home: 'الرئيسية',
    share_score: 'شارك نتيجتك',
    legendary: 'أسطوري',
    excellent_grade: 'ممتاز',
    great: 'رائع',
    good: 'جيد',
    keep_trying: 'واصل المحاولة',
    new_best_score: '!نتيجة قياسية جديدة',
    xp_gained: 'خبرة مكتسبة',

    leaderboard: 'لوحة المتصدرين',
    leaderboard_desc: 'تصنيف أفضل اللاعبين',
    your_best: 'أفضل نتيجتك',
    no_scores: '!لا توجد نتائج بعد',
    play_to_appear: 'العب لتظهر هنا',
    you_badge: '(أنت)',

    statistics: 'الإحصائيات',
    stats_desc: 'نظرة عامة على ألعابك',
    games_played: 'الألعاب الملعوبة',
    avg_score: 'المتوسط',
    total_score: 'النتيجة الإجمالية',
    total_xp: 'إجمالي الخبرة',
    total_correct: 'الإجابات الصحيحة',
    games_by_mode: 'الألعاب حسب الوضع',

    chat_title: 'GeoBot',
    chat_subtitle: 'مساعدك الجغرافي بالذكاء الاصطناعي',
    chat_help: '!تحتاج مساعدة؟ اسألني',
    chat_topics_title: 'كيف يمكنني مساعدتك اليوم؟',
    how_to_play: 'كيف ألعب؟',
    how_to_play_desc: 'تعلم أساسيات اللعبة',
    country_hints: 'تلميحات عن الدول',
    country_hints_desc: 'نصائح للتعرف على الدول الصعبة',
    progress_tips: 'نصائح للتقدم',
    progress_tips_desc: 'كيف تحسن نتيجتك بسرعة',
    other_questions: '→ أسئلة أخرى',
    back_to_game: 'العودة للعبة',
    powered_by: '💡 مدعوم بالمعرفة الجغرافية',

    how_to_play_response: '!اختر وضعًا من الشاشة الرئيسية. أجب على الأسئلة قبل انتهاء الوقت. الإجابات الصحيحة السريعة تمنحك نقاطًا وكومبو أكثر',
    country_hints_response: '• انظر إلى شكل الخريطة في وضع الخريطة\n• الأعلام الأفريقية غالبًا ما تحتوي على ألوان أفريقية\n• دول أوروبا الشرقية غالبًا ما تحتوي على صلبان أو نسور\n• أستراليا تشبه الكنغر المستلقي',
    progress_tips_response: '!• استهدف دائمًا الكومبو! كل إجابة صحيحة متتالية تضاعف نقاطك\n• ابدأ بالوضع الكلاسيكي على سهل للترقية بسرعة\n• تعلم عواصم الدول المتوسطة\n• وضع البقاء يمنح أكبر قدر من الخبرة',

    share_title: 'شارك نتيجتك',
    share_desc: 'أخبر أصدقاءك أنك حصلت على',
    share_tiktok: 'مشاركة على TikTok',
    share_whatsapp: 'مشاركة على WhatsApp',
    share_discord: 'مشاركة على Discord',
    share_copy: 'نسخ النص',
    share_copy_fallback: 'تم نسخ النص! الصقه يدويًا:',
    share_twitter: 'مشاركة على X (تويتر)',
    share_facebook: 'مشاركة على فيسبوك',
    share_telegram: 'مشاركة على تيليجرام',
    share_native: 'خيارات أخرى...',
    share_success: 'تم نسخ النتيجة! شاركها الآن 🎉',
    close: 'إغلاق',
    share_score_text: "🌍 حصلت على {score} نقطة في خمن الدولة! {correct}/{total} صحيح. هل يمكنك التغلب عليّ؟ {record}",
    copied_clipboard: '✅ تم نسخ النتيجة!',
    join_discord_title: 'انضم إلى المجتمع وشارك نتيجتك',
    join_discord_subtitle: 'تحدى اللاعبين الآخرين وادخل الترتيب الرسمي 🔥',
    join_discord_button: '🏆 انضم إلى مجتمع Discord',
    copy_discord_link: '📋 نسخ رابط Discord',
    discord_help: 'إذا لم يعمل الزر، انسخ هذا الرابط:',
    share_copied: 'تم نسخ الرابط!',

    select_language: 'اختر اللغة',
    member_since: 'عضو منذ',
    level_title: 'المستوى',
    my_profile: 'ملفي الشخصي',
    profile_desc: 'معلومات اللاعب الخاصة بك',
    language_hint: 'اختر لغتك المفضلة',
    progress: 'التقدم',
    unlocked_difficulties: 'الصعوبات المفتوحة',
  },
};

export const languageOptions: { code: Language; flag: string; flagEmoji: string; name: string; nativeName: string }[] = [
  { code: 'en', flag: 'https://flagcdn.com/w80/gb.png', flagEmoji: '🇬🇧', name: 'English', nativeName: 'English' },
  { code: 'fr', flag: 'https://flagcdn.com/w80/fr.png', flagEmoji: '🇫🇷', name: 'French', nativeName: 'Français' },
  { code: 'es', flag: 'https://flagcdn.com/w80/es.png', flagEmoji: '🇪🇸', name: 'Spanish', nativeName: 'Español' },
  { code: 'de', flag: 'https://flagcdn.com/w80/de.png', flagEmoji: '🇩🇪', name: 'German', nativeName: 'Deutsch' },
  { code: 'pt', flag: 'https://flagcdn.com/w80/pt.png', flagEmoji: '🇵🇹', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', flag: 'https://flagcdn.com/w80/cn.png', flagEmoji: '🇨🇳', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', flag: 'https://flagcdn.com/w80/jp.png', flagEmoji: '🇯🇵', name: 'Japanese', nativeName: '日本語' },
  { code: 'ar', flag: 'https://flagcdn.com/w80/sa.png', flagEmoji: '🇸🇦', name: 'Arabic', nativeName: 'العربية' },
];
