"use client";

import { useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import {
  DataSkeleton,
  ErrorState,
  UnauthorizedState,
} from "@/components/ui/DataState";
import { Callout } from "@/components/ui/Metric";
import { apiFetch, ApiError } from "@/lib/api/client";
import { useApiResource } from "@/lib/api/useApiResource";
import {
  educationCompleteSchema,
  educationModuleDetailSchema,
  type EducationCompleteResult,
} from "@/lib/contracts/education";

export function EducationModuleView({ moduleId }: { moduleId: string }) {
  const { data, loading, error, reload } = useApiResource(
    `/v1/education/modules/${moduleId}`,
    educationModuleDetailSchema,
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<EducationCompleteResult | null>(null);
  const [submitError, setSubmitError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <DataSkeleton rows={4} />;
  if (error?.status === 401) return <UnauthorizedState next={`/edukasi/${moduleId}`} />;
  if (error) {
    return (
      <ErrorState
        message={error.message}
        correlationId={error.correlationId}
        retryable={error.retryable}
        onRetry={() => void reload()}
      />
    );
  }
  if (!data) return null;

  const answered = data.questions.filter((question) => question.id in answers).length;
  const complete = answered === data.questions.length;
  const passed = result?.passed ?? data.progress?.passed ?? false;

  async function submit() {
    if (!data) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response = await apiFetch(
        `/v1/education/modules/${moduleId}/complete`,
        educationCompleteSchema,
        {
          method: "POST",
          body: JSON.stringify({
            content_version: data.content_version,
            answers: data.questions.map((question) => answers[question.id]),
          }),
        },
      );
      setResult(response);
      await reload();
    } catch (caught) {
      setSubmitError(caught instanceof ApiError ? caught : null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader title={data.title} />
        <CardBody>
          <p className="text-[14px] leading-relaxed text-ink-700">{data.summary}</p>
          {data.body ? (
            <p className="mt-4 whitespace-pre-line text-[14px] leading-relaxed text-ink-700">
              {data.body}
            </p>
          ) : (
            <Callout tone="warn">
              Isi modul belum diisi pada versi konten ini. Kerjakan cek pemahaman setelah
              materi terbit agar penyelesaianmu menunjuk versi yang benar.
            </Callout>
          )}
          <p className="mt-4 font-mono text-[10px] text-ink-400">
            Versi konten {data.content_version} · nilai lulus {data.passing_score_percent}%
          </p>
        </CardBody>
      </Card>

      {data.questions.length > 0 ? (
        <Card>
          <CardHeader title="Cek pemahaman" />
          <CardBody className="space-y-5">
            {data.questions.map((question, index) => (
              <fieldset key={question.id} className="border-0 p-0">
                <legend className="text-[14px] font-semibold text-ink-900">
                  {index + 1}. {question.prompt}
                </legend>
                <div className="mt-2 space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2.5 text-[14px] text-ink-700"
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={optionIndex}
                        checked={answers[question.id] === optionIndex}
                        onChange={() =>
                          setAnswers((current) => ({ ...current, [question.id]: optionIndex }))
                        }
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            {submitError ? (
              <ErrorState
                message={submitError.message}
                correlationId={submitError.correlationId}
                retryable={submitError.retryable}
                onRetry={() => void submit()}
              />
            ) : null}

            {result ? (
              <div
                role="status"
                className={
                  result.passed
                    ? "rounded-[12px] border border-success-600/30 bg-success-50 p-4"
                    : "rounded-[12px] border border-warn-600/30 bg-warn-50 p-4"
                }
              >
                <p className="font-semibold text-ink-900">
                  {result.passed ? "Modul selesai" : "Belum lulus"}
                </p>
                <p className="mt-1 text-[13px] text-ink-700">
                  {result.correct_answers} dari {result.total_questions} jawaban benar. Batas
                  lulus {result.passing_score_percent}%.
                </p>
              </div>
            ) : null}

            <Button onClick={() => void submit()} disabled={submitting || !complete}>
              {submitting ? "Menyimpan..." : "Kirim jawaban"}
            </Button>
          </CardBody>
        </Card>
      ) : (
        <Callout tone="info">Modul ini belum memiliki cek pemahaman.</Callout>
      )}

      {passed ? (
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/analisis">Lanjut ke analisis</ButtonLink>
          <ButtonLink href="/edukasi" variant="secondary">
            Kembali ke daftar modul
          </ButtonLink>
        </div>
      ) : (
        <ButtonLink href="/edukasi" variant="secondary">
          Kembali ke daftar modul
        </ButtonLink>
      )}
    </div>
  );
}
