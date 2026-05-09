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

export const ONE_DAY_EVENTS = [
  "ASQAP", "SEGA", "FaSE4Games", "RSE", "DevOpsSustain", "LLMSC",
  "SEE-AIT", "IntersectionalitySE", "LLMThrust", "DISE", "SE4ES",
  "HumanAISE", "QSE-NE", "Tutorial (July 5)", "Tutorial (July 6)",
  "New Faculty Symposium", "Doctoral Symposium", "FSE-AIWare Competition",
  "None (I am not attending any one-day co-located event.)",
];

export const CO_LOCATED_CONFERENCES = [
  "AIware (please ensure you have registered for AIware or AIware + FSE combo)",
  "PROMISE",
  "SECDEV",
  "SSBSE",
  "None (I am not attending any co-located conference.)",
];
