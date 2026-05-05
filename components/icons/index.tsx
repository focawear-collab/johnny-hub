
import React from 'react';
import Svg, {
  Path,
  Rect,
  Circle,
  G,
} from 'react-native-svg';

// ---------------------------------------------------------------------------
// Shared prop type
// ---------------------------------------------------------------------------

export interface IconProps {
  size?: number;
  color?: string;
}

interface StrokeIconProps extends IconProps {
  stroke?: number;
}

// Default color matches design token fg-0
const DEFAULT_COLOR = '#F4EDE4';

// ---------------------------------------------------------------------------
// Flame — nav icon for Forno tab
// ---------------------------------------------------------------------------
export const Flame: React.FC<StrokeIconProps> = ({
  size = 22,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3c0 4-5 5-5 10a5 5 0 0010 0c0-2-1-3-2-4 0 2-1 3-2 3 1-3-1-6-1-9z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Calc — dough calculator
// ---------------------------------------------------------------------------
export const Calc: React.FC<StrokeIconProps> = ({
  size = 22,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="3" width="16" height="18" rx="3" stroke={color} strokeWidth={stroke} />
    <Rect x="7" y="6" width="10" height="3" rx="1" stroke={color} strokeWidth={stroke} />
    <Circle cx="8.5" cy="13" r="0.8" fill={color} />
    <Circle cx="12" cy="13" r="0.8" fill={color} />
    <Circle cx="15.5" cy="13" r="0.8" fill={color} />
    <Circle cx="8.5" cy="17" r="0.8" fill={color} />
    <Circle cx="12" cy="17" r="0.8" fill={color} />
    <Circle cx="15.5" cy="17" r="0.8" fill={color} />
  </Svg>
);

// ---------------------------------------------------------------------------
// Book — recipes nav icon
// ---------------------------------------------------------------------------
export const Book: React.FC<StrokeIconProps> = ({
  size = 22,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 4a2 2 0 012-2h11v18H7a2 2 0 00-2 2V4z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
    <Path d="M5 20a2 2 0 002 2h11" stroke={color} strokeWidth={stroke} />
  </Svg>
);

// ---------------------------------------------------------------------------
// Timer — fermentation/bake timer
// ---------------------------------------------------------------------------
export const Timer: React.FC<StrokeIconProps> = ({
  size = 22,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="13" r="8" stroke={color} strokeWidth={stroke} />
    <Path
      d="M12 13V9M9 2h6"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Journal — bake diary nav icon
// ---------------------------------------------------------------------------
export const Journal: React.FC<StrokeIconProps> = ({
  size = 22,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="4" y="3" width="16" height="18" rx="2" stroke={color} strokeWidth={stroke} />
    <Path
      d="M8 8h8M8 12h8M8 16h5"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------
export const Search: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.7,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth={stroke} />
    <Path
      d="M16 16l4 4"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Plus
// ---------------------------------------------------------------------------
export const Plus: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5v14M5 12h14"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Bell — notifications
// ---------------------------------------------------------------------------
export const Bell: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6zM10 19a2 2 0 004 0"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Chevron — right-pointing disclosure indicator
// ---------------------------------------------------------------------------
export const Chevron: React.FC<StrokeIconProps> = ({
  size = 14,
  color = DEFAULT_COLOR,
  stroke = 1.8,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6l6 6-6 6"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Back — left-pointing navigation arrow
// ---------------------------------------------------------------------------
export const Back: React.FC<StrokeIconProps> = ({
  size = 16,
  color = DEFAULT_COLOR,
  stroke = 1.8,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 6l-6 6 6 6"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Drop — hydration / water
// ---------------------------------------------------------------------------
export const Drop: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3s6 7 6 12a6 6 0 11-12 0c0-5 6-12 6-12z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Wheat — flour ingredient icon
// ---------------------------------------------------------------------------
export const Wheat: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d={[
        'M12 22V8',
        'M12 8c-2 0-3-1-3-3 2 0 3 1 3 3z',
        'M12 8c2 0 3-1 3-3-2 0-3 1-3 3z',
        'M12 13c-2 0-3-1-3-3 2 0 3 1 3 3z',
        'M12 13c2 0 3-1 3-3-2 0-3 1-3 3z',
        'M12 18c-2 0-3-1-3-3 2 0 3 1 3 3z',
        'M12 18c2 0 3-1 3-3-2 0-3 1-3 3z',
      ].join(' ')}
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Salt — salt shaker ingredient icon
// ---------------------------------------------------------------------------
export const Salt: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 9h10l-1 12H8L7 9z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
    <Path d="M9 5h6v4H9z" stroke={color} strokeWidth={stroke} />
    <Circle cx="11" cy="14" r="0.6" fill={color} />
    <Circle cx="13" cy="17" r="0.6" fill={color} />
  </Svg>
);

// ---------------------------------------------------------------------------
// Yeast — fermentation / yeast bubbles
// ---------------------------------------------------------------------------
export const Yeast: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="13" r="3" stroke={color} strokeWidth={stroke} />
    <Circle cx="15" cy="10" r="2.5" stroke={color} strokeWidth={stroke} />
    <Circle cx="14" cy="16" r="2" stroke={color} strokeWidth={stroke} />
  </Svg>
);

// ---------------------------------------------------------------------------
// Thermometer — temperature / oven heat
// ---------------------------------------------------------------------------
export const Thermometer: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 14V5a2 2 0 10-4 0v9a4 4 0 104 0z"
      stroke={color}
      strokeWidth={stroke}
    />
    <Circle cx="12" cy="17" r="1.5" fill={color} />
  </Svg>
);

// ---------------------------------------------------------------------------
// Settings — gear / configuration
// ---------------------------------------------------------------------------
export const Settings: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth={stroke} />
    <Path
      d="M12 2v3M12 19v3M2 12h3M19 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Share — upload / share sheet
// ---------------------------------------------------------------------------
export const Share: React.FC<StrokeIconProps> = ({
  size = 16,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3v12M12 3l-4 4M12 3l4 4M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Heart — favourite / bookmark
// ---------------------------------------------------------------------------
export interface HeartIconProps extends StrokeIconProps {
  filled?: boolean;
}

export const Heart: React.FC<HeartIconProps> = ({
  size = 16,
  color = DEFAULT_COLOR,
  stroke = 1.6,
  filled = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Cart — shopping list
// ---------------------------------------------------------------------------
export const Cart: React.FC<StrokeIconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 4h2l3 13h11l2-9H6"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="9" cy="20" r="1.5" stroke={color} strokeWidth={stroke} />
    <Circle cx="17" cy="20" r="1.5" stroke={color} strokeWidth={stroke} />
  </Svg>
);

// ---------------------------------------------------------------------------
// Wine — pairings / wine
// ---------------------------------------------------------------------------
export const Wine: React.FC<StrokeIconProps> = ({
  size = 16,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M8 3h8l-1 8a3 3 0 01-6 0l-1-8zM12 14v7M9 21h6"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
      strokeLinecap="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Star — rating
// ---------------------------------------------------------------------------
export const Star: React.FC<IconProps> = ({
  size = 12,
  color = DEFAULT_COLOR,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
  </Svg>
);

// ---------------------------------------------------------------------------
// Check — done state / checklist tick
// ---------------------------------------------------------------------------
export const Check: React.FC<StrokeIconProps> = ({
  size = 14,
  color = DEFAULT_COLOR,
  stroke = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12l5 5L20 7"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Pause — timer pause state
// ---------------------------------------------------------------------------
export const Pause: React.FC<IconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Rect x="6" y="5" width="4" height="14" rx="1" />
    <Rect x="14" y="5" width="4" height="14" rx="1" />
  </Svg>
);

// ---------------------------------------------------------------------------
// Play — timer play state
// ---------------------------------------------------------------------------
export const Play: React.FC<IconProps> = ({
  size = 18,
  color = DEFAULT_COLOR,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M7 4l13 8-13 8V4z" />
  </Svg>
);

// ---------------------------------------------------------------------------
// Pizza — generic pizza icon
// ---------------------------------------------------------------------------
export const Pizza: React.FC<StrokeIconProps> = ({
  size = 22,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 3C7 3 3 7 3 12l9 9c5 0 9-4 9-9s-4-9-9-9z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
    <Path
      d="M3 12l9 9"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
    />
    <Circle cx="9" cy="9" r="1" fill={color} />
    <Circle cx="13" cy="13" r="1" fill={color} />
    <Circle cx="10" cy="14" r="0.7" fill={color} />
  </Svg>
);

// ---------------------------------------------------------------------------
// BookOpen — open recipe / techniques
// ---------------------------------------------------------------------------
export const BookOpen: React.FC<StrokeIconProps> = ({
  size = 22,
  color = DEFAULT_COLOR,
  stroke = 1.6,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 4h8a2 2 0 012 2v14a2 2 0 00-2-2H2V4zM22 4h-8a2 2 0 00-2 2v14a2 2 0 012-2h8V4z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Bookmark — save / bookmark
// ---------------------------------------------------------------------------
export const Bookmark: React.FC<StrokeIconProps & { filled?: boolean }> = ({
  size = 18,
  color = DEFAULT_COLOR,
  stroke = 1.6,
  filled = false,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'}>
    <Path
      d="M5 3h14a1 1 0 011 1v17l-8-4-8 4V4a1 1 0 011-1z"
      stroke={color}
      strokeWidth={stroke}
      strokeLinejoin="round"
    />
  </Svg>
);

// ---------------------------------------------------------------------------
// Convenience default export — named icon map (mirrors prototype window.JHIcon)
// ---------------------------------------------------------------------------
const Icons = {
  Flame,
  Calc,
  Book,
  Timer,
  Journal,
  Search,
  Plus,
  Bell,
  Chevron,
  Back,
  Drop,
  Wheat,
  Salt,
  Yeast,
  Thermometer,
  Settings,
  Share,
  Heart,
  Cart,
  Wine,
  Star,
  Check,
  Pause,
  Play,
  Pizza,
  BookOpen,
  Bookmark,
} as const;

export type IconName = keyof typeof Icons;

export default Icons;
