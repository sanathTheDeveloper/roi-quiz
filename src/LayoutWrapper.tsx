export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="roi-calculator-layout" data-wp-embedded="true">
      <div className="roi-calculator-content">
        {children}
      </div>
    </div>
  );
}
