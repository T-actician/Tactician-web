export default function Logo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="akGradient" x1="2" y1="4" x2="38" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1c5ce0" />
          <stop offset="0.55" stopColor="#2f78f5" />
          <stop offset="1" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <text
        x="20"
        y="29"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="22"
        letterSpacing="-1.5"
        fill="url(#akGradient)"
      >
        AK
      </text>
    </svg>
  );
}
