import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';

// --- Utility Functions (from shadcn/ui) ---
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- Theme Provider (from next-themes concept) ---
const ThemeContext = createContext(null);

function ThemeProvider({ children, attribute = 'class', defaultTheme = 'system', enableSystem = true, disableTransitionOnChange = false }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme) return storedTheme;
      if (enableSystem && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return defaultTheme;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      if (theme === 'system' && enableSystem) {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
      localStorage.setItem('theme', theme);
    }
  }, [theme, enableSystem]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// --- shadcn/ui Button Component (Simplified) ---
const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

const Button = React.forwardRef(({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
  const Comp = asChild ? 'span' : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = 'Button';

// --- shadcn/ui Card Component (Simplified) ---
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-3xl border bg-card/80 text-card-foreground shadow-2xl transition-all duration-500 ease-out', // Increased shadow, added transparency, rounded-3xl
      // For true glassmorphism, in a Next.js project with Tailwind JIT: backdrop-filter: blur(10px);
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-semibold leading-none tracking-tight text-xl', // Slightly larger title
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// --- shadcn/ui Input Component (Simplified) ---
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// --- shadcn/ui Select Component (Simplified) ---
const Select = ({ children, value, onValueChange, className, ...props }) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className={cn(
        "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
};
Select.displayName = "Select";

const SelectContent = ({ children, ...props }) => <>{children}</>; // Simplified, no dropdown styling
const SelectItem = ({ value, children, ...props }) => <option value={value} {...props}>{children}</option>;

// --- shadcn/ui Table Components (Simplified) ---
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-xl border"> {/* Added rounded-xl border here for consistency */}
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

// --- shadcn/ui Sheet Components (Simplified for mobile sidebar) ---
// SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose
// For simplicity, we'll just use a div for the SheetContent and a button for the trigger
const Sheet = ({ children }) => <>{children}</>;
const SheetTrigger = ({ children, onClick }) => <Button variant="ghost" size="icon" onClick={onClick}>{children}</Button>;
const SheetContent = ({ children, side = 'left', className }) => (
  <div className={cn("fixed inset-y-0 z-50 w-3/4 bg-background p-6 shadow-lg transition ease-in-out duration-300", side === 'left' ? 'left-0 border-r' : 'right-0 border-l', className)}>
    {children}
  </div>
);
const SheetHeader = ({ children }) => <div className="flex flex-col space-y-2 text-center sm:text-left">{children}</div>;
const SheetTitle = ({ children }) => <h2 className="text-lg font-semibold">{children}</h2>;
const SheetDescription = ({ children }) => <p className="text-sm text-muted-foreground">{children}</p>;
const SheetFooter = ({ children }) => <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4">{children}</div>;
const SheetClose = ({ children, onClick }) => <Button variant="secondary" onClick={onClick}>{children}</Button>;


// --- Mock Data Generation for Digital Marketing Analytics ---
const generateMockMarketingData = (numDays = 365) => {
  const today = new Date();
  const data = [];
  for (let i = numDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * (100000 - 50000 + 1)) + 50000,
      users: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000,
      conversions: Math.floor(Math.random() * (500 - 100 + 1)) + 100,
      cpc: (Math.random() * (2.5 - 0.5) + 0.5), // Cost Per Click
      impressions: Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000,
      clicks: Math.floor(Math.random() * (10000 - 1000 + 1)) + 1000,
    });
  }
  return data;
};

const fullMarketingData = generateMockMarketingData(365); // Generate a full year of data

const getFilteredData = (data, range) => {
  const today = new Date();
  let startDate = new Date(today);

  switch (range) {
    case 'last-7-days':
      startDate.setDate(today.getDate() - 7);
      break;
    case 'last-30-days':
      startDate.setDate(today.getDate() - 30);
      break;
    case 'last-90-days':
      startDate.setDate(today.getDate() - 90);
      break;
    case 'last-year':
      startDate.setFullYear(today.getFullYear() - 1);
      break;
    default: // Default to last 30 days if no valid range
      startDate.setDate(today.getDate() - 30);
      break;
  }

  const filtered = data.filter(d => new Date(d.date) >= startDate);
  return filtered;
};


const getMetricValue = (data, key, prevPeriodData = null) => {
  if (!data || data.length === 0) return { value: 'N/A', change: 'N/A', type: 'neutral', vsPrev: 'N/A' };

  const currentSum = data.reduce((sum, d) => sum + d[key], 0);
  const latestValue = data[data.length - 1][key]; // For 'cpc' which is an average/latest

  let displayValue;
  if (key === 'revenue') displayValue = `$${currentSum.toLocaleString()}`;
  else if (key === 'cpc') displayValue = `$${latestValue.toFixed(2)}`;
  else displayValue = currentSum.toLocaleString();

  let vsPrev = 'N/A';
  if (prevPeriodData && prevPeriodData.length > 0) {
    const prevSum = prevPeriodData.reduce((sum, d) => sum + d[key], 0);
    const prevLatestValue = prevPeriodData[prevPeriodData.length - 1][key];

    let comparisonValue = key === 'cpc' ? prevLatestValue : prevSum;
    let currentValue = key === 'cpc' ? latestValue : currentSum;

    const change = ((currentValue - comparisonValue) / comparisonValue) * 100;
    vsPrev = `${change.toFixed(1)}% vs. Prev`;
  }

  // Calculate change for the current period against its own start (simplified for trend)
  const firstValue = data[0][key];
  const currentPeriodChange = ((latestValue - firstValue) / firstValue) * 100;
  const type = currentPeriodChange >= 0 ? 'positive' : 'negative';

  return {
    value: displayValue,
    change: `${currentPeriodChange.toFixed(1)}%`,
    type: type,
    vsPrev: vsPrev,
  };
};

const generateMockCampaignData = () => {
  const campaigns = [];
  const campaignNames = ['Brand Awareness Q1', 'Lead Gen Spring', 'Holiday Sales Boost', 'SEO Content Push', 'Social Media Blitz'];
  const statuses = ['Active', 'Paused', 'Completed'];
  const channels = ['Google Ads', 'Facebook Ads', 'SEO', 'Email Marketing', 'Content Marketing'];

  for (let i = 0; i < 15; i++) { // Generate more campaigns for better table demo
    const budget = Math.floor(Math.random() * (15000 - 2000 + 1)) + 2000;
    const spend = Math.floor(Math.random() * budget);
    const conversions = Math.floor(Math.random() * (500 - 20 + 1)) + 20;
    const revenueGenerated = conversions * (Math.random() * (200 - 50) + 50);
    const roi = ((revenueGenerated - spend) / spend * 100).toFixed(2);

    campaigns.push({
      id: i + 1,
      name: campaignNames[Math.floor(Math.random() * campaignNames.length)] + ` - ${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      channel: channels[Math.floor(Math.random() * channels.length)],
      budget: budget,
      spend: spend,
      conversions: conversions,
      roi: `${roi}%`,
      revenueGenerated: revenueGenerated,
    });
  }
  return campaigns;
};

const campaignData = generateMockCampaignData();

const marketingGoals = [
  { id: 'users', label: 'Reach 100k Users', target: 100000, current: fullMarketingData.slice(-30).reduce((sum, d) => sum + d.users, 0) / 30 * 365 / 2, unit: 'users' }, // Mock current progress
  { id: 'conversions', label: 'Achieve 500 Conversions', target: 500, current: fullMarketingData.slice(-30).reduce((sum, d) => sum + d.conversions, 0), unit: 'conversions' },
  { id: 'revenue', label: 'Generate $1M Revenue', target: 1000000, current: fullMarketingData.slice(-30).reduce((sum, d) => sum + d.revenue, 0) * 10, unit: 'revenue' }, // Mock current progress
];

const generateAudienceData = () => ({
  age: [
    { range: '18-24', users: Math.floor(Math.random() * 2000) + 500 },
    { range: '25-34', users: Math.floor(Math.random() * 4000) + 1000 },
    { range: '35-44', users: Math.floor(Math.random() * 3000) + 800 },
    { range: '45-54', users: Math.floor(Math.random() * 1500) + 400 },
    { range: '55+', users: Math.floor(Math.random() * 800) + 200 },
  ],
  gender: [
    { label: 'Male', users: Math.floor(Math.random() * 6000) + 2000 },
    { label: 'Female', users: Math.floor(Math.random() * 5000) + 1500 },
    { label: 'Other', users: Math.floor(Math.random() * 500) + 100 },
  ],
  interests: [
    { interest: 'Digital Marketing', users: Math.floor(Math.random() * 3000) + 1000 },
    { interest: 'E-commerce', users: Math.floor(Math.random() * 2500) + 800 },
    { interest: 'Technology', users: Math.floor(Math.random() * 2000) + 700 },
    { interest: 'Business News', users: Math.floor(Math.random() * 1500) + 500 },
  ]
});

const audienceData = generateAudienceData();

const generateGeoData = () => ([
  { country: 'USA', revenue: Math.floor(Math.random() * 500000) + 100000, conversions: Math.floor(Math.random() * 2000) + 500 },
  { country: 'India', revenue: Math.floor(Math.random() * 300000) + 50000, conversions: Math.floor(Math.random() * 1500) + 300 },
  { country: 'UK', revenue: Math.floor(Math.random() * 200000) + 40000, conversions: Math.floor(Math.random() * 1000) + 200 },
  { country: 'Canada', revenue: Math.floor(Math.random() * 150000) + 30000, conversions: Math.floor(Math.random() * 800) + 150 },
  { country: 'Australia', revenue: Math.floor(Math.random() * 100000) + 20000, conversions: Math.floor(Math.random() * 500) + 100 },
]);

const geoData = generateGeoData();


// --- Components ---

const MetricCard = ({ label, value, change, type, vsPrev }) => (
  <Card className="hover:scale-[1.02] transition-transform duration-300 ease-out"> {/* Added hover effect */}
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{label}</CardTitle>
      {type === 'positive' ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-green-500"> {/* Changed color to green-500 */}
          <path d="M12 2L12 22"></path>
          <path d="M17 17L12 22L7 17"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-red-500"> {/* Changed color to red-500 */}
          <path d="M12 22L12 2"></path>
          <path d="M7 7L12 2L17 7"></path>
        </svg>
      )}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={cn("text-xs", type === 'positive' ? 'text-green-500' : 'text-red-500')}>
        {change} {vsPrev && <span className="text-muted-foreground ml-1">({vsPrev})</span>}
      </p>
    </CardContent>
  </Card>
);

const LineChartMock = ({ data, title, xAxisKey, yAxisKey, loading }) => {
  if (loading) return <ChartSkeleton title={title} />;
  if (!data || data.length === 0) return <p>No data for chart.</p>;

  const values = data.map(d => d[yAxisKey]);
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);

  // Normalize values to fit SVG height
  const normalize = (val) => ((val - minVal) / (maxVal - minVal)) * 80 + 10; // Scale to 10-90 for padding

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 280 + 10; // Scale to 10-290 for padding
    const y = 100 - normalize(d[yAxisKey]); // Invert Y-axis for SVG
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card className="p-4">
      <CardTitle className="mb-4">{title}</CardTitle>
      <svg width="300" height="120" viewBox="0 0 300 120" className="w-full h-auto">
        <rect x="0" y="0" width="300" height="120" fill="transparent" />
        {/* Y-axis labels (simplified) */}
        <text x="5" y="10" fontSize="10" fill="currentColor" textAnchor="start">{maxVal.toLocaleString()}</text>
        <text x="5" y="105" fontSize="10" fill="currentColor" textAnchor="start">{minVal.toLocaleString()}</text>
        {/* Line */}
        <polyline
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          points={points}
        />
        {/* X-axis labels (simplified) */}
        <text x="10" y="115" fontSize="10" fill="currentColor" textAnchor="start">{data[0][xAxisKey]}</text>
        <text x="290" y="115" fontSize="10" fill="currentColor" textAnchor="end">{data[data.length - 1][xAxisKey]}</text>
      </svg>
    </Card>
  );
};

const BarChartMock = ({ data, title, xAxisKey, yAxisKey, loading }) => {
  if (loading) return <ChartSkeleton title={title} />;
  if (!data || data.length === 0) return <p>No data for chart.</p>;

  const values = data.map(d => d[yAxisKey]);
  const maxVal = Math.max(...values);

  const barWidth = 20;
  const gap = 10;
  const totalWidth = data.length * (barWidth + gap);
  const svgWidth = Math.max(300, totalWidth); // Ensure minimum width

  return (
    <Card className="p-4">
      <CardTitle className="mb-4">{title}</CardTitle>
      <div className="overflow-x-auto">
        <svg width={svgWidth} height="150" viewBox={`0 0 ${svgWidth} 150`} className="h-auto">
          <rect x="0" y="0" width={svgWidth} height="150" fill="transparent" />
          {data.map((d, i) => {
            const barHeight = (d[yAxisKey] / maxVal) * 100; // Scale to 100px max height
            const x = i * (barWidth + gap) + 10;
            const y = 140 - barHeight; // Invert Y-axis for SVG, 140 for padding

            return (
              <React.Fragment key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="hsl(var(--primary))"
                  rx="3" ry="3" // Rounded corners
                />
                <text x={x + barWidth / 2} y={145} fontSize="10" fill="currentColor" textAnchor="middle">
                  {d[xAxisKey]}
                </text>
                <text x={x + barWidth / 2} y={y - 5} fontSize="10" fill="currentColor" textAnchor="middle">
                  {d[yAxisKey].toLocaleString()}
                </text>
              </React.Fragment>
            );
          })}
        </svg>
      </div>
    </Card>
  );
};

const PieChartMock = ({ data, title, valueKey, labelKey, loading }) => {
  if (loading) return <ChartSkeleton title={title} />;
  if (!data || data.length === 0) return <p>No data for chart.</p>;

  const total = data.reduce((sum, item) => sum + item[valueKey], 0);
  let startAngle = 0;
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#a4de6c']; // Example colors

  const renderSlice = (value, index) => {
    const angle = (value / total) * 360;
    const largeArcFlag = angle > 180 ? 1 : 0;

    const radius = 50;
    const centerX = 75;
    const centerY = 75;

    const x1 = centerX + radius * Math.cos(Math.PI * (startAngle) / 180);
    const y1 = centerY + radius * Math.sin(Math.PI * (startAngle) / 180);

    startAngle += angle;

    const x2 = centerX + radius * Math.cos(Math.PI * (startAngle) / 180);
    const y2 = centerY + radius * Math.sin(Math.PI * (startAngle) / 180);

    const d = [
      `M ${centerX},${centerY}`,
      `L ${x1},${y1}`,
      `A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`,
      `Z`
    ].join(' ');

    return (
      <path key={index} d={d} fill={colors[index % colors.length]} />
    );
  };

  return (
    <Card className="p-4">
      <CardTitle className="mb-4">{title}</CardTitle>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <svg width="150" height="150" viewBox="0 0 150 150">
          {data.map((d, i) => renderSlice(d[valueKey], i))}
        </svg>
        <div className="ml-4 flex flex-col space-y-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center text-sm">
              <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: colors[i % colors.length] }}></span>
              {d[labelKey]} ({(d[valueKey] / total * 100).toFixed(1)}%)
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

// --- Conversion Funnel Component ---
const ConversionFunnelMock = ({ title, stages, loading }) => {
  if (loading) return <ChartSkeleton title={title} />;
  // stages: [{ name: 'Impressions', value: 100000 }, { name: 'Clicks', value: 5000 }, ...]
  if (!stages || stages.length < 2) return <p>Not enough data for funnel.</p>;

  const maxVal = stages[0].value;
  const funnelHeight = 150;
  const funnelWidth = 200;
  const topWidth = 150;
  const bottomWidth = 50;
  const segmentHeight = funnelHeight / stages.length;

  return (
    <Card className="p-4">
      <CardTitle className="mb-4">{title}</CardTitle>
      <svg width={funnelWidth} height={funnelHeight} viewBox={`0 0 ${funnelWidth} ${funnelHeight}`} className="w-full h-auto">
        {stages.map((stage, i) => {
          const currentRatio = stage.value / maxVal;
          const prevRatio = i > 0 ? stages[i-1].value / maxVal : 1;

          // Calculate widths for the trapezoid segment
          const widthTop = topWidth * prevRatio;
          const widthBottom = topWidth * currentRatio;

          const x1 = (funnelWidth - widthTop) / 2;
          const y1 = i * segmentHeight;
          const x2 = (funnelWidth + widthTop) / 2;
          const y2 = i * segmentHeight;
          const x3 = (funnelWidth + widthBottom) / 2;
          const y3 = (i + 1) * segmentHeight;
          const x4 = (funnelWidth - widthBottom) / 2;
          const y4 = (i + 1) * segmentHeight;

          return (
            <React.Fragment key={stage.name}>
              <polygon
                points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`}
                fill={`hsl(var(--primary) / ${1 - i * 0.15})`} // Slightly fade color down the funnel
                stroke="hsl(var(--primary))"
                strokeWidth="1"
              />
              <text
                x={funnelWidth / 2}
                y={y1 + segmentHeight / 2 + 5} // Center text vertically
                fontSize="10"
                fill="hsl(var(--primary-foreground))"
                textAnchor="middle"
              >
                {stage.name}: {stage.value.toLocaleString()}
              </text>
            </React.Fragment>
          );
        })}
      </svg>
    </Card>
  );
};

