import { Question, UserProfile, UserRole, QuestionType } from './types';

export const ADMIN_KEY = "bS%83B4+4uAO-#&&UyK;H+";

export const USERS: UserProfile[] = [
  { id: 'u1', name: 'Mahmoud', pin: '77337733w', role: UserRole.USER },
  { id: 'u2', name: 'Ismail', pin: '77002887p', role: UserRole.USER },
  { id: 'u3', name: 'Ayoub', pin: '00229900e', role: UserRole.USER },
  { id: 'nizar', name: 'Nizar', pin: '88994411n', role: UserRole.USER },
  { id: 'abdu', name: 'Abdu', pin: '11223344a', role: UserRole.USER },
  { id: 'saad', name: 'Saad', pin: '55667788s', role: UserRole.USER },
  { id: 'noureddine', name: 'Noureddine', pin: '66778899n', role: UserRole.USER },
];

let qId = 1;

// --- Helper Functions ---

const createText = (en: string, fr: string, ar: string, section: string, isLong = false): Question => ({
  id: qId++,
  section,
  type: isLong ? QuestionType.TEXTAREA : QuestionType.TEXT,
  text: { en, fr, ar },
  isPuzzle: false
});

const createScale = (en: string, fr: string, ar: string, section: string, min = 1, max = 10): Question => ({
  id: qId++,
  section,
  type: QuestionType.SCALE,
  text: { en, fr, ar },
  scale: {
    min,
    max,
    minLabel: { en: "Low", fr: "Faible", ar: "منخفض" },
    maxLabel: { en: "High", fr: "Élevé", ar: "مرتفع" }
  },
  isPuzzle: false
});

const createChoice = (en: string, fr: string, ar: string, section: string, options: any[], isMulti = false): Question => ({
  id: qId++,
  section,
  type: isMulti ? QuestionType.MULTIPLE : QuestionType.SINGLE,
  text: { en, fr, ar },
  options: options.map((o, i) => ({
    id: `opt_${i}`,
    text: o
  })),
  isPuzzle: false
});

const createPuzzle = (en: string, fr: string, ar: string, type: QuestionType = QuestionType.SINGLE, options: any[] = []): Question => ({
  id: qId++,
  section: 'Logic & Reasoning',
  type,
  text: { en, fr, ar },
  options: options.length ? options.map((o, i) => ({
    id: `popt_${i}`,
    text: o
  })) : undefined,
  isPuzzle: true
});

// --- Options Presets ---
const OPT_YES_NO = [
  { en: "Yes", fr: "Oui", ar: "نعم" },
  { en: "No", fr: "Non", ar: "لا" },
  { en: "Sometimes", fr: "Parfois", ar: "أحياناً" }
];

const OPT_FREQ = [
  { en: "Never", fr: "Jamais", ar: "أبدًا" },
  { en: "Rarely", fr: "Rarement", ar: "نادراً" },
  { en: "Often", fr: "Souvent", ar: "غالباً" },
  { en: "Always", fr: "Toujours", ar: "دائماً" }
];

const OPT_TEAM = [
  { en: "Leader", fr: "Leader", ar: "قائد" },
  { en: "Follower", fr: "Suiveur", ar: "تابع" },
  { en: "Mediator", fr: "Médiateur", ar: "وسيط" },
  { en: "Innovator", fr: "Innovateur", ar: "مبتكر" }
];

