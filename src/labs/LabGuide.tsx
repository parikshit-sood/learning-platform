interface LabGuideProps {
  action: string;
  complete?: boolean;
  insight: string;
  objective: string;
  step: number;
  total: number;
}

export function LabGuide({ action, complete = false, insight, objective, step, total }: LabGuideProps) {
  const progress = total > 0 ? Math.round((step / total) * 100) : 0;

  return (
    <div className={`lab-guide ${complete ? "complete" : ""}`}>
      <div className="lab-guide-copy">
        <span className="lab-label">{complete ? "Lab complete" : "Your task"}</span>
        <strong>{complete ? "Signal captured. Answer the boss gate below." : objective}</strong>
        <p>{complete ? insight : action}</p>
      </div>
      <div className="lab-progress" aria-label="Lab progress">
        <span style={{ width: `${progress}%` }} />
      </div>
      <span className="mini-pill">
        {step}/{total} steps
      </span>
    </div>
  );
}
