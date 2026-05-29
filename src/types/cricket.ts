/* ─── Core Match Data Types ─── */

export interface BallEvent {
  /** Ball number within the over (1-6) */
  ball: number;
  /** Runs scored: 0, 1, 2, 3, 4, 6 */
  runs: number;
  /** Whether this ball was a wicket */
  isWicket: boolean;
  /** Whether this ball was a wide/no-ball */
  isExtra: boolean;
  /** Display label: "0", "1", "2", "3", "4", "6", "W", "Wd", "Nb" */
  label: string;
}

export interface BatsmanStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOnStrike: boolean;
}

export interface BowlerStats {
  name: string;
  overs: string;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
}

export interface TeamScore {
  teamName: string;
  teamShort: string;
  runs: number;
  wickets: number;
  overs: string;
  runRate: number;
}

export interface MatchData {
  /** Match identifier */
  id: string;
  /** Match title, e.g. "IPL Finals: MI vs CSK" */
  title: string;
  /** Match status */
  status: 'live' | 'completed' | 'upcoming';
  /** Current batting team score */
  battingTeam: TeamScore;
  /** Bowling team / first innings score (target) */
  bowlingTeam: TeamScore;
  /** Target score (2nd innings only), null if 1st innings */
  target: number | null;
  /** Required run rate (2nd innings only) */
  requiredRunRate: number | null;
  /** Current batsmen at crease */
  batsmen: BatsmanStats[] | null;
  /** Current bowler */
  bowler: BowlerStats | null;
  /** Recent balls (last 12 balls / current + previous over) */
  recentBalls: BallEvent[] | null;
  /** Venue */
  venue: string;
  /** Custom status text from Cricbuzz */
  statusText?: string;
  /** Last updated timestamp */
  lastUpdated: number;
}

export interface ApiResponse {
  success: boolean;
  data: MatchData;
}
