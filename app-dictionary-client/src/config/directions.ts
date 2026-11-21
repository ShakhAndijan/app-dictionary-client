import { Ionicons } from '@expo/vector-icons';

export interface ModuleDef {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub: string;
  ready: boolean;
  /** Shown but cannot be switched on yet. */
  locked?: boolean;
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
      { key: 'words', icon: 'book', title: "So'z qo'shish", sub: "O'z so'zlaringizni qo'shing va mashq qilib takrorlang", ready: true },
      { key: 'course', icon: 'school', title: 'Ingliz tili kursi', sub: "A1 dan C1 gacha darslar, mashqlar va daraja imtihonlari", ready: true },
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
      { key: 'frontend', icon: 'color-palette', title: 'Frontend', sub: 'Internet, HTML, CSS, JavaScript va React: junior dan senior gacha', ready: true },
      { key: 'backend', icon: 'server', title: 'Backend', sub: 'Serverlar, bazalar va API', ready: false, locked: true },
    ],
  },
];

/** The modules a user has when they never chose: the words practice everyone had before. */
export const DEFAULT_MODULES = ['words'];
