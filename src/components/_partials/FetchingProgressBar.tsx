import { useEffect, useState } from "react";

const FetchingProgressBar = (props: { current: number; total: number }) => {
  const [finished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    if (props.current >= props.total) {
      setIsFinished(true);
    } else if (finished === true) {
      setIsFinished(false);
    }
  }, [props.current]);

  const estimatedRemaining = (props.total - props.current) / 1000;

  return (
    <div className="mx-3" data-html2canvas-ignore="true">
      <div className="progress" style={{ height: 24 }}>
        <div
          className={
            "progress-bar" +
            (finished
              ? " bg-success"
              : " progress-bar-striped progress-bar-animated")
          }
          style={{
            width: `${((props.current / props.total) * 100).toFixed(0)}%`,
            height: 24,
            overflow: "visible",
            textShadow:
              "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
            padding: 5,
          }}
        >
          {props.current}/{props.total} (
          {((props.current / props.total) * 100).toFixed(2)}% )
        </div>
      </div>
      <p style={{ color: "white" }}>
        {estimatedRemaining <= 0
          ? "Completed!"
          : `Estimated time remaining: 
        ${estimatedRemaining} minutes.`}
      </p>
    </div>
  );
};

export default FetchingProgressBar;
