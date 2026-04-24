import { listAssessmentResponses } from '@/lib/persistence';
import { SERVITIZATION_STAGES } from '@/lib/data/fit-check';
import { DiagnosticShell } from '@/components/fit-check/diagnostic-chrome';

export const dynamic = 'force-dynamic';

interface AdminResponsesPageProps {
  searchParams?: {
    recommended_stage?: string;
    target_industry?: string;
  };
}

export default async function AdminResponsesPage({
  searchParams,
}: AdminResponsesPageProps) {
  const recommendedStage = searchParams?.recommended_stage ?? '';
  const targetIndustry = searchParams?.target_industry ?? '';

  const { data: responses, error } = await listAssessmentResponses({
    recommendedStage: recommendedStage || undefined,
    targetIndustry: targetIndustry || undefined,
  });

  const emailCount = responses.filter((response) => Boolean(response.email)).length;
  const stageCounts = SERVITIZATION_STAGES.map((stage) => ({
    title: stage.title,
    count: responses.filter((response) => response.recommended_stage === stage.title).length,
  }));

  const uniqueIndustries = Array.from(
    new Set(responses.map((response) => response.target_industry).filter(Boolean)),
  ) as string[];

  return (
    <DiagnosticShell mainClassName="px-6 py-12 md:px-12 md:py-20">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10">
        <section className="space-y-4 border-b border-border pb-8">
          <p className="text-[11px] uppercase tracking-[0.22em] text-outline">
            Internal Admin
          </p>
          <h1 className="font-serif text-4xl font-semibold text-white sm:text-5xl">
            Assessment Responses
          </h1>
          <p className="max-w-3xl text-base leading-7 text-on-surface-variant">
            Lightweight internal view for submitted responses and lead capture quality.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="border border-blue-700/20 bg-gradient-to-br from-card to-blue-700/10 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
              Total Responses
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{responses.length}</p>
          </div>
          <div className="border border-[#FFD600]/20 bg-gradient-to-br from-card to-[#FFD600]/10 p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
              Responses With Email
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{emailCount}</p>
          </div>
          <div className="border border-border bg-card p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
              Stage Mix
            </p>
            <div className="mt-3 space-y-2 text-sm text-on-surface">
              {stageCounts.map((item) => (
                <div key={item.title} className="flex items-center justify-between">
                  <span>{item.title}</span>
                  <span className="text-blue-700">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border border-border bg-card p-5">
          <form className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                Recommended Stage
              </span>
              <select
                name="recommended_stage"
                defaultValue={recommendedStage}
                className="h-12 w-full border border-surface-container-high bg-surface-container-low px-4 text-white"
              >
                <option value="">All stages</option>
                {SERVITIZATION_STAGES.map((stage) => (
                  <option key={stage.id} value={stage.title}>
                    {stage.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.18em] text-on-surface-variant">
                Target Industry
              </span>
              <select
                name="target_industry"
                defaultValue={targetIndustry}
                className="h-12 w-full border border-surface-container-high bg-surface-container-low px-4 text-white"
              >
                <option value="">All industries</option>
                {uniqueIndustries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <button
                type="submit"
                className="h-12 border border-blue-700 bg-blue-700 px-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </section>

        <section className="overflow-x-auto border border-border bg-card">
          <table className="min-w-[1220px] w-full text-left">
            <thead className="border-b border-border bg-surface-container-low">
              <tr className="text-[11px] uppercase tracking-[0.16em] text-on-surface-variant">
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Respondent Role</th>
                <th className="px-4 py-3">Target Industry</th>
                <th className="px-4 py-3">Asset Category</th>
                <th className="px-4 py-3">Company Size</th>
                <th className="px-4 py-3">Fit Score</th>
                <th className="px-4 py-3">Recommended Stage</th>
                <th className="px-4 py-3">Value Driver</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">UTM Source</th>
                <th className="px-4 py-3">UTM Medium</th>
                <th className="px-4 py-3">UTM Campaign</th>
              </tr>
            </thead>
            <tbody>
              {responses.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-4 py-10 text-sm text-on-surface-variant">
                    {error
                      ? `${error} Check your Supabase setup before relying on this page.`
                      : 'No responses found yet. Wait for the first submission or adjust the filters.'}
                  </td>
                </tr>
              ) : (
                responses.map((response) => (
                  <tr key={response.id} className="border-b border-border/80 text-sm text-on-surface">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(response.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">{response.respondent_role ?? '-'}</td>
                    <td className="px-4 py-3">{response.target_industry ?? '-'}</td>
                    <td className="px-4 py-3">{response.asset_category ?? '-'}</td>
                    <td className="px-4 py-3">{response.company_size ?? '-'}</td>
                    <td className="px-4 py-3 text-blue-700">{response.total_fit_score}</td>
                    <td className="px-4 py-3">{response.recommended_stage}</td>
                    <td className="px-4 py-3">{response.dominant_value_driver ?? '-'}</td>
                    <td className="px-4 py-3">{response.email ?? '-'}</td>
                    <td className="px-4 py-3">{response.source ?? '-'}</td>
                    <td className="px-4 py-3">{response.utm_source ?? '-'}</td>
                    <td className="px-4 py-3">{response.utm_medium ?? '-'}</td>
                    <td className="px-4 py-3">{response.utm_campaign ?? '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </DiagnosticShell>
  );
}
