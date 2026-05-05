
// ---------------------------------------------------------------------------
// TypeScript interfaces
// ---------------------------------------------------------------------------

export interface PizzaStyle {
  id: string;
  name: string;
  region: string;
  /** Short sub-label shown under the name */
  sub: string;
  /** Hydration % */
  hyd: number;
  /** Ball weight in grams */
  balls: number;
  /** Salt % */
  salt: number;
  /** Oil % */
  oil: number;
  /** Sugar % */
  sugar: number;
  /** Total fermentation hours */
  ferment: number;
  /** Fermentation temperature °C */
  temp: number;
  /** Characteristic description */
  char: string;
  /** Key baking temperature range */
  keyTemp: string;
  /** Key baking time range */
  keyTime: string;
  /** Accent hex color for this style */
  color: string;
}

export interface Recipe {
  id: string;
  name: string;
  /** References PizzaStyle.id */
  style: string;
  /** Prep time in minutes */
  time: number;
  level: string;
  /** Comma-separated ingredient tags */
  tag: string;
  /** 1–5 star rating */
  stars: number;
}

export interface Tip {
  id: string;
  /** Short title */
  t: string;
  /** Detail explanation */
  d: string;
}

export interface FermentPhase {
  name: string;
  /** Sub-label with duration/temp */
  sub: string;
  /** Start time in hours from t=0 */
  t: number;
  /** Duration in hours */
  dur: number;
}

// ---------------------------------------------------------------------------
// Baker's % formula
// ---------------------------------------------------------------------------

export interface DoughCalcInput {
  pizzas: number;
  ballSize: number;
  hyd: number;
  salt: number;
  oil: number;
  ferment: number;
}

export interface DoughCalcResult {
  flour: number;
  water: number;
  saltG: number;
  oilG: number;
  yeast: number;
  totalDough: number;
}

export function calcDough(input: DoughCalcInput): DoughCalcResult {
  const { pizzas, ballSize, hyd, salt, oil, ferment } = input;
  const totalDough = pizzas * ballSize;
  const factor = 100 + hyd + salt + oil + 0.1;
  const flour = Math.round(totalDough / (factor / 100));
  const water = Math.round(flour * (hyd / 100));
  const saltG = Math.round(flour * (salt / 100) * 10) / 10;
  const oilG = Math.round(flour * (oil / 100) * 10) / 10;
  const yeast = Math.max(
    0.05,
    Math.round(flour * (0.4 / Math.sqrt(ferment)) * 100) / 100,
  );
  return { flour, water, saltG, oilG, yeast, totalDough };
}

// ---------------------------------------------------------------------------
// Pizza styles
// ---------------------------------------------------------------------------

export const PIZZA_STYLES: PizzaStyle[] = [
  {
    id: 'napoletana',
    name: 'Napoletana',
    region: 'Naples',
    sub: 'AVPN · 60s · 450°C',
    hyd: 65,
    balls: 250,
    salt: 2.8,
    oil: 0,
    sugar: 0,
    ferment: 24,
    temp: 4,
    char: 'Cornicione alto, leopardatura, base hidratada',
    keyTemp: '430–480°C',
    keyTime: '60–90s',
    color: '#C45A2A',
  },
  {
    id: 'newyork',
    name: 'New York',
    region: 'USA',
    sub: 'Slice · 4–5min · 290°C',
    hyd: 62,
    balls: 280,
    salt: 2.5,
    oil: 2,
    sugar: 1.5,
    ferment: 48,
    temp: 4,
    char: 'Crujiente, fina, plegable',
    keyTemp: '275–315°C',
    keyTime: '4–6min',
    color: '#D4884A',
  },
  {
    id: 'romana',
    name: 'Romana',
    region: 'Rome',
    sub: 'Tonda · Cracker base',
    hyd: 57,
    balls: 180,
    salt: 2.5,
    oil: 4,
    sugar: 0,
    ferment: 24,
    temp: 4,
    char: 'Fina, crocante tipo cracker',
    keyTemp: '300°C',
    keyTime: '5min',
    color: '#C8A060',
  },
  {
    id: 'detroit',
    name: 'Detroit',
    region: 'Michigan',
    sub: 'Pan · Cheese-edge',
    hyd: 70,
    balls: 350,
    salt: 2.0,
    oil: 1.5,
    sugar: 1,
    ferment: 18,
    temp: 4,
    char: 'Cuadrada, focaccia-like, queso caramelo',
    keyTemp: '260°C',
    keyTime: '12–14min',
    color: '#B84A28',
  },
  {
    id: 'pala',
    name: 'al Taglio',
    region: 'Rome',
    sub: 'Pala · alta hidratación',
    hyd: 80,
    balls: 500,
    salt: 2.2,
    oil: 3,
    sugar: 0,
    ferment: 48,
    temp: 4,
    char: 'Esponjosa, alveolada, larga',
    keyTemp: '250°C',
    keyTime: '15min',
    color: '#B8A060',
  },
];

