function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * A fresh order for every attempt at a lesson: questions, answer options and word chips are mixed.
 * Questions that share one text or recording stay together, so the listening pages keep working.
 */
export function shuffleLesson<T extends { passage?: string | null; audioText?: string | null; options?: string[] | null; words?: string[] | null }>(items: T[]): T[] {
  const groups: T[][] = [];
  for (const item of items) {
    const last = groups[groups.length - 1];
    const shared = !!(item.passage || item.audioText);
    if (last && shared && last[0].passage === item.passage && last[0].audioText === item.audioText) last.push(item);
    else groups.push([item]);
  }
  return shuffle(groups).flatMap((group) =>
    shuffle(group).map((item) => ({
      ...item,
      ...(item.options ? { options: shuffle(item.options) } : {}),
      ...(item.words ? { words: shuffle(item.words) } : {}),
    })),
  );
}