// --- Loading Skeleton for Charts ---
const ChartSkeleton = ({ title }) => (
  <Card className="p-4 animate-pulse">
    <CardTitle className="mb-4 text-muted-foreground">{title}</CardTitle>
    <div className="h-24 bg-muted rounded-lg w-full"></div>
    <div className="h-3 bg-muted rounded-lg w-1/2 mt-2"></div>
  </Card>
);

// --- Progress Bar Component for Goals ---
const ProgressBar = ({ label, current, target, unit, className }) => {
  const progress = Math.min(100, (current / target) * 100);
  const isComplete = current >= target;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{label}</span>
        <span className={cn("text-muted-foreground", isComplete && "text-green-500 font-semibold")}>
          {isComplete ? 'Goal Achieved!' : `${current.toLocaleString()} / ${target.toLocaleString()} ${unit}`}
        </span>
      </div>
      <div className="w-full bg-muted rounded-full h-2.5">
        <div
          className={cn("h-2.5 rounded-full transition-all duration-500 ease-out", isComplete ? "bg-green-500" : "bg-primary")}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};


// --- Date Range Selector Component ---
const DateRangeSelector = ({ selectedRange, onSelectRange }) => {
  const ranges = [
    { label: 'Last 7 Days', value: 'last-7-days' },
    { label: 'Last 30 Days', value: 'last-30-days' },
    { label: 'Last 90 Days', value: 'last-90-days' },
    { label: 'Last Year', value: 'last-year' },
  ];

  return (
    <Select value={selectedRange} onValueChange={onSelectRange} className="w-full md:w-auto max-w-xs">
      {ranges.map(range => (
        <SelectItem key={range.value} value={range.value}>
          {range.label}
        </SelectItem>
      ))}
    </Select>
  );
};

