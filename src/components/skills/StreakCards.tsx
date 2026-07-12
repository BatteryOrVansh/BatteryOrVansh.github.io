const GITHUB_USERNAME = "BatteryOrVansh";
const LEETCODE_USERNAME = "VanshDixit";

const GITHUB_STREAK_URL =
  `https://streak-stats.demolab.com?user=${GITHUB_USERNAME}` +
  "&background=FFFFFF00&ring=E8283F&fire=E8283F&currStreakNum=0A0A0A" +
  "&sideNums=0A0A0A&currStreakLabel=6B6B70&sideLabels=6B6B70&dates=6B6B70" +
  "&border=E9E9E9&hide_border=false";

const LEETCODE_CARD_URL = `https://leetcard.jacoblin.cool/${LEETCODE_USERNAME}?theme=light&font=Manrope&ext=activity`;

export function StreakCards() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <a
        href={`https://github.com/${GITHUB_USERNAME}`}
        target="_blank"
        rel="noopener noreferrer"
        className="overflow-hidden rounded-[1.5rem] border border-border bg-bg-elevated p-4 transition-transform duration-300 ease-[var(--ease-google)] hover:-translate-y-1 sm:p-6"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={GITHUB_STREAK_URL}
          alt={`${GITHUB_USERNAME}'s GitHub contribution streak`}
          className="w-full"
          loading="lazy"
        />
      </a>
      <a
        href={`https://leetcode.com/u/${LEETCODE_USERNAME}/`}
        target="_blank"
        rel="noopener noreferrer"
        className="overflow-hidden rounded-[1.5rem] border border-border bg-bg-elevated p-4 transition-transform duration-300 ease-[var(--ease-google)] hover:-translate-y-1 sm:p-6"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LEETCODE_CARD_URL}
          alt={`${LEETCODE_USERNAME}'s LeetCode stats`}
          className="w-full"
          loading="lazy"
        />
      </a>
    </div>
  );
}