// ---------------------------------------------------------------------------
// Recipes
// ---------------------------------------------------------------------------

export const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Margherita Verace',
    style: 'napoletana',
    time: 30,
    level: 'Clásica',
    tag: 'Tomate · Mozzarella · Albahaca',
    stars: 5,
  },
  {
    id: '2',
    name: 'Marinara Antica',
    style: 'napoletana',
    time: 25,
    level: 'Clásica',
    tag: 'Tomate · Ajo · Orégano',
    stars: 5,
  },
  {
    id: '3',
    name: 'Pepperoni NY',
    style: 'newyork',
    time: 35,
    level: 'Casual',
    tag: 'Pepperoni · Mozzarella low-moist',
    stars: 4,
  },
  {
    id: '4',
    name: 'Diavola Picante',
    style: 'napoletana',
    time: 30,
    level: 'Clásica',
    tag: 'Salami picante · Mozzarella',
    stars: 4,
  },
  {
    id: '5',
    name: 'Quattro Formaggi',
    style: 'romana',
    time: 28,
    level: 'Premium',
    tag: 'Mozz · Gorgonzola · Parmesano · Taleggio',
    stars: 5,
  },
  {
    id: '6',
    name: 'Detroit Red Top',
    style: 'detroit',
    time: 45,
    level: 'Avanzada',
    tag: 'Brick cheese · Salsa encima',
    stars: 4,
  },
];

// ---------------------------------------------------------------------------
// Tips
// ---------------------------------------------------------------------------

export const TIPS: Tip[] = [
  {
    id: '1',
    t: 'La sal va al final',
    d: 'Añade la sal después de hidratar la harina. Inhibe la levadura si entran en contacto directo.',
  },
  {
    id: '2',
    t: 'Bench rest = 20 min',
    d: 'Descanso entre el bulk y el bolado. Relaja el gluten y facilita formar bolas tensas.',
  },
  {
    id: '3',
    t: 'Cold ferment > 48h',
    d: 'Maximiza sabor, extensibilidad del gluten, leopardatura y digestibilidad.',
  },
  {
    id: '4',
    t: 'Stretch from center',
    d: 'Empuja el aire hacia el cornicione. Nunca uses rodillo en napolitana.',
  },
];

// ---------------------------------------------------------------------------
// Fermentation timeline phases
// ---------------------------------------------------------------------------

export const FERMENT_PHASES: FermentPhase[] = [
  {
    name: 'Mezcla',
    sub: 'autólisis 30min',
    t: 0,
    dur: 0.5,
  },
  {
    name: 'Bulk a TA',
    sub: '2h @ 22°C',
    t: 0.5,
    dur: 2,
  },
  {
    name: 'Cold ferment',
    sub: '20h @ 4°C',
    t: 2.5,
    dur: 20,
  },
  {
    name: 'Bench rest',
    sub: '1h a TA',
    t: 22.5,
    dur: 1,
  },
  {
    name: 'Bolado · final proof',
    sub: '30min',
    t: 23.5,
    dur: 0.5,
  },
];
