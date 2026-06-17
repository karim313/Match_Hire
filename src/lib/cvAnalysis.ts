function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export function parseSkills(source: Record<string, unknown> = {}): string[] {
  const analysis = (source.analysis as Record<string, unknown>) || {};
  const raw =
    (source.extractedWords as Record<string, unknown>)?.skills ??
    source.skills ??
    analysis.skills;

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return Array.isArray(raw) ? raw : [];
}

export function parseSuggestedJobs(source: Record<string, unknown> = {}): Record<string, unknown>[] {
  const analysis = (source.analysis as Record<string, unknown>) || {};
  const raw =
    source.suggestedJobs ??
    source.suggested_jobs ??
    source.jobs ??
    source.jobSuggestions ??
    source.matchedJobs ??
    source.jobMatches ??
    analysis.suggestedJobs ??
    analysis.suggested_jobs ??
    analysis.jobs;

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return Array.isArray(raw) ? raw : [];
}

/** Read match % from analyze-and-suggest-jobs / stored CV analysis payload */
export function extractMatchPercent(
  source: Record<string, unknown> = {},
  skills: string[] = parseSkills(source),
  jobs: Record<string, unknown>[] = parseSuggestedJobs(source)
): number | null {
  const analysis = (source.analysis as Record<string, unknown>) || {};

  const direct =
    toNumber(source.matchPercentage) ??
    toNumber(source.matchPercent) ??
    toNumber(source.score) ??
    toNumber(source.compatibilityScore) ??
    toNumber(source.compatibility) ??
    toNumber(analysis.matchPercentage) ??
    toNumber(analysis.matchPercent) ??
    toNumber(analysis.score) ??
    toNumber(analysis.compatibilityScore);

  if (direct !== null) return clampPercent(direct);

  const jobScores = jobs
    .map(
      (job) =>
        toNumber(job.matchPercentage) ??
        toNumber(job.matchPercent) ??
        toNumber(job.score) ??
        toNumber(job.compatibility)
    )
    .filter((score): score is number => score !== null);

  if (jobScores.length > 0) {
    const average = jobScores.reduce((sum, score) => sum + score, 0) / jobScores.length;
    return clampPercent(average);
  }

  if (skills.length === 0 && jobs.length === 0) return null;

  const skillScore = Math.min(skills.length / 15, 1) * 70;
  const jobScore = Math.min(jobs.length / 10, 1) * 30;
  return clampPercent(skillScore + jobScore);
}

export function getJobMatchPercent(job: Record<string, unknown>): number | null {
  const score =
    toNumber(job.matchPercentage) ??
    toNumber(job.matchPercent) ??
    toNumber(job.score) ??
    toNumber(job.compatibility);

  return score !== null ? clampPercent(score) : null;
}
