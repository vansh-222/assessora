// components/ui/StepIndicator.tsx
interface Step {
  number: number;
  label: string;
}

interface Props {
  steps: Step[];
  current: number;
}

export default function StepIndicator({ steps, current }: Props) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const isDone = step.number < current;
        const isActive = step.number === current;
        const isLast = i === steps.length - 1;

        return (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-colors ${
                  isDone
                    ? 'bg-green-600 text-white'
                    : isActive
                    ? 'bg-green-600 text-white ring-4 ring-green-100'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {isDone ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={`text-sm font-medium whitespace-nowrap ${
                  isActive ? 'text-slate-900' : isDone ? 'text-green-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`h-px w-8 mx-3 ${isDone ? 'bg-green-300' : 'bg-slate-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
