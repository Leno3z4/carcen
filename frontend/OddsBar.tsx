interface OddsBarProps {
  yesBps: bigint; // 0-10000
}

export function OddsBar({ yesBps }: OddsBarProps) {
  const yesPct = Number(yesBps) / 100;
  const noPct = 100 - yesPct;

  return (
    <div className="odds-bar">
      <div className="odds-bar__track">
        <div className="odds-bar__yes" style={{ width: `${yesPct}%` }} />
        <div className="odds-bar__no" style={{ width: `${noPct}%` }} />
        <div className="odds-bar__seam" style={{ left: `${yesPct}%` }} />
      </div>
      <div className="odds-bar__labels">
        <span className="odds-bar__label odds-bar__label--yes">
          YES <strong>{yesPct.toFixed(1)}%</strong>
        </span>
        <span className="odds-bar__label odds-bar__label--no">
          <strong>{noPct.toFixed(1)}%</strong> NO
        </span>
      </div>
    </div>
  );
}
