import { useAuth } from "@/contexts/AuthContext";

const TOTAL = 5 * 60 * 1000;

const SessionBar = () => {
  const { sessionTimeLeft } = useAuth();
  const pct = (sessionTimeLeft / TOTAL) * 100;
  const isLow = pct < 15;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-secondary">
      <div
        className={`h-full bg-primary transition-all duration-1000 ease-linear ${isLow ? "session-bar-pulse" : ""}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default SessionBar;
