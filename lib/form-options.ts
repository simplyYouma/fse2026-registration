export const REGISTRATION_TYPES = [
  "Student Member",
  "Student Non-Member",
  "ACM Member",
  "ACM Non-Member",
  "Sponsor",
  "Speaker / Author",
];

export const COUNTRIES = [
  "Mali", "Senegal", "Côte d'Ivoire", "Burkina Faso", "Guinea", "Niger", "Benin",
  "Togo", "Ghana", "Nigeria", "Cameroon", "Morocco", "Algeria", "Tunisia",
  "Egypt", "South Africa", "Kenya", "Ethiopia", "Rwanda",
  "France", "Belgium", "Switzerland", "Germany", "United Kingdom", "Spain",
  "Italy", "Netherlands", "Portugal", "Sweden", "Norway", "Denmark", "Finland",
  "Poland", "Austria",
  "United States", "Canada", "Mexico", "Brazil", "Argentina",
  "China", "Japan", "South Korea", "India", "Indonesia", "Iran", "Iraq",
  "Iceland", "Ireland", "Australia", "New Zealand",
  "Other",
];

export const REGIONS = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

export const DIETARY_OPTIONS = [
  "None",
  "Dairy/Lactose Free",
  "No Pork",
  "Vegan",
  "Gluten Free",
  "Nut Free",
  "Vegetarian",
  "Other",
];

export const BIRTH_YEAR_OPTIONS = [
  "2001 or later",
  "1981 - 2000",
  "1965 - 1980",
  "1946 - 1964",
  "1945 or earlier",
  "Prefer not to disclose",
];

export const ETHNIC_ORIGIN_OPTIONS = [
  "Western Europe",
  "Eastern Europe",
  "North Africa",
  "Sub-Saharan Africa",
  "West Asia / Middle East",
  "South and Southeast Asia",
  "East and Central Asia",
  "Pacific / Oceania",
  "North America",
  "Central America and Caribbean",
  "South America",
];

export const RACE_OPTIONS = [
  "Asian (e.g., Indian, Chinese, Japanese, Korean, Singaporean)",
  "Pacific Islander (e.g., New Zealand Maori, Samoan, Native Hawaiian)",
  "Indigenous (e.g., North American Cherokee, South American Quechua, Aboriginal, or Torres Strait Islander)",
  "Middle Eastern or North African",
  "Black",
  "Hispanic or Latino/a/x",
  "White",
];

export const REGISTRATION_ITEMS = [
  { id: "main", label: "Main Conference", price: 740, desc: "Full main conference access" },
  { id: "aiware-fse-combo", label: "AIWARE+FSE Combo", price: 1340, desc: "AIWARE+FSE Combo - Include a AIWARE banquet and FSE banquet" },
  { id: "aiware-only", label: "AIWARE Conference ONLY", price: 650, desc: "AIWARE Conference ONLY - Include a AIWARE banquet" },
  { id: "co-located-only", label: "Co-Located Conference ONLY", price: 500, desc: "Co-Located Conference ONLY (SECDEV) - No Banquet" },
  { id: "one-day-jul5", label: "One-Day Co-Located Event/Conference (July 5)", price: 250, desc: "One-Day Co-Located Event/Conference (July 5)" },
  { id: "one-day-jul6", label: "One-Day Co-Located Event/Conference (July 6)", price: 250, desc: "One-Day Co-Located Event/Conference (July 6)" },
  { id: "sigsoft-50", label: "SIGSOFT 50 Celebration Pass", price: 250, desc: "SIGSOFT 50 Celebration Pass" },
  { id: "sponsor", label: "Every Day Registration (Sponsor Only)", price: 900, desc: "Sponsor full event access" },
];

export const ADD_ONS = [
  { id: "co-located-add", label: "Co-Located Conference ONLY Add On", price: 500 },
  { id: "one-day-jul5-add", label: "One-Day Co-Located Event/Conference Add On (July 5)", price: 250 },
  { id: "one-day-jul6-add", label: "One-Day Co-Located Event/Conference Add On (July 6)", price: 250 },
  { id: "sigsoft-50-add", label: "SIGSOFT 50 Celebration Pass Add On", price: 250 },
  { id: "dinner-banquet", label: "Dinner Banquet Ticket (on a Private Cruise)", price: 165, full: true },
];