// Define BASE_METRIC_CONFIGS globally
const BASE_METRIC_CONFIGS = [
  { id: 'revenue', label: 'Total Revenue' },
  { id: 'users', label: 'Total Users' },
  { id: 'conversions', label: 'Conversions' },
  { id: 'cpc', label: 'Avg. CPC' },
  { id: 'impressions', label: 'Total Impressions' },
  { id: 'clicks', label: 'Total Clicks' },
  { id: 'growth', label: 'Overall Growth' }, // This one remains static
];


const DashboardPage = () => {
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const itemsPerPage = 5;
  const [dateRange, setDateRange] = useState('last-30-days');
  const [loadingData, setLoadingData] = useState(true); // Start loading true

  const [currentPeriodData, setCurrentPeriodData] = useState([]);
  const [prevPeriodData, setPrevPeriodData] = useState([]);

  useEffect(() => {
    setLoadingData(true);
    const timer = setTimeout(() => {
      const data = getFilteredData(fullMarketingData, dateRange);
      setCurrentPeriodData(data);

      // Calculate previous period data
      const today = new Date();
      let durationDays = 0;
      switch (dateRange) {
        case 'last-7-days': durationDays = 7; break;
        case 'last-30-days': durationDays = 30; break;
        case 'last-90-days': durationDays = 90; break;
        case 'last-year': durationDays = 365; break;
        default: durationDays = 30; break;
      }
      const endDatePrev = new Date(today);
      endDatePrev.setDate(today.getDate() - durationDays);
      const startDatePrev = new Date(today);
      startDatePrev.setDate(today.getDate() - (2 * durationDays));

      const prevData = fullMarketingData.filter(d => {
        const dDate = new Date(d.date);
        return dDate >= startDatePrev && dDate < endDatePrev;
      });
      setPrevPeriodData(prevData);

      setLoadingData(false);
    }, 500); // Simulate API call delay

    return () => clearTimeout(timer); // Cleanup on unmount or dependency change
  }, [dateRange]);


  const displayedKeyMetrics = useMemo(() => {
    if (loadingData) return BASE_METRIC_CONFIGS.map(m => ({ ...m, value: '...', change: '...', vsPrev: '...' }));

    return BASE_METRIC_CONFIGS.map(metricConfig => {
      if (metricConfig.id === 'growth') {
        // Handle static growth metric separately if needed, or derive it
        return { ...metricConfig, value: '10.5%', change: '+2.1%', type: 'positive', vsPrev: '+1.5% vs. Prev' };
      }
      return { ...metricConfig, ...getMetricValue(currentPeriodData, metricConfig.id, prevPeriodData) };
    });
  }, [currentPeriodData, prevPeriodData, loadingData]);


  const filteredCampaigns = campaignData.filter(campaign =>
    campaign.name.toLowerCase().includes(filterText.toLowerCase()) ||
    campaign.status.toLowerCase().includes(filterText.toLowerCase()) ||
    campaign.channel.toLowerCase().includes(filterText.toLowerCase())
  );

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const totalPages = Math.ceil(sortedCampaigns.length / itemsPerPage);
  const paginatedCampaigns = sortedCampaigns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };


  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Overview</h1>
        <DateRangeSelector selectedRange={dateRange} onSelectRange={setDateRange} />
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6"> {/* Increased gap, added xl grid */}
        {displayedKeyMetrics.map(metric => (
          <MetricCard key={metric.id} {...metric} />
        ))}
      </div>

      {/* Goals Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Goals Progress</CardTitle>
          <CardDescription>Track your key marketing objectives.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {marketingGoals.map(goal => (
            <ProgressBar
              key={goal.id}
              label={goal.label}
              current={goal.current}
              target={goal.target}
              unit={goal.unit}
            />
          ))}
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> {/* Increased gap */}
        <LineChartMock
          title="Revenue Trend"
          data={currentPeriodData}
          xAxisKey="date"
          yAxisKey="revenue"
          loading={loadingData}
        />
        <BarChartMock
          title="Users by Day"
          data={currentPeriodData.slice(-10)} // Still showing last 10 days of filtered data
          xAxisKey="date"
          yAxisKey="users"
          loading={loadingData}
        />
        <PieChartMock
          title="Conversions by Channel"
          data={[
            { channel: 'Google Ads', conversions: 300 },
            { channel: 'Facebook Ads', conversions: 250 },
            { channel: 'SEO', conversions: 150 },
            { channel: 'Email', conversions: 100 },
            { channel: 'Content', conversions: 50 },
          ]}
          valueKey="conversions"
          labelKey="channel"
          loading={loadingData}
        />
        <ConversionFunnelMock
          title="Marketing Funnel Performance"
          stages={[
            { name: 'Impressions', value: 500000 },
            { name: 'Clicks', value: 10000 },
            { name: 'Leads', value: 1000 },
            { name: 'Conversions', value: 100 },
          ]}
          loading={loadingData}
        />
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Detailed insights into your marketing campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Filter campaigns..."
            value={filterText}
            onChange={(e) => {
              setFilterText(e.target.value);
              setCurrentPage(1); // Reset to first page on filter
            }}
            className="mb-6 max-w-sm" // Increased bottom margin
          />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                  Campaign Name {sortColumn === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                  Status {sortColumn === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('channel')} className="cursor-pointer">
                  Channel {sortColumn === 'channel' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('budget')} className="cursor-pointer text-right">
                  Budget {sortColumn === 'budget' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('spend')} className="cursor-pointer text-right">
                  Spend {sortColumn === 'spend' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('conversions')} className="cursor-pointer text-right">
                  Conversions {sortColumn === 'conversions' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('revenueGenerated')} className="cursor-pointer text-right">
                  Revenue Generated {sortColumn === 'revenueGenerated' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
                <TableHead onClick={() => handleSort('roi')} className="cursor-pointer text-right">
                  ROI {sortColumn === 'roi' && (sortDirection === 'asc' ? '▲' : '▼')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCampaigns.length > 0 ? (
                paginatedCampaigns.map(campaign => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>{campaign.status}</TableCell>
                    <TableCell>{campaign.channel}</TableCell>
                    <TableCell className="text-right">${campaign.budget.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${campaign.spend.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{campaign.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${campaign.revenueGenerated.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</TableCell>
                    <TableCell className="text-right">{campaign.roi}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">No campaigns found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-end space-x-2 mt-6"> {/* Increased top margin */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <span className="flex items-center text-sm ml-2">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- New Reports Page Component ---
const ReportsPage = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [loadingData, setLoadingData] = useState(true);

  const [currentPeriodData, setCurrentPeriodData] = useState([]);

  useEffect(() => {
    setLoadingData(true);
    const timer = setTimeout(() => {
      const data = getFilteredData(fullMarketingData, dateRange);
      setCurrentPeriodData(data);
      setLoadingData(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [dateRange]);


  // Data for selectable metric chart
  const metricOptions = [
    { value: 'revenue', label: 'Revenue' },
    { value: 'users', label: 'Users' },
    { value: 'clicks', label: 'Clicks' },
    { value: 'impressions', label: 'Impressions' },
  ];

  const trafficSourceData = [
    { source: 'Organic Search', value: 4500 },
    { source: 'Paid Search', value: 3000 },
    { source: 'Social Media', value: 2000 },
    { source: 'Direct', value: 1500 },
    { source: 'Referral', value: 1000 },
    { source: 'Email', value: 800 },
  ];

  const topChannelsByConversions = campaignData
    .reduce((acc, campaign) => {
      acc[campaign.channel] = (acc[campaign.channel] || 0) + campaign.conversions;
      return acc;
    }, {});

  const topChannelsData = Object.entries(topChannelsByConversions)
    .map(([channel, conversions]) => ({ channel, conversions }))
    .sort((a, b) => b.conversions - a.conversions)
    .slice(0, 5); // Top 5

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Detailed Reports</h1>
        <DateRangeSelector selectedRange={dateRange} onSelectRange={setDateRange} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <PieChartMock
          title="Traffic Source Breakdown"
          data={trafficSourceData}
          valueKey="value"
          labelKey="source"
          loading={loadingData}
        />
        <ConversionFunnelMock
          title="Marketing Funnel Overview"
          stages={[
            { name: 'Website Visits', value: 100000 },
            { name: 'Product Views', value: 25000 },
            { name: 'Add to Cart', value: 5000 },
            { name: 'Checkout Initiated', value: 1500 },
            { name: 'Purchases', value: 500 },
          ]}
          loading={loadingData}
        />
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Select a metric to view its trend.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedMetric} onValueChange={setSelectedMetric} className="mb-4">
              {metricOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
            <LineChartMock
              title={`${metricOptions.find(opt => opt.value === selectedMetric)?.label} Trend`}
              data={currentPeriodData}
              xAxisKey="date"
              yAxisKey={selectedMetric}
              loading={loadingData}
            />
          </CardContent>
        </Card>
        <BarChartMock
          title="Top Channels by Conversions"
          data={topChannelsData}
          xAxisKey="channel"
          yAxisKey="conversions"
          loading={loadingData}
        />
        {/* New: Audience Segmentation */}
        <BarChartMock
          title="Audience Demographics (Age)"
          data={audienceData.age}
          xAxisKey="range"
          yAxisKey="users"
          loading={loadingData}
        />
        <PieChartMock
          title="Audience Demographics (Gender)"
          data={audienceData.gender}
          valueKey="users"
          labelKey="label"
          loading={loadingData}
        />
        {/* New: Geographical Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Geographical Performance</CardTitle>
            <CardDescription>Revenue and conversions by country.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingData ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">Loading data...</TableCell>
                  </TableRow>
                ) : (
                  geoData.map((geo, index) => (
                    <TableRow key={index}>
                      <TableCell>{geo.country}</TableCell>
                      <TableCell className="text-right">${geo.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{geo.conversions.toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


// --- Main App Component ---
function MainApp() { 
  const [activePage, setActivePage] = useState('dashboard'); // 'dashboard' or 'reports'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showPageContent, setShowPageContent] = useState(true); // State for page transition

  const { theme, setTheme } = useTheme(); 

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const NavLink = ({ pageName, children }) => (
    <Button
      variant={activePage === pageName ? 'secondary' : 'ghost'}
      className="w-full justify-start rounded-lg" // Ensure rounded corners for nav links
      onClick={() => {
        if (activePage !== pageName) { // Only animate if changing page
          setShowPageContent(false); // Hide current content
          setTimeout(() => {
            setActivePage(pageName); // Change page
            setShowPageContent(true); // Show new content with animation
          }, 300); // Match this duration with transition-all duration
        }
        setIsSidebarOpen(false); // Close sidebar on navigation
      }}
    >
      {children}
    </Button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-inter">
      {/* Tailwind CSS base styles and variables */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        :root {
          --background: 210 30% 98%; /* Lighter, slightly desaturated background */
          --foreground: 220 20% 15%; /* Darker text */
          --card: 0 0% 100%; /* White card background */
          --card-foreground: 220 20% 15%;
          --popover: 0 0% 100%;
          --popover-foreground: 220 20% 15%;
          --primary: 210 80% 45%; /* A modern blue */
          --primary-foreground: 210 20% 98%; /* White/light text on primary */
          --secondary: 210 40% 92%; /* Lighter blue/gray */
          --secondary-foreground: 220 20% 15%;
          --muted: 210 40% 94%;
          --muted-foreground: 215 15% 40%;
          --accent: 210 40% 92%;
          --accent-foreground: 220 20% 15%;
          --destructive: 0 84.2% 60.2%;
          --destructive-foreground: 210 20% 98%;
          --border: 210 20% 88%;
          --input: 210 20% 88%;
          --ring: 210 80% 45%;
          --radius: 0.75rem; /* Increased radius for softer corners */
        }
        .dark {
          --background: 220 25% 10%; /* Darker background */
          --foreground: 210 20% 95%; /* Lighter text */
          --card: 220 20% 12%; /* Darker card background */
          --card-foreground: 210 20% 95%;
          --popover: 220 20% 12%;
          --popover-foreground: 210 20% 95%;
          --primary: 210 80% 55%; /* Slightly brighter blue for dark mode */
          --primary-foreground: 220 20% 15%;
          --secondary: 210 20% 20%;
          --secondary-foreground: 210 20% 95%;
          --muted: 210 20% 20%;
          --muted-foreground: 215 15% 60%;
          --accent: 210 20% 20%;
          --accent-foreground: 210 20% 95%;
          --destructive: 0 62.8% 40.6%;
          --destructive-foreground: 210 20% 95%;
          --border: 210 20% 25%;
          --input: 210 20% 25%;
          --ring: 210 80% 55%;
        }
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        /* Subtle background pattern */
        .bg-pattern {
          background-image: radial-gradient(circle at 25% 25%, hsl(var(--muted)/0.1) 1px, transparent 0),
                            radial-gradient(circle at 75% 75%, hsl(var(--muted)/0.1) 1px, transparent 0);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/80 backdrop-blur-md"> {/* Added backdrop-blur for subtle glassmorphism effect */}
        <div className="container flex h-16 items-center px-4 md:px-8 justify-between">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-2xl tracking-tight">ADmyBRAND Insights</span> {/* Larger, tighter tracking */}
            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger onClick={() => setIsSidebarOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="sr-only">Toggle menu</span>
                </SheetTrigger>
                {isSidebarOpen && (
                  <SheetContent side="left" className="w-64 rounded-r-3xl"> {/* Rounded sheet */}
                    <SheetHeader>
                      <SheetTitle>Navigation</SheetTitle>
                      <SheetDescription>Explore the dashboard features.</SheetDescription>
                    </SheetHeader>
                    <nav className="flex flex-col space-y-2 mt-6"> {/* Increased margin */}
                      <NavLink pageName="dashboard">Dashboard</NavLink>
                      <NavLink pageName="reports">Reports</NavLink> {/* New Reports link */}
                    </nav>
                    <SheetFooter className="mt-auto">
                      <SheetClose onClick={() => setIsSidebarOpen(false)}>Close</SheetClose>
                    </SheetFooter>
                  </SheetContent>
                )}
              </Sheet>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* User Avatar/Profile (Placeholder) */}
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary"> {/* More styled avatar */}
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 bg-pattern"> {/* Added subtle pattern background */}
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border/70 bg-background/80 backdrop-blur-sm p-4 space-y-2"> {/* Added backdrop-blur */}
          <NavLink pageName="dashboard">Dashboard</NavLink>
          <NavLink pageName="reports">Reports</NavLink> {/* New Reports link */}
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            showPageContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            {activePage === 'dashboard' && <DashboardPage />}
            {activePage === 'reports' && <ReportsPage />}
          </div>
        </main>
      </div>
    </div>
  );
}

// --- Theme Toggle Component ---
function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full"> {/* Rounded button */}
      {theme === 'light' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="M4.93 4.93l1.41 1.41" />
          <path d="M17.66 17.66l1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="M4.93 19.07l1.41-1.41" />
          <path d="M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// Export the MainApp component wrapped in ThemeProvider
export default function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <MainApp />
    </ThemeProvider>
  );
}
