import { Ionicons } from '@expo/vector-icons';

export interface ModuleDef {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
  ready: boolean;
}

export interface DirectionDef {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
  color: string;
  modules: ModuleDef[];
}

/** What can be studied. A module is switched on in the profile and then shows up in the tab bar. */
export const DIRECTIONS: DirectionDef[] = [
  {
    key: 'english',
    icon: 'language',
    title: 'Ingliz tili',
    sub: "So'zlar, kurs va imtihonga tayyorgarlik",
    color: '#4F46E5',
    modules: [
      { key: 'words', icon: 'book', title: "So'z qo'shish", sub: "O'z so'zlaringizni qo'shing, mashq qiling va ingliz tili kursidan o'ting", ready: true },
      { key: 'ielts', icon: 'ribbon', title: 'IELTS', sub: 'Imtihonga tayyorgarlik: reading, listening, writing, speaking', ready: false },
    ],
  },
  {
    key: 'programming',
    icon: 'code-slash',
    title: 'Dasturlash',
    sub: 'Noldan kasbgacha',
    color: '#0EA5E9',
    modules: [
      { key: 'html', icon: 'logo-html5', title: 'HTML', sub: 'Sahifa tuzilishi: teglar, formalar, semantika', ready: false },
      { key: 'css', icon: 'logo-css3', title: 'CSS', sub: 'Dizayn: layout, flex, grid, animatsiya', ready: false },
      { key: 'javascript', icon: 'logo-javascript', title: 'JavaScript', sub: 'Dasturlash tili: mantiq, DOM, asinxron kod', ready: false },
      { key: 'react', icon: 'logo-react', title: 'React', sub: 'Komponentlar, holat va zamonaviy interfeyslar', ready: false },
    ],
  },
];

/** The modules a user has when they never chose: the words practice everyone had before. */
export const DEFAULT_MODULES = ['words'];
