/** Lowercased, diacritic-free, punctuation-free text with single spaces between tokens. */
export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9\s]/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Collapses spellings that sound alike in Norwegian, so Theodor/Teodor,
 * Christian/Kristian and Nilssen/Nilsen share a key. Word-initial h is kept
 * to avoid merging distinct names like Anne og Hanne.
 */
function phoneticKey(token: string): string {
  return token
    .replace(/ph/g, "f")
    .replace(/ch/g, "k")
    .replace(/th/g, "t")
    .replace(/gh/g, "g")
    .replace(/ck/g, "k")
    .replace(/qu/g, "kv")
    .replace(/[cq]/g, "k")
    .replace(/z/g, "s")
    .replace(/w/g, "v")
    .replace(/x/g, "ks")
    .replace(/(?!^)h/g, "")
    .replace(/(.)\1+/g, "$1");
}

function maxEdits(token: string): number {
  if (token.length <= 3) return 0;
  if (token.length <= 6) return 1;
  return 2;
}

/**
 * Damerau-Levenshtein distance from `query` to the closest prefix of `target`,
 * so a half-typed name still matches. Returns null when the distance exceeds
 * `maxDistance`.
 */
function prefixDistance(
  query: string,
  target: string,
  maxDistance: number,
): number | null {
  if (query.length === 0) return 0;
  if (query.length - target.length > maxDistance) return null;

  let beforePrevious: number[] = [];
  let previous = Array.from({ length: target.length + 1 }, (_, j) => j);

  for (let i = 1; i <= query.length; i++) {
    const current = new Array<number>(target.length + 1);
    current[0] = i;
    let rowMin = i;

    for (let j = 1; j <= target.length; j++) {
      const cost = query[i - 1] === target[j - 1] ? 0 : 1;
      let value = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + cost,
      );
      if (
        i > 1 &&
        j > 1 &&
        query[i - 1] === target[j - 2] &&
        query[i - 2] === target[j - 1]
      ) {
        value = Math.min(value, beforePrevious[j - 2] + 1);
      }
      current[j] = value;
      if (value < rowMin) rowMin = value;
    }

    if (rowMin > maxDistance) return null;
    beforePrevious = previous;
    previous = current;
  }

  const best = Math.min(...previous);
  return best <= maxDistance ? best : null;
}

function tokenScore(queryToken: string, targetToken: string): number | null {
  if (targetToken === queryToken) return 100;
  if (targetToken.startsWith(queryToken)) return 90;
  if (targetToken.includes(queryToken)) return 75;

  const queryKey = phoneticKey(queryToken);
  const targetKey = phoneticKey(targetToken);
  // Short keys ("zzz" collapses to "s") match far too much to be useful.
  const usePhonetics = queryKey.length >= 3;

  if (usePhonetics) {
    if (targetKey === queryKey) return 70;
    if (targetKey.startsWith(queryKey)) return 65;
  }

  const distance = prefixDistance(
    queryToken,
    targetToken,
    maxEdits(queryToken),
  );
  if (distance !== null) return 60 - distance * 12;

  if (usePhonetics) {
    const keyDistance = prefixDistance(queryKey, targetKey, maxEdits(queryKey));
    if (keyDistance !== null) return 50 - keyDistance * 12;
  }

  return null;
}

/**
 * Higher is better; null when `target` is not a plausible match for `query`.
 * Every query token must match some token in the target.
 */
export function fuzzyScore(query: string, target: string): number | null {
  const normalizedQuery = normalizeSearchText(query);
  if (normalizedQuery === "") return 0;

  const normalizedTarget = normalizeSearchText(target);
  const targetTokens = normalizedTarget.split(" ");

  let total = 0;
  for (const queryToken of normalizedQuery.split(" ")) {
    let best: number | null = null;
    for (const targetToken of targetTokens) {
      const score = tokenScore(queryToken, targetToken);
      if (score !== null && (best === null || score > best)) best = score;
    }
    if (best === null) return null;
    total += best;
  }

  const average = total / normalizedQuery.split(" ").length;
  if (normalizedTarget.startsWith(normalizedQuery)) return average + 15;
  if (normalizedTarget.includes(normalizedQuery)) return average + 8;
  return average;
}

/** Items matching `query` fuzzily, best match first. A blank query keeps the original order. */
export function fuzzySearch<T>(
  items: T[],
  query: string,
  getText: (item: T) => string,
): T[] {
  if (normalizeSearchText(query) === "") return items;

  const scored: { item: T; score: number; text: string }[] = [];
  for (const item of items) {
    const text = getText(item);
    const score = fuzzyScore(query, text);
    if (score !== null) scored.push({ item, score, text });
  }

  return scored
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.text.length - b.text.length ||
        a.text.localeCompare(b.text, "nb"),
    )
    .map((entry) => entry.item);
}