export type Workshop = { id: string; acronym: string; name: string; url?: string; date?: string };

export const WORKSHOPS: Workshop[] = [
  { id: "ASQAP", acronym: "ASQAP", name: "Autonomous System Quality Assurance and Prediction with Digital Twins", url: "https://asqap.github.io/asqap2026/", date: "July 5-6, 2026" },
  { id: "SEGA", acronym: "SEGA", name: "Software Engineering for Generative Art", url: "https://sega-workshop.github.io/2026/", date: "July 6, 2026" },
  { id: "FaSE4Games", acronym: "FaSE4Games", name: "Foundations of Applied Software Engineering for Games", url: "https://fase4games.quest", date: "July 6, 2026" },
  { id: "RSE", acronym: "RSE", name: "Responsible Software Engineering", url: "https://sites.google.com/view/responsiblese2026/about", date: "July 6, 2026" },
  { id: "DevOpsSustain", acronym: "DevOpsSustain", name: "DevOps for Sustainability", url: "https://devopssustain.github.io/ws2026/", date: "TBA — see website" },
  { id: "LLMSC", acronym: "LLMSC", name: "Large Language Model Supply Chain Analysis", url: "https://llmsc.github.io/", date: "July 5, 2026" },
  { id: "SEE-AIT", acronym: "SEE-AIT", name: "Software Engineering for the GenAI Transformation", url: "https://seeait.github.io/", date: "July 5, 2026" },
  { id: "IntersectionalitySE", acronym: "IntersectionalitySE", name: "Intersectionality and Software Engineering", url: "https://intersectionalitywork.github.io/", date: "TBA — see website" },
  { id: "CauSE", acronym: "CauSE", name: "Causal Methods in Software Engineering", url: "https://causality-software-engineering.github.io/cause-workshop-2026/", date: "TBA — see website" },
  { id: "LLMTrust", acronym: "LLMTrust", name: "Software Engineering for and with Trustworthy LLMs", url: "https://llmtrust2026.github.io/", date: "July 5 or 6, 2026" },
  { id: "DISE", acronym: "DISE", name: "Data Intensive Software Engineering", url: "https://seed-vt.github.io/dise/", date: "July 5, 2026" },
  { id: "SE4ES", acronym: "SE4ES", name: "Software Engineering for Engineering Simulations & Simulation Engineering", url: "https://se4es.uibk.ac.at", date: "July 6, 2026 (afternoon)" },
  { id: "SE4ADS", acronym: "SE4ADS'26", name: "Software Engineering for Autonomous Driving Systems", url: "https://sora.ics.uci.edu/se4ads_26/", date: "TBA — see website" },
  { id: "HumanAISE", acronym: "HumanAISE", name: "Human-Centered AI for Software Engineering", url: "https://humanai4se.github.io/", date: "July 5, 2026" },
  { id: "QSE-NE", acronym: "QSE-NE", name: "Quantum Software Engineering: The Next Evolution", url: "https://sites.google.com/view/qse-ne-fse26/home", date: "TBA — see website" },
];

export const OTHER_ONE_DAY_EVENTS = [
  "Tutorial (July 5)",
  "Tutorial (July 6)",
  "New Faculty Symposium",
  "Doctoral Symposium",
  "FSE-AIWare Competition",
  "None (I am not attending any one-day co-located event.)",
];

export const ACM_DISABILITY_TYPES = [
  "Deaf/deaf or have serious difficulty hearing",
  "Blind or have serious difficulty seeing, even when wearing glasses",
  "Mobility limitation including serious difficulty walking or climbing stairs",
  "Motor limitation including manual dexterity",
  "Learning disability",
  "Neurodiverse",
  "Speech or language impairment",
  "Chronic illness that is neurological, physical, or a mental health diagnosis",
  "Temporary impairment",
  "Other type of disability",
];

export const FSE_TRACKS = [
  "Research Track", "Industry Track", "Demonstrations", "Tool Demos",
  "Doctoral Symposium", "New Ideas", "Replications", "Other",
];

export const CO_LOCATED_CONFERENCES = [
  "AIware (please ensure you have registered for AIware or AIware + FSE combo)",
  "PROMISE",
  "SECDEV",
  "SSBSE",
  "None (I am not attending any co-located conference.)",
];
