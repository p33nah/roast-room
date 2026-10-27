export const DISCLAIMER = "Simulated advisors built from each person's public work. They are not the people and do not speak for them.";

export function optionScores(st, round) {
  const out = {};
  for (const option of st.options) {
    let weightedTotal = 0;
    let totalWeight = 0;
    const parts = [];
    for (const key of st.seats) {
      const value = st.cards[round][key]?.parsed.optionScores[option.id];
      const weight = st.weights[key].weight;
      if (typeof value === "number") {
        weightedTotal += weight * value;
        totalWeight += weight;
        parts.push(`${weight}x${value}`);
      }
    }
    out[option.id] = {
      score: totalWeight ? Math.round((weightedTotal / totalWeight) * 10) / 10 : null,
      math: totalWeight ? `(${parts.join(" + ")}) / ${totalWeight}` : "",
    };
  }
  return out;
}

/** Compute the score summary from the last completed round's advisor cards. */
export function finalNumbers(st) {
  const last = st.rounds.at(-1);
  const finalScores = st.scores[last] || optionScores(st, last);
  const recommended = Object.entries(finalScores).sort((a, b) => (b[1].score ?? 0) - (a[1].score ?? 0))[0]?.[0];
  const optionVotes = st.seats.map((key) => st.cards[last][key]?.parsed.optionScores[recommended]).filter((value) => typeof value === "number");
  const confidences = st.seats.map((key) => st.cards[2][key]?.parsed.confidence ?? st.cards[1][key]?.parsed.confidence).filter((value) => typeof value === "number");
  const spreadF = optionVotes.length ? Math.max(...optionVotes) - Math.min(...optionVotes) : 0;
  const confidence = confidences.length
    ? Math.max(1, Math.min(10, Math.round((confidences.reduce((sum, value) => sum + value, 0) / confidences.length) * 2) - (spreadF >= 5 ? 1 : 0)))
    : null;
  const support = last === 3 ? (() => {
    let weightedTotal = 0;
    let totalWeight = 0;
    for (const key of st.seats) {
      const value = st.cards[3][key]?.parsed.finalScore;
      if (typeof value === "number") {
        weightedTotal += value * st.weights[key].weight;
        totalWeight += st.weights[key].weight;
      }
    }
    return totalWeight ? Math.round((weightedTotal / totalWeight) * 10) / 10 : null;
  })() : null;
  const votes = last === 3 ? st.seats.reduce((counts, key) => {
    const vote = st.cards[3][key]?.parsed.vote || "endorse";
    counts[vote] = (counts[vote] || 0) + 1;
    return counts;
  }, {}) : null;
  return { last, finalScores, recommended, spreadF, confidence, support, votes };
}

export function verdictSeats(st, last) {
  return st.seats.map((key) => ({
    key,
    weight: st.weights[key].weight,
    stance: st.cards[last][key]?.parsed.vote || st.cards[2][key]?.parsed.stance,
    optionScores: st.cards[last][key]?.parsed.optionScores,
    pillar: st.cards[last][key]?.parsed.pillar ?? st.cards[2][key]?.parsed.pillar,
    moved: st.cards[2][key]?.parsed.moved,
    oneLine: st.cards[3][key]?.parsed.oneLine || st.cards[2][key]?.parsed.stance,
  }));
}
