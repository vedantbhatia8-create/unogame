'use client';

export function PaintBackground() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      viewBox="0 0 400 874"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="pb-f1" x="-60%" y="-60%" width="220%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.007 0.009" numOctaves="4" seed="3" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="90" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="pb-f2" x="-60%" y="-60%" width="220%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.009 0.007" numOctaves="4" seed="11" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="85" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="pb-f3" x="-60%" y="-60%" width="220%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.011" numOctaves="4" seed="19" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="95" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
        <filter id="pb-f4" x="-60%" y="-60%" width="220%" height="220%">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.008" numOctaves="4" seed="27" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="80" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>

      {/* Black canvas base */}
      <rect width="400" height="874" fill="#0d0208"/>

      {/* RED */}
      <ellipse cx="70"  cy="150" rx="175" ry="150" fill="#E4002B" filter="url(#pb-f1)"/>
      <ellipse cx="55"  cy="130" rx="90"  ry="75"  fill="#FF2244" filter="url(#pb-f3)"/>
      <ellipse cx="330" cy="760" rx="150" ry="130" fill="#C8001A" filter="url(#pb-f2)"/>

      {/* BLUE */}
      <ellipse cx="330" cy="170" rx="170" ry="145" fill="#0095DA" filter="url(#pb-f2)"/>
      <ellipse cx="350" cy="155" rx="85"  ry="70"  fill="#00BBFF" filter="url(#pb-f4)"/>
      <ellipse cx="60"  cy="720" rx="140" ry="120" fill="#0078B8" filter="url(#pb-f1)"/>

      {/* GREEN */}
      <ellipse cx="210" cy="530" rx="180" ry="155" fill="#1FA84C" filter="url(#pb-f3)"/>
      <ellipse cx="200" cy="515" rx="90"  ry="80"  fill="#00D45A" filter="url(#pb-f1)"/>
      <ellipse cx="360" cy="460" rx="110" ry="100" fill="#178A3C" filter="url(#pb-f2)"/>

      {/* YELLOW */}
      <ellipse cx="150" cy="720" rx="170" ry="140" fill="#F4A100" filter="url(#pb-f4)"/>
      <ellipse cx="140" cy="700" rx="85"  ry="70"  fill="#FFD700" filter="url(#pb-f2)"/>
      <ellipse cx="250" cy="310" rx="130" ry="110" fill="#FFC400" filter="url(#pb-f3)"/>

      {/* Extra splatters */}
      <ellipse cx="190" cy="90"  rx="70"  ry="55"  fill="#E4002B" opacity="0.9" filter="url(#pb-f4)"/>
      <ellipse cx="310" cy="600" rx="80"  ry="65"  fill="#0095DA" opacity="0.85" filter="url(#pb-f3)"/>
      <ellipse cx="60"  cy="420" rx="90"  ry="70"  fill="#F4A100" opacity="0.9" filter="url(#pb-f1)"/>
      <ellipse cx="370" cy="320" rx="65"  ry="55"  fill="#1FA84C" opacity="0.85" filter="url(#pb-f4)"/>

      {/* Tiny spatter dots */}
      {[
        [120,60,'#FFD700'],[280,80,'#E4002B'],[340,400,'#00D45A'],
        [40,300,'#0095DA'],[380,550,'#FF2244'],[100,800,'#00BBFF'],
        [250,840,'#F4A100'],[310,240,'#1FA84C'],[180,440,'#E4002B'],
      ].map(([cx, cy, fill], i) => (
        <circle key={i} cx={cx} cy={cy} r={12 + (i % 3) * 8} fill={fill} opacity={0.7} filter={`url(#pb-f${(i % 4) + 1})`}/>
      ))}
    </svg>
  );
}