export const QUESTIONS: Question[] = [
  // --- SECTION 1: MINDSET (34 Qs) ---
  // Selectable (14)
  createScale("How do you rate your stress management?", "Comment évalues-tu ta gestion du stress ?", "كيف تقيم إدارتك للتوتر؟", "Mindset"),
  createChoice("Do you prefer working alone or in a team?", "Préfères-tu travailler seul ou en équipe ?", "هل تفضل العمل وحدك أم مع فريق؟", "Mindset", [
    { en: "Alone", fr: "Seul", ar: "وحدي" },
    { en: "Team", fr: "Équipe", ar: "فريق" },
    { en: "Depends", fr: "Ça dépend", ar: "حسب الظروف" }
  ]),
  createChoice("How do you react to criticism?", "Comment réagis-tu aux critiques ?", "كيف تتفاعل مع النقد؟", "Mindset", [
    { en: "Defensive", fr: "Défensif", ar: "دفاعي" },
    { en: "Open & Curious", fr: "Ouvert & Curieux", ar: "منفتح وفضولي" },
    { en: "Ignore it", fr: "L'ignorer", ar: "أتجاهله" }
  ]),
  createScale("How ambitious are you?", "À quel point es-tu ambitieux ?", "ما مدى طموحك؟", "Mindset"),
  createChoice("Do you fear failure?", "As-tu peur de l'échec ?", "هل تخاف الفشل؟", "Mindset", OPT_YES_NO),
  createChoice("Are you optimistic about the future?", "Es-tu optimiste pour l'avenir ?", "هل أنت متفائل بالمستقبل؟", "Mindset", OPT_FREQ),
  createScale("How patient are you?", "À quel point es-tu patient ?", "ما مدى صبرك؟", "Mindset"),
  createChoice("Do you take risks?", "Prends-tu des risques ?", "هل تخاطر؟", "Mindset", OPT_YES_NO),
  createChoice("How adaptable are you to change?", "Es-tu adaptable au changement ?", "هل تتأقلم مع التغيير؟", "Mindset", [
    { en: "Very adaptable", fr: "Très adaptable", ar: "متأقلم جداً" },
    { en: "Need time", fr: "Besoin de temps", ar: "أحتاج وقت" },
    { en: "Resist change", fr: "Résiste au changement", ar: "أقاوم التغيير" }
  ]),
  createScale("Confidence level in difficult situations?", "Niveau de confiance dans les situations difficiles ?", "مستوى الثقة في المواقف الصعبة؟", "Mindset"),
  createChoice("Do you trust your intuition?", "Fais-tu confiance à ton intuition ?", "هل تثق بحدسك؟", "Mindset", OPT_FREQ),
  createChoice("Are you a perfectionist?", "Es-tu perfectionنiste ?", "هل أنت مثالي؟", "Mindset", OPT_YES_NO),
  createScale("How competitive are you?", "À quel point es-tu compétitif ?", "ما مدى تنافسيتك؟", "Mindset"),
  createChoice("Do you dwell on past mistakes?", "Ressasses-tu les erreurs passées ?", "هل تفكر كثيراً في أخطاء الماضي؟", "Mindset", OPT_FREQ),

  // Short Text (13)
  createText("What motivates you the most?", "Qu’est-ce qui te motive le plus ?", "ما الذي يحفزك أكثر؟", "Mindset"),
  createText("Describe yourself in 3 words.", "Décris-toi en 3 mots.", "صف نفسك في 3 كلمات.", "Mindset"),
  createText("What is your biggest fear?", "Quelle est ta plus grande peur ?", "ما هو أكبر مخاوفك؟", "Mindset"),
  createText("Who is your role model?", "Qui est ton modèle ?", "من هو قدوتك؟", "Mindset"),
  createText("One habit you want to break?", "Une habitude que tu veux arrêter ?", "عادة تريد التخلص منها؟", "Mindset"),
  createText("What makes you angry at work?", "Qu'est-ce qui t'énerve au travail ?", "ما الذي يغضبك في العمل؟", "Mindset"),
  createText("How do you handle a bad day?", "Comment gères-tu une mauvaise journée ?", "كيف تتعامل مع يوم سيء؟", "Mindset"),
  createText("What does 'Integrity' mean to you?", "Que signifie 'Intégrité' pour toi ?", "ماذا تعني النزاهة لك؟", "Mindset"),
  createText("Your definition of success?", "Ta définition du succès ?", "تعريفك للنجاح؟", "Mindset"),
  createText("What keeps you awake at night?", "Qu'est-ce qui t'empêche de dormir ?", "ما الذي يبقيك مستيقظاً؟", "Mindset"),
  createText("First thing you do in the morning?", "Première chose que tu fais le matin ?", "أول شيء تفعله في الصباح؟", "Mindset"),
  createText("How do you celebrate wins?", "Comment fêtes-tu les victoires ?", "كيف تحتفل بالانتصارات؟", "Mindset"),
  createText("Best advice received?", "Meilleur conseil reçu ?", "أفضل نصيحة تلقيتها؟", "Mindset"),

  // Long Text (7)
  createText("Describe a failure you learned from.", "Décris un échec dont tu as appris.", "صف فشلًا تعلمت منه.", "Mindset", true),
  createText("Where do you see yourself in 3 years?", "Où te vois-tu dans 3 ans ?", "أين ترى نفسك بعد 3 سنوات؟", "Mindset", true),
  createText("Why should we trust you?", "Pourquoi devrions-nous te faire confiance ?", "لماذا يجب أن نثق بك؟", "Mindset", true),
  createText("How do you deal with difficult people?", "Comment gères-tu les personnes difficiles ?", "كيف تتعامل مع الأشخاص الصعبين؟", "Mindset", true),
  createText("Describe your ideal work environment.", "Décris ton environnement de travail idéal.", "صف بيئة عملك المثالية.", "Mindset", true),
  createText("What legacy do you want to leave?", "Quel héritage veux-tu laisser ?", "ما الإرث الذي تريد تركه؟", "Mindset", true),
  createText("Explain a complex idea simply.", "Explique une idée complexe simplement.", "اشرح فكرة معقدة ببساطة.", "Mindset", true),


  // --- SECTION 2: SKILLS (33 Qs) ---
  // Selectable (13)
  createChoice("Primary role in a project?", "Rôle principal dans un projet ?", "دورك الأساسي في المشروع؟", "Skills", OPT_TEAM),
  createScale("Rate your problem-solving skills.", "Évalue tes compétences en résolution de problèmes.", "قيم مهاراتك في حل المشكلات.", "Skills"),
  createChoice("Which tools do you use daily?", "Quels outils utilises-tu quotidiennement ?", "ما الأدوات التي تستخدمها يومياً؟", "Skills", [
    { en: "Code Editors", fr: "Éditeurs de code", ar: "محررات الكود" },
    { en: "Design Tools", fr: "Outils de design", ar: "أدوات التصميم" },
    { en: "Spreadsheets", fr: "Tableurs", ar: "جداول البيانات" },
    { en: "Management Apps", fr: "Apps de gestion", ar: "تطبيقات الإدارة" }
  ], true),
  createChoice("Do you document your code/work?", "Documentes-tu ton travail ?", "هل توثق عملك؟", "Skills", OPT_FREQ),
  createScale("Rate your communication skills.", "Évalue ta communication.", "قيم تواصلك.", "Skills"),
  createChoice("Do you prefer stability or innovation?", "Préfères-tu stabilité ou innovation ?", "هل تفضل الاستقرار أم الابتكار؟", "Skills", [
    { en: "Stability", fr: "Stabilité", ar: "استقرار" },
    { en: "Innovation", fr: "Innovation", ar: "ابتكار" }
  ]),
  createChoice("Can you lead a meeting?", "Peux-tu mener une réunion ?", "هل يمكنك إدارة اجتماع؟", "Skills", OPT_YES_NO),
  createScale("Rate your time management.", "Évalue ta gestion du temps.", "قيم إدارتك للوقت.", "Skills"),
  createChoice("Do you like teaching others?", "Aimes-tu enseigner aux autres ?", "هل تحب تعليم الآخرين؟", "Skills", OPT_YES_NO),
  createChoice("How do you handle deadlines?", "Comment gères-tu les délais ?", "كيف تتعامل مع المواعيد؟", "Skills", [
    { en: "Plan ahead", fr: "Planifier à l'avance", ar: "أخطط مسبقاً" },
    { en: "Last minute", fr: "Dernière minute", ar: "في آخر لحظة" },
    { en: "Variable", fr: "Variable", ar: "متغير" }
  ]),
  createChoice("Remote or Office?", "Télétravail ou Bureau ?", "عن بعد أم في المكتب؟", "Skills", [
    { en: "Remote", fr: "Télétravail", ar: "عن بعد" },
    { en: "Office", fr: "Bureau", ar: "مكتب" },
    { en: "Hybrid", fr: "Hybride", ar: "هجين" }
  ]),
  createScale("Rate your technical knowledge.", "Évalue tes connaissances techniques.", "قيم معرفتك التقنية.", "Skills"),
  createChoice("Do you check your work twice?", "Vérifies-tu ton travail deux fois ?", "هل تراجع عملك مرتين؟", "Skills", OPT_FREQ),

  // Short Text (13)
  createText("What did you learn recently?", "Qu’as-tu appris récemment ?", "ماذا تعلمت مؤخرًا؟", "Skills"),
  createText("Indispensable tool for you?", "Outil indispensable pour toi ?", "أداة لا تستغني عنها؟", "Skills"),
  createText("Preferred programming language/field?", "Langage/Domaine préféré ?", "اللغة/المجال المفضل؟", "Skills"),
  createText("How do you organize tasks?", "Comment organises-tu les tâches ?", "كيف تنظم المهام؟", "Skills"),
  createText("Best platform for learning?", "Meilleure plateforme pour apprendre ?", "أفضل منصة للتعلم؟", "Skills"),
  createText("A skill you want to master?", "Une compétence à maîtriser ?", "مهارة تود إتقانها؟", "Skills"),
  createText("How do you stay updated?", "Comment restes-tu à jour ?", "كيف تبقى مطلعاً؟", "Skills"),
  createText("Mac, Windows, or Linux?", "Mac, Windows ou Linux ?", "ماك، ويندوز أم لينكس؟", "Skills"),
  createText("Tabs or Spaces?", "Tabs ou Spaces ?", "Tabs أم Spaces؟", "Skills"),
  createText("Favorite shortcut?", "Raccourci favori ?", "الاختصار المفضل؟", "Skills"),
  createText("Fastest way to fix a bug?", "Moyen le plus rapide pour corriger un bug ?", "أسرع طريقة لإصلاح خطأ؟", "Skills"),
  createText("Do you use AI tools? Which?", "Utilises-tu l'IA ? Lesquelles ?", "هل تستخدم الذكاء الاصطناعي؟ أيها؟", "Skills"),
  createText("Email or Chat?", "Email ou Chat ?", "بريد أم شات؟", "Skills"),

  // Long Text (7)
  createText("Describe a project you are proud of.", "Décris un projet dont tu es fier.", "صف مشروعًا تفخر به.", "Skills", true),
  createText("How do you solve a problem you never faced?", "Comment résous-tu un problème inconnu ?", "كيف تحل مشكلة جديدة؟", "Skills", true),
  createText("Explain your workflow.", "Explique ton flux de travail.", "اشرح سير عملك.", "Skills", true),
  createText("How do you split a big task?", "Comment divises-tu une grande tâche ?", "كيف تقسم مهمة كبيرة؟", "Skills", true),
  createText("Describe a conflict at work and resolution.", "Décris un conflit au travail et la solution.", "صف صراعاً في العمل وحله.", "Skills", true),
  createText("How do you handle critical feedback?", "Comment gères-tu les retours critiques ?", "كيف تتعامل مع الملاحظات النقدية؟", "Skills", true),
  createText("Teach me something in one paragraph.", "Apprends-moi quelque chose en un paragraphe.", "علمني شيئاً في فقرة.", "Skills", true),


  // --- SECTION 3: VALUES (33 Qs) ---
  // Selectable (13)
  createScale("How important is money to you?", "Importance de l'argent ?", "أهمية المال لك؟", "Values"),
  createChoice("Work-Life Balance or High Career Growth?", "Équilibre vie-pro ou Carrière ?", "توازن الحياة أم النمو المهني؟", "Values", [
    { en: "Balance", fr: "Équilibre", ar: "توازن" },
    { en: "Growth", fr: "Croissance", ar: "نمو" }
  ]),
  createChoice("Is loyalty important?", "La loyauté est-elle importante ?", "هل الولاء مهم؟", "Values", OPT_YES_NO),
  createScale("How important is honesty?", "Importance de l'honnêteté ?", "أهمية الأمانة؟", "Values"),
  createChoice("Action or Planning?", "Action ou Planification ?", "فعل أم تخطيط؟", "Values", [
    { en: "Action", fr: "Action", ar: "فعل" },
    { en: "Planning", fr: "Planification", ar: "تخطيط" }
  ]),
  createChoice("Do you follow rules strictly?", "Suis-tu les règles strictement ?", "هل تتبع القواعد بصرامة؟", "Values", OPT_FREQ),
  createScale("Value of creativity vs logic?", "Valeur créativité vs logique ?", "قيمة الإبداع مقابل المنطق؟", "Values", 1, 10), // 1=Logic, 10=Creativity
  createChoice("Group success or Individual glory?", "Succès groupe ou Gloire individuelle ?", "نجاح الجماعة أم المجد الفردي؟", "Values", [
    { en: "Group", fr: "Groupe", ar: "جماعة" },
    { en: "Individual", fr: "Individuel", ar: "فردي" }
  ]),
  createChoice("Is patience a virtue?", "La patience est-elle une vertu ?", "هل الصبر فضيلة؟", "Values", OPT_YES_NO),
  createChoice("Hard truth or comforting lie?", "Vérité dure ou mensonge réconfortant ?", "حقيقة مرة أم كذبة مريحة؟", "Values", [
    { en: "Truth", fr: "Vérité", ar: "حقيقة" },
    { en: "Comfort", fr: "Réconfort", ar: "راحة" }
  ]),
  createScale("How much do you value freedom?", "Combien values-tu la liberté ?", "كم تقدر الحرية؟", "Values"),
  createChoice("Can you forgive easily?", "Pardonnes-tu facilement ?", "هل تسامح بسهولة؟", "Values", OPT_YES_NO),
  createChoice("Leader or Supporter?", "Leader ou Support ?", "قائد أم داعم؟", "Values", [
    { en: "Leader", fr: "Leader", ar: "قائد" },
    { en: "Supporter", fr: "Support", ar: "داعم" }
  ]),

  // Short Text (14)
  createText("What is integrity?", "Qu'est-ce que l'intégrité ?", "ما هي النزاهة؟", "Values"),
  createText("Define 'Respect'.", "Définis 'Respect'.", "عرف الاحترام.", "Values"),
  createText("What makes a good human?", "Qu'est-ce qui fait un bon humain ?", "ما الذي يصنع إنساناً جيداً؟", "Values"),
  createText("Biggest value in life?", "Plus grande valeur dans la vie ?", "أكبر قيمة في الحياة؟", "Values"),
  createText("What drains your energy?", "Qu'est-ce qui t'épuise ?", "ما الذي يستنزف طاقتك؟", "Values"),
  createText("What restores your energy?", "Qu'est-ce qui te ressource ?", "ما الذي يعيدك؟", "Values"),
  createText("A cause you support?", "Une cause que tu soutiens ?", "قضية تدعمها؟", "Values"),
  createText("What makes you happy?", "Qu'est-ce qui te rend heureux ?", "ما الذي يسعدك؟", "Values"),
  createText("One rule you live by?", "Une règle de vie ?", "قاعدة تعيش بها؟", "Values"),
  createText("Worst human trait?", "Pire trait humain ?", "أسوأ صفة بشرية؟", "Values"),
  createText("Best human trait?", "Meilleur trait humain ?", "أفضل صفة بشرية؟", "Values"),
  createText("What is wisdom?", "Qu'est-ce que la sagesse ?", "ما هي الحكمة؟", "Values"),
  createText("Friendship means...?", "L'amitié signifie... ?", "الصداقة تعني...؟", "Values"),
  createText("Success is...?", "Le succès est... ?", "النجاح هو...؟", "Values"),

  // Long Text (6)
  createText("What would you change about the world?", "Que changerais-tu dans le monde ?", "ماذا تغير في العالم؟", "Values", true),
  createText("Is it better to be loved or feared?", "Mieux vaut être aimé ou craint ?", "هل الأفضل أن تكون محبوباً أم مهاباً؟", "Values", true),
  createText("What does commitment mean to you?", "Que signifie l'engagement ?", "ماذا يعني الالتزام لك؟", "Values", true),
  createText("Explain your moral compass.", "Explique ta boussole morale.", "اشرح بوصلتك الأخلاقية.", "Values", true),
  createText("What is the purpose of work?", "Quel est le but du travail ?", "ما الغاية من العمل؟", "Values", true),
  createText("If you had one wish, what would it be?", "Si tu avais un vœu ?", "لو كان لديك أمنية واحدة؟", "Values", true),


  // --- PUZZLES (40 Total) ---
  // Selectable Logic (20)
  createPuzzle(
    "What has keys but opens no locks?",
    "Qu'est-ce qui a des clés mais n'ouvre aucune serrure ?",
    "ما الذي له مفاتيح ولكن لا يفتح أي أقفال؟",
    QuestionType.SINGLE,
    [
      { en: "Piano", fr: "Piano", ar: "بيانو" },
      { en: "Map", fr: "Carte", ar: "خريطة" },
      { en: "Monkey", fr: "Singe", ar: "قرد" },
      { en: "Banana", fr: "Banane", ar: "موز" }
    ]
  ),
  createPuzzle(
    "I speak without a mouth and hear without ears. I have no body, but I come alive with wind.",
    "Je parle sans bouche et j'entends sans oreilles. Je n'ai pas de corps, mais je m'anime avec le vent.",
    "أتكلم بلا فم وأسمع بلا أذنين. ليس لي جسد، لكنني أحيى مع الريح.",
    QuestionType.SINGLE,
    [
      { en: "Echo", fr: "Écho", ar: "الصدى" },
      { en: "Ghost", fr: "Fantôme", ar: "شبح" },
      { en: "Radio", fr: "Radio", ar: "مذياع" },
      { en: "Cloud", fr: "Nuage", ar: "سحابة" }
    ]
  ),
  createPuzzle(
    "The more you take, the more you leave behind.",
    "Plus tu en prends, plus tu en laisses derrière toi.",
    "كلما أخذت منها، كلما تركت وراءك أكثر.",
    QuestionType.SINGLE,
    [
      { en: "Footsteps", fr: "Pas", ar: "خطوات" },
      { en: "Time", fr: "Temps", ar: "وقت" },
      { en: "Money", fr: "Argent", ar: "مال" },
      { en: "Memories", fr: "Souvenirs", ar: "ذكريات" }
    ]
  ),
  createPuzzle(
    "What has a head and a tail but no body?",
    "Qu'est-ce qui a une tête et une queue mais pas de corps ?",
    "ما الذي له رأس وذيل ولكن ليس له جسد؟",
    QuestionType.SINGLE,
    [
      { en: "Coin", fr: "Pièce de monnaie", ar: "عملة معدنية" },
      { en: "Snake", fr: "Serpent", ar: "ثعبان" },
      { en: "Worm", fr: "Ver", ar: "دودة" },
      { en: "Comet", fr: "Comète", ar: "مذنب" }
    ]
  ),
  createPuzzle(
    "What comes once in a minute, twice in a moment, but never in a thousand years?",
    "Qu'est-ce qui vient une fois par minute, deux fois par moment, mais jamais en mille ans ?",
    "ما الذي يأتي مرة في الدقيقة، ومرتين في اللحظة، ولكن لا يأتي أبداً في ألف سنة؟",
    QuestionType.SINGLE,
    [
      { en: "The letter M", fr: "La lettre M", ar: "حرف الميم" },
      { en: "Time", fr: "Le temps", ar: "الوقت" },
      { en: "Chance", fr: "La chance", ar: "الصدفة" },
      { en: "Lightning", fr: "La foudre", ar: "البرق" }
    ]
  ),
  createPuzzle(
    "David's father has three sons: Snap, Crackle, and...?",
    "Le père de David a trois fils : Snap, Crackle et... ?",
    "والد ديفيد لديه ثلاثة أبناء: سناب، كراكل، و...؟",
    QuestionType.SINGLE,
    [
      { en: "David", fr: "David", ar: "ديفيد" },
      { en: "Pop", fr: "Pop", ar: "بوب" },
      { en: "Mike", fr: "Mike", ar: "مايك" },
      { en: "Tom", fr: "Tom", ar: "توم" }
    ]
  ),
  createPuzzle(
    "What gets wet while drying?",
    "Qu'est-ce qui se mouille en séchant ?",
    "ما الذي يبتل أثناء التجفيف؟",
    QuestionType.SINGLE,
    [
      { en: "Towel", fr: "Serviette", ar: "منشفة" },
      { en: "Water", fr: "Eau", ar: "ماء" },
      { en: "Fish", fr: "Poisson", ar: "سمكة" },
      { en: "Sponge", fr: "Éponge", ar: "إسفنجة" }
    ]
  ),
  createPuzzle(
    "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish.",
    "J'ai des villes, mais pas de maisons. J'ai des montagnes, mais pas d'arbres. J'ai de l'eau, mais pas de poissons.",
    "لدي مدن، ولكن لا منازل. لدي جبال، ولكن لا أشجار. لدي ماء، ولكن لا أسماك.",
    QuestionType.SINGLE,
    [
      { en: "Map", fr: "Carte", ar: "خريطة" },
      { en: "Globe", fr: "Globe", ar: "مجسم أرضي" },
      { en: "Dream", fr: "Rêve", ar: "حلم" },
      { en: "Book", fr: "Livre", ar: "كتاب" }
    ]
  ),
  createPuzzle(
    "What belongs to you, but other people use it more than you?",
    "Qu'est-ce qui t'appartient, mais que les autres utilisent plus que toi ?",
    "ما الذي يخصك، ولكن الناس يستخدمونه أكثر منك؟",
    QuestionType.SINGLE,
    [
      { en: "Your Name", fr: "Ton Prénom", ar: "اسمك" },
      { en: "Your Money", fr: "Ton Argent", ar: "مالك" },
      { en: "Your Car", fr: "Ta Voiture", ar: "سيارتك" },
      { en: "Your House", fr: "Ta Maison", ar: "منزلك" }
    ]
  ),
  createPuzzle(
    "If you drop me I'm sure to crack, but give me a smile and I'll always smile back.",
    "Si tu me laisses tomber je casse, mais souris-moi et je te sourirai en retour.",
    "إذا أسقطتني سأنكسر بالتأكيد، لكن ابتسم لي وسأبتسم لك دائمًا.",
    QuestionType.SINGLE,
    [
      { en: "Mirror", fr: "Miroir", ar: "مرآة" },
      { en: "Egg", fr: "Oeuf", ar: "بيضة" },
      { en: "Glass", fr: "Verre", ar: "زجاج" },
      { en: "Phone", fr: "Téléphone", ar: "هاتف" }
    ]
  ),
  createPuzzle(
    "What goes up but never comes down?",
    "Qu'est-ce qui monte mais ne redescend jamais ?",
    "ما الذي يصعد ولا ينزل أبداً؟",
    QuestionType.SINGLE,
    [
      { en: "Age", fr: "L'âge", ar: "العمر" },
      { en: "Balloon", fr: "Ballon", ar: "بالون" },
      { en: "Smoke", fr: "Fumée", ar: "دخان" },
      { en: "Bird", fr: "Oiseau", ar: "طائر" }
    ]
  ),
  createPuzzle(
    "I am full of holes but still hold water.",
    "Je suis plein de trous mais je retiens encore l'eau.",
    "أنا مليء بالثقوب ولكني ما زلت أحمل الماء.",
    QuestionType.SINGLE,
    [
      { en: "Sponge", fr: "Éponge", ar: "إسفنجة" },
      { en: "Net", fr: "Filet", ar: "شبكة" },
      { en: "Bucket", fr: "Seau", ar: "دلو" },
      { en: "Cheese", fr: "Fromage", ar: "جبن" }
    ]
  ),
  createPuzzle(
    "What is always in front of you but can't be seen?",
    "Qu'est-ce qui est toujours devant toi mais ne peut être vu ?",
    "ما الذي يكون دائما أمامك ولكن لا يمكن رؤيته؟",
    QuestionType.SINGLE,
    [
      { en: "Future", fr: "Le Futur", ar: "المستقبل" },
      { en: "Air", fr: "L'air", ar: "الهواء" },
      { en: "Nose", fr: "Le nez", ar: "الأنف" },
      { en: "Glasses", fr: "Lunettes", ar: "النظارات" }
    ]
  ),
  createPuzzle(
    "What can you break, even if you never pick it up or touch it?",
    "Qu'est-ce que tu peux briser, même sans jamais le toucher ?",
    "ما الذي يمكنك كسره، حتى لو لم تلمسه أبداً؟",
    QuestionType.SINGLE,
    [
      { en: "Promise", fr: "Promesse", ar: "وعد" },
      { en: "Glass", fr: "Verre", ar: "زجاج" },
      { en: "Silence", fr: "Silence", ar: "صمت" },
      { en: "Record", fr: "Record", ar: "رقم قياسي" }
    ]
  ),
  createPuzzle(
    "I shave every day, but my beard stays the same. What am I?",
    "Je me rase tous les jours, mais ma barbe reste la même. Qui suis-je ?",
    "أحلق كل يوم، لكن لحيتي تبقى كما هي. من أنا؟",
    QuestionType.SINGLE,
    [
      { en: "Barber", fr: "Barbier", ar: "حلاق" },
      { en: "Lion", fr: "Lion", ar: "أسد" },
      { en: "Magic", fr: "Magicien", ar: "ساحر" },
      { en: "Razor", fr: "Rasoir", ar: "موس" }
    ]
  ),
  createPuzzle(
    "The person who makes it has no need of it; the person who buys it has no use for it.",
    "Celui qui le fabrique n'en a pas besoin; celui qui l'achète ne s'en sert pas.",
    "الشخص الذي يصنعه لا يحتاجه؛ والشخص الذي يشتريه لا يستخدمه.",
    QuestionType.SINGLE,
    [
      { en: "Coffin", fr: "Cercueil", ar: "تابوت" },
      { en: "Trash", fr: "Poubelle", ar: "قمامة" },
      { en: "Poison", fr: "Poison", ar: "سم" },
      { en: "Nothing", fr: "Rien", ar: "لا شيء" }
    ]
  ),
  createPuzzle(
    "What has to be broken before you can use it?",
    "Qu'est-ce qui doit être cassé avant de pouvoir l'utiliser ?",
    "ما الذي يجب كسره قبل أن تتمكن من استخدامه؟",
    QuestionType.SINGLE,
    [
      { en: "Egg", fr: "Oeuf", ar: "بيضة" },
      { en: "Glowstick", fr: "Bâton lumineux", ar: "عصا مضيئة" },
      { en: "Promise", fr: "Promesse", ar: "وعد" },
      { en: "Code", fr: "Code", ar: "شفرة" }
    ]
  ),
  createPuzzle(
    "I’m tall when I’m young, and I’m short when I’m old.",
    "Je suis grand quand je suis jeune, et petit quand je suis vieux.",
    "أنا طويل عندما أكون صغيراً، وقصير عندما أكبر.",
    QuestionType.SINGLE,
    [
      { en: "Candle", fr: "Bougie", ar: "شمعة" },
      { en: "Tree", fr: "Arbre", ar: "شجرة" },
      { en: "Pencil", fr: "Crayon", ar: "قلم رصاص" },
      { en: "Man", fr: "Homme", ar: "رجل" }
    ]
  ),
  createPuzzle(
    "What represents the number 0 but implies everything?",
    "Qu'est-ce qui représente le chiffre 0 mais implique tout ?",
    "ما الذي يمثل الرقم 0 ولكنه يعني كل شيء؟",
    QuestionType.SINGLE,
    [
      { en: "Circle", fr: "Cercle", ar: "دائرة" },
      { en: "Void", fr: "Vide", ar: "فراغ" },
      { en: "Space", fr: "Espace", ar: "فضاء" },
      { en: "Time", fr: "Temps", ar: "وقت" }
    ]
  ),
  createPuzzle(
    "Which month has 28 days?",
    "Quel mois a 28 jours ?",
    "أي شهر يحتوي على 28 يوماً؟",
    QuestionType.SINGLE,
    [
      { en: "All of them", fr: "Tous", ar: "كلهم" },
      { en: "February", fr: "Février", ar: "فبراير" },
      { en: "None", fr: "Aucun", ar: "لا أحد" },
      { en: "January", fr: "Janvier", ar: "يناير" }
    ]
  ),

  // Short Text Scenario (10)
  createPuzzle(
    "If you were invisible for a day, what's provided first?",
    "Si tu étais invisible pour un jour, que ferais-tu en premier ?",
    "لو كنت غير مرئي ليوم واحد، ماذا تفعل أولاً؟",
    QuestionType.TEXT
  ),
  createPuzzle(
    "Train A leaves north, Train B leaves south. When do they meet?",
    "Train A part au nord, Train B au sud. Quand se croisent-ils ?",
    "القطار أ يتجه شمالاً، القطار ب جنوباً. متى يتقابلان؟",
    QuestionType.TEXT
  ),
  createPuzzle(
    "If 5 machines take 5 minutes to make 5 widgets, how long for 100 machines for 100 widgets?",
    "Si 5 machines prennent 5 min pour 5 objets, combien pour 100 machines pour 100 objets ?",
    "إذا استغرقت 5 آلات 5 دقائق لصنع 5 قطع، فكم تستغرق 100 آلة لصنع 100 قطعة؟",
    QuestionType.TEXT
  ),
  createPuzzle(
    "A bat and a ball cost $1.10. The bat costs $1.00 more than the ball. How much is the ball?",
    "Une batte et une balle coûtent 1,10$. La batte coûte 1,00$ de plus que la balle. Prix de la balle ?",
    "مضرب وكرة يكلفان 1.10 دولار. المضرب يكلف 1.00 دولار أكثر من الكرة. كم ثمن الكرة؟",
    QuestionType.TEXT
  ),
  createPuzzle(
    "Forward I am heavy, backward I am not. What am I?",
    "En avant je suis lourd, en arrière je ne le suis pas. Qui suis-je ?",
    "إلى الأمام أنا ثقيل، وإلى الخلف لست كذلك. من أنا؟",
    QuestionType.TEXT
  ),
  createPuzzle(
    "What 5-letter word becomes shorter when you add two letters to it?",
    "Quel mot de 5 lettres devient plus court quand on y ajoute deux lettres ?",
    "ما هي الكلمة (بالإنجليزية) المكونة من 5 أحرف وتصبح أقصر عند إضافة حرفين؟",
    QuestionType.TEXT
  ),
  createPuzzle(
    "You see a boat filled with people, yet there is not a single person on board. How?",
    "Tu vois un bateau plein de gens, pourtant il n'y a pas une seule personne à bord. Comment ?",
    "ترى قارباً مليئاً بالناس، ومع ذلك لا يوجد شخص واحد (أعزب) على متنه. كيف؟",
    QuestionType.TEXT
  ),
  createPuzzle(
    "What starts with T, ends with T, and has T in it?",
    "Qu'est-ce qui commence par T, finit par T et contient T ?",
    "ما الذي يبدأ بـ T وينتهي بـ T ويحتوي على T؟",
    QuestionType.TEXT
  ),
  createPuzzle(
    "Where does today come before yesterday?",
    "Où est-ce qu'aujourd'hui vient avant hier ?",
    "أين يأتي اليوم قبل الأمس؟",
    QuestionType.TEXT
  ),
  createPuzzle(
    "What has 13 hearts but no other organs?",
    "Qu'est-ce qui a 13 coeurs mais aucun autre organe ?",
    "ما الذي له 13 قلباً ولا أعضاء أخرى؟",
    QuestionType.TEXT
  ),

  // Long Text Problem Solving (10)
  createPuzzle(
    "Explain the color blue to a blind person.",
    "Explique la couleur bleue à un aveugle.",
    "اشرح اللون الأزرق لشخص كفيف.",
    QuestionType.TEXTAREA
  ),
  createPuzzle(
    "How would you escape a locked room with no windows and only a table?",
    "Comment t'échappes-tu d'une pièce fermée sans fenêtre avec juste une table ?",
    "كيف تهرب من غرفة مقفلة بلا نوافذ وبها طاولة فقط؟",
    QuestionType.TEXTAREA
  ),
  createPuzzle(
    "Design a better umbrella.",
    "Conçois un meilleur parapluie.",
    "صمم مظلة أفضل.",
    QuestionType.TEXTAREA
  ),
  createPuzzle(
    "If animals could talk, which would be the rudest?",
    "Si les animaux parlaient, lequel serait le plus impoli ?",
    "لو كانت الحيوانات تتكلم، أيها سيكون الأكثر وقاحة؟",
    QuestionType.TEXTAREA
  ),
  createPuzzle(
    "How many piano tuners are there in New York? (Estimation)",
    "Combien d'accordeurs de piano à New York ? (Estimation)",
    "كم عدد ضابطي البيانو في نيويورك؟ (تقدير)",
    QuestionType.TEXTAREA
  ),
  createPuzzle(
    "How would you sell ice in Antarctica?",
    "Comment vendrais-tu de la glace en Antarctique ?",
    "كيف تبيع الثلج في القارة القطبية الجنوبية؟",
    QuestionType.TEXTAREA
  ),
  createPuzzle(
    "If you could change one law of physics, what would it be?",
    "Si tu pouvais changer une loi de la physique ?",
    "لو استطعت تغيير قانون فيزيائي واحد، ماذا سيكون؟",
    QuestionType.TEXTAREA
  ),
  createPuzzle(
    "Describe the internet to someone from the 1800s.",
    "Décris internet à quelqu'un des années 1800.",
    "صف الإنترنت لشخص من القرن التاسع عشر.",
    QuestionType.TEXTAREA
  ),
  createPuzzle(
    "Solve the trolley problem: 1 person you love vs 5 strangers.",
    "Dilemme du tramway : 1 personne aimée vs 5 inconnus.",
    "حل معضلة الترام: شخص تحبه مقابل 5 غرباء.",
    QuestionType.TEXTAREA
  ),
  createPuzzle(
    "Create a new holiday. What is it for?",
    "Crée une nouvelle fête. C'est pour quoi ?",
    "ابتكر عطلة جديدة. لماذا هي؟",
    QuestionType.TEXTAREA
  ),
];