import { Check } from 'lucide-react';

const OrderTimeline = ({ steps, currentStep }) => {
  return (
    <div className="order-timeline" role="list" aria-label="Order tracking timeline">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        return (
          <div
            key={step.label}
            className={`timeline-step${isCompleted ? ' completed' : ''}${isCurrent ? ' current' : ''}`}
            role="listitem"
            aria-current={isCurrent ? 'step' : undefined}
          >
            <div>
              <div className="timeline-dot" aria-hidden="true">
                {isCompleted ? <Check size={14} /> : <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{i + 1}</span>}
              </div>
            </div>
            <div className="timeline-content">
              <p className="timeline-title">{step.label}</p>
              {step.date && <p className="timeline-date">{step.date}</p>}
              {step.description && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 4 }}>{step.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTimeline;
