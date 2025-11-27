import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronDown,
  DollarSign,
  Phone,
  Calendar,
  TrendingUp,
  Calculator,
  ExternalLink,
  FileCheck,
  Settings,
  Rocket,
  Mail,
  CheckCircle2,
  Zap,
  Users,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Constants (matching ROIQuiz.tsx)
const FTE_MAP = { "1–3": 2, "4–6": 5, "7–9": 8, "10+": 12 };
const WAGE_MAP = { "$5–6k": 5500, "$6–7k": 6500, "$7k+": 7500 };
const CLINIC_MAP = { "1–5": 3, "6–10": 8, "10+": 12 };

interface QuizData {
  role: string;
  roleOther: string;
  clinicCountBand?: string;
  providers: string;
  callVolume: string;
  unansweredCalls: string;
  afterHoursCalls: string;
  fteReceptionists: string;
  monthlyWage: string;
  noShowRate: string;
  software: string;
  softwareOther: string;
  priorities: string[];
  priority: string;
  timeline: string;
  preferredPricing: string;
  billingModel: "per-use" | "fixed";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  state: string;
  preferredCallTime: string;
  avgRevenuePerAppointment: string;
  showupRate: string;
  aiRoutingShare: string;
  afterhoursSpend: string;
  fteSavings: string;
  appointmentsPerMonth: string;
  autoCalculateAppointments: boolean;
  consentMarketing: boolean;
  consentData: boolean;
  consentContact: boolean;
}

interface CalculationResults {
  annualStaffSaved: number;
  revenueRecoveredYear: number;
  afterHoursRevenue: number;
  annualNoShowSavings: number;
  afterHoursAnnualSaving: number;
  totalAnnualImpact: number;
  aiMonthlyCost: number;
  year1Cost: number;
  netMonthlyROI: number;
  setup: number;
  aiRoutedCallsPerMonth: number;
  perUseRate: number;
  monthlyAiInteractionCost: number;
  contractType: string;
  showupRate: number;
  afterHoursBookings: number;
  clinics: number;
  annualStaffSavedTotal: number;
  revenueRecoveredYearTotal: number;
  afterHoursRevenueTotal: number;
  annualNoShowSavingsTotal: number;
  afterHoursAnnualSavingTotal: number;
  totalAnnualImpactTotal: number;
  monthlyAICostTotal: number;
  year1CostTotal: number;
  billingModel: "per-use" | "fixed";
}

interface ROIResultsProps {
  quizData: QuizData;
  results: CalculationResults;
  showMonthly: boolean;
  setShowMonthly: (value: boolean) => void;
  calculationOpen: boolean;
  setCalculationOpen: (value: boolean) => void;
}

const ROIResults = ({
  quizData,
  results,
  showMonthly,
  setShowMonthly,
  calculationOpen,
  setCalculationOpen,
}: ROIResultsProps) => {
  // Collapsible sections state
  const [assumptionsOpen, setAssumptionsOpen] = useState(false);
  const [dataSourcesOpen, setDataSourcesOpen] = useState(false);

  // Calculate per-clinic values (primary display)
  const perClinicTotal = showMonthly
    ? Math.round(results.totalAnnualImpact / 12 / results.clinics)
    : Math.round(results.totalAnnualImpact / results.clinics);

  const perClinicNet = showMonthly
    ? Math.round(results.netMonthlyROI / results.clinics)
    : Math.round((results.netMonthlyROI * 12) / results.clinics);

  // Total across all clinics (secondary display)
  const targetTotal = showMonthly
    ? Math.round(results.totalAnnualImpact / 12)
    : results.totalAnnualImpact;

  const targetNet = showMonthly
    ? results.netMonthlyROI
    : (results.netMonthlyROI * 12);

  // Prepare chart data - per clinic values
  const benefitsData = [
    {
      name: "Staff Reduction Savings",
      value: showMonthly
        ? Math.round(results.annualStaffSaved / 12 / results.clinics)
        : Math.round(results.annualStaffSaved / results.clinics),
      totalValue: showMonthly
        ? Math.round(results.annualStaffSaved / 12)
        : results.annualStaffSaved,
      fill: "hsl(var(--persian-green))",
      icon: Users
    },
    {
      name: "Revenue From Missed Calls",
      value: showMonthly
        ? Math.round(results.revenueRecoveredYear / 12 / results.clinics)
        : Math.round(results.revenueRecoveredYear / results.clinics),
      totalValue: showMonthly
        ? Math.round(results.revenueRecoveredYear / 12)
        : results.revenueRecoveredYear,
      fill: "hsl(var(--watermelon-red))",
      icon: DollarSign
    },
    ...(results.afterHoursRevenue > 0 ? [{
      name: "Revenue From After Hour Calls",
      value: showMonthly
        ? Math.round(results.afterHoursRevenue / 12 / results.clinics)
        : Math.round(results.afterHoursRevenue / results.clinics),
      totalValue: showMonthly
        ? Math.round(results.afterHoursRevenue / 12)
        : results.afterHoursRevenue,
      fill: "hsl(var(--oxford-blue))",
      icon: Clock
    }] : []),
    {
      name: "Revenue From DNAs",
      value: showMonthly
        ? Math.round(results.annualNoShowSavings / 12 / results.clinics)
        : Math.round(results.annualNoShowSavings / results.clinics),
      totalValue: showMonthly
        ? Math.round(results.annualNoShowSavings / 12)
        : results.annualNoShowSavings,
      fill: "hsl(var(--soft-teal))",
      icon: Calendar
    }
  ];

  // Calculate payback period in months
  const paybackMonths = Math.ceil((showMonthly ? results.aiMonthlyCost : results.year1Cost) / (perClinicNet / (showMonthly ? 1 : 12)));
  const displayPayback = paybackMonths < 1 ? "<1" : paybackMonths.toString();

  return (
    <div className="bg-white">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-oxford-blue mb-4">
              Your Practice Transformation
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              See how 24/7 healthcare receptionist AI can revolutionize your practice
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center gap-2 bg-oxford-blue/5 rounded-lg p-1 mb-12">
              <button
                onClick={() => setShowMonthly(true)}
                className={cn(
                  "px-6 py-2 rounded-md font-semibold transition-all duration-300",
                  showMonthly
                    ? "bg-persian-green text-white shadow-lg scale-105"
                    : "text-muted-foreground hover:text-oxford-blue"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setShowMonthly(false)}
                className={cn(
                  "px-6 py-2 rounded-md font-semibold transition-all duration-300",
                  !showMonthly
                    ? "bg-persian-green text-white shadow-lg scale-105"
                    : "text-muted-foreground hover:text-oxford-blue"
                )}
              >
                Annual
              </button>
            </div>

            {/* Where Your Savings Come From */}
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-oxford-blue mb-3 text-center">Where Your Savings Come From</h2>
              <p className="text-center text-muted-foreground mb-8">Four key areas where AI transforms your practice</p>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {benefitsData.map((benefit) => {
                  const BenefitCard = () => {
                    const Icon = benefit.icon;
                    const percentage = Math.round((benefit.value / targetTotal) * 100);

                    return (
                      <Card
                        key={benefit.name}
                        className="p-6 bg-gradient-to-br from-white to-gray-50 border-2 hover:border-persian-green/50 hover:shadow-xl hover:-translate-y-1 transition-all"
                      >
                        <div className="flex flex-col items-center text-center">
                          {/* Progress Ring */}
                          <div className="w-24 h-24 mb-4 relative">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke="hsl(var(--muted))"
                                strokeWidth="8"
                                fill="none"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                stroke={benefit.fill}
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 40}`}
                                strokeDashoffset={`${2 * Math.PI * 40 * (1 - percentage / 100)}`}
                                className="transition-all duration-2000 ease-out"
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Icon className="w-8 h-8" style={{ color: benefit.fill }} />
                            </div>
                          </div>

                          <h3 className="font-semibold text-oxford-blue mb-2 text-sm md:text-base">{benefit.name}</h3>
                          <div className="text-2xl md:text-3xl font-bold mb-1" style={{ color: benefit.fill }}>
                            ${benefit.value.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            per clinic {showMonthly ? "per month" : "per year"}
                          </p>
                          {results.clinics > 1 && (
                            <p className="text-xs text-oxford-blue/70 font-medium">
                              ${benefit.totalValue.toLocaleString()} total
                            </p>
                          )}
                        </div>
                      </Card>
                    );
                  };

                  return <BenefitCard key={benefit.name} />;
                })}
              </div>
            </div>

                      {/* Simplified 24/7 Healthcare Receptionist AI System Cost */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-oxford-blue mb-6 text-center">24/7 Healthcare Receptionist AI Investment</h2>
            <Card className="p-8 bg-gradient-to-br from-oxford-blue/5 to-white border-2 border-oxford-blue/20">
              <div className="text-center mb-6">
                <Zap className="w-12 h-12 text-persian-green mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-oxford-blue mb-2">
                  System Cost
                </h3>
                <div className="text-4xl md:text-5xl font-bold text-persian-green mb-2">
                  ${showMonthly
                    ? results.aiMonthlyCost.toLocaleString()
                    : results.year1Cost.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  per clinic {showMonthly ? "per month" : "Year 1"}
                </p>
                {results.clinics > 1 && (
                  <div className="inline-block px-4 py-2 bg-persian-green/5 rounded-lg border border-persian-green/20">
                    <p className="text-sm text-oxford-blue font-medium">
                      ${showMonthly
                        ? results.monthlyAICostTotal.toLocaleString()
                        : results.year1CostTotal.toLocaleString()} total for {results.clinics} clinics
                    </p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 border text-center">
                  <p className="text-xs text-muted-foreground mb-1">Plan Type</p>
                  <p className="font-semibold text-oxford-blue">
                    {results.contractType === "flexible" ? "Flexible" : results.contractType === "12-month" ? "12-Month" : "24-Month"}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border text-center">
                  <p className="text-xs text-muted-foreground mb-1">Billing Model</p>
                  <p className="font-semibold text-oxford-blue">
                    {results.billingModel === "per-use" ? "Per-Use" : "Fixed/Unlimited"}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border text-center">
                  <p className="text-xs text-muted-foreground mb-1">Setup Fee</p>
                  <p className="font-semibold text-oxford-blue">
                    {results.setup > 0 ? `$${results.setup}` : "Waived"}
                  </p>
                </div>
              </div>
            </Card>
          </div>

            {/* Total Financial Benefit & Profit Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Total Financial Benefit Card */}
              <Card
                className="p-10 md:p-12 bg-gradient-to-br from-persian-green/10 via-soft-teal/5 to-white border-2 border-persian-green/20 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col items-center space-y-6">
                  {/* Simple icon header */}
                  <div className="w-20 h-20 rounded-full bg-persian-green/10 flex items-center justify-center">
                    <TrendingUp className="w-10 h-10 text-persian-green" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-semibold text-oxford-blue text-center">
                    Total Financial Benefit
                  </h3>

                  {/* Main dollar amount - PRIMARY FOCUS */}
                  <div className="text-5xl md:text-6xl font-bold text-persian-green">
                    ${perClinicTotal.toLocaleString()}
                  </div>

                  {/* Subtitle */}
                  <p className="text-base text-muted-foreground">
                    per clinic {showMonthly ? "per month" : "per year"}
                  </p>

                  {/* Collapsible Formula */}
                  <Collapsible className="w-full mt-6">
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-white/60 hover:bg-white/80 border border-persian-green/30 transition-all duration-200 group">
                        <Calculator className="w-4 h-4 text-persian-green" />
                        <span className="text-sm font-medium text-oxford-blue">How is this calculated?</span>
                        <ChevronDown className="w-4 h-4 text-persian-green group-data-[state=open]:rotate-180 transition-transform" />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="bg-white/70 rounded-lg p-4 border border-persian-green/20 space-y-2">
                        <p className="text-sm text-oxford-blue text-center leading-relaxed">
                          Staff Savings + Missed Call Revenue + After Hours Revenue + DNA Revenue
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Multi-clinic badge */}
                  {results.clinics > 1 && (
                    <div className="mt-4 px-5 py-3 bg-persian-green/5 rounded-lg border border-persian-green/20">
                      <p className="text-sm text-oxford-blue font-medium">
                        ${targetTotal.toLocaleString()} total across {results.clinics} clinics
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Your Profit After AI Cost Card */}
              <Card
                className="p-10 md:p-12 bg-gradient-to-br from-watermelon-red/10 via-oxford-blue/5 to-white border-2 border-watermelon-red/20 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col items-center space-y-6">
                  {/* Simple icon header */}
                  <div className="w-20 h-20 rounded-full bg-watermelon-red/10 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-watermelon-red" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-semibold text-oxford-blue text-center">
                    Your Profit After AI Cost
                  </h3>

                  {/* Main dollar amount - PRIMARY FOCUS */}
                  <div className="text-5xl md:text-6xl font-bold text-watermelon-red">
                    ${perClinicNet.toLocaleString()}
                  </div>

                  {/* Subtitle */}
                  <p className="text-base text-muted-foreground">
                    per clinic {showMonthly ? "per month" : "per year"}
                  </p>

                  {/* Collapsible Formula */}
                  <Collapsible className="w-full mt-6">
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-white/60 hover:bg-white/80 border border-watermelon-red/30 transition-all duration-200 group">
                        <Calculator className="w-4 h-4 text-watermelon-red" />
                        <span className="text-sm font-medium text-oxford-blue">How is this calculated?</span>
                        <ChevronDown className="w-4 h-4 text-watermelon-red group-data-[state=open]:rotate-180 transition-transform" />
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4">
                      <div className="bg-white/70 rounded-lg p-4 border border-watermelon-red/20 space-y-2">
                        <p className="text-sm text-oxford-blue text-center leading-relaxed">
                          Total Financial Benefit − AI System Cost = Your Net Profit
                        </p>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </Card>
            </div>
          </div>

          {/* Key Assumptions */}
          <Card className="mb-12 p-6 bg-gradient-to-br from-watermelon-red/5 to-oxford-blue/5 border-2 border-oxford-blue/20">
            <Collapsible open={assumptionsOpen} onOpenChange={setAssumptionsOpen}>
              <div className="text-center mb-6">
                <Calculator className="w-10 h-10 text-oxford-blue mx-auto mb-3" />
                <CollapsibleTrigger asChild>
                  <button className="w-full group">
                    <div className="flex items-center justify-center gap-2">
                      <h3 className="text-xl font-bold text-oxford-blue">
                        Key Calculation Assumptions
                      </h3>
                      <ChevronDown 
                        className={cn(
                          "w-5 h-5 text-oxford-blue transition-transform duration-300",
                          assumptionsOpen && "rotate-180"
                        )} 
                      />
                    </div>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto mt-2">
                      The ROI calculations are based on the following industry-standard assumptions. 
                      <strong className="text-oxford-blue"> Please refer to the calculation methodology for complete details.</strong>
                    </p>
                  </button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto text-left mt-6">
              {/* Core Business Assumptions */}
              <div className="bg-white rounded-lg p-4 border border-persian-green/30">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-persian-green mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-oxford-blue">
                      <strong>Reception FTE Reduction:</strong> 35% cost reduction per reception staff per clinic (realistic AI implementation)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-oxford-blue/30">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-oxford-blue mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-oxford-blue">
                      <strong>Business Days Per Month:</strong> 22 working days used for all monthly calculations
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-oxford-blue/30">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-oxford-blue mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-oxford-blue">
                      <strong>24/7 Healthcare Receptionist AI Routing:</strong> 60% of missed calls successfully routed by AI (default)
                    </p>
                  </div>
                </div>
              </div>

              {/* Revenue & Appointment Assumptions */}
              <div className="bg-white rounded-lg p-4 border border-watermelon-red/30">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-watermelon-red mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-oxford-blue">
                      <strong>Average Revenue Per Appointment:</strong> $68.49 (industry standard for general practice appointments)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-watermelon-red/30">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-watermelon-red mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-oxford-blue">
                      <strong>After-Hours Conversion:</strong> 50% of after-hours calls convert to appointment bookings
                    </p>
                  </div>
                </div>
              </div>

              {/* DNA & No-Show Assumptions */}
              <div className="bg-white rounded-lg p-4 border border-soft-teal/40">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-soft-teal mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-oxford-blue">
                      <strong>Baseline DNA Rate:</strong> 8% (RACGP data) - customizable based on your practice
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-soft-teal/40">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-soft-teal mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-oxford-blue">
                      <strong>Improved DNA Rate with AI:</strong> 50% reduction of your baseline DNA rate with automated reminders and follow-ups
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance & Wage Assumptions */}
              <div className="bg-white rounded-lg p-4 border border-oxford-blue/30">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-oxford-blue mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-oxford-blue">
                      <strong>Superannuation:</strong> 12% included in wage calculations (ATO mandate - Fair Work MA000027)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-persian-green/30">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-persian-green mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-oxford-blue">
                      <strong>Default Appointment Volume:</strong> 2,640 per month (based on typical 3-provider GP clinic)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                <strong className="text-oxford-blue">Note:</strong> These assumptions are based on Australian healthcare industry standards and may vary for individual practices. 
                Refer to the detailed calculation methodology in your email report for complete implementation details.
              </p>
            </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Data Sources - Simplified */}
          <Card className="mb-12 p-6 bg-gradient-to-br from-oxford-blue/5 to-white border-2 border-oxford-blue/10">
            <Collapsible open={dataSourcesOpen} onOpenChange={setDataSourcesOpen}>
              <CollapsibleTrigger asChild>
                <button className="w-full group">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="text-xl font-bold text-oxford-blue">
                      Industry Data Sources
                    </h3>
                    <ChevronDown className={cn(
                      "w-5 h-5 text-oxford-blue transition-transform duration-300",
                      dataSourcesOpen && "rotate-180"
                    )} />
                  </div>
                </button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
              <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left mt-6">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                  <ExternalLink className="w-5 h-5 text-persian-green mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="https://www1.racgp.org.au/newsgp/professional/how-much-do-no-show-patients-impact-you"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-persian-green hover:underline font-medium"
                    >
                      RACGP
                    </a>
                    <p className="text-sm text-muted-foreground">DNA rates & workload benchmarks</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                  <ExternalLink className="w-5 h-5 text-persian-green mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="https://calculate.fairwork.gov.au/Download/AwardSummary?awardCode=ma000027&fileType=pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-persian-green hover:underline font-medium"
                    >
                      Fair Work Australia
                    </a>
                    <p className="text-sm text-muted-foreground">Healthcare wage rates (MA000027)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                  <ExternalLink className="w-5 h-5 text-persian-green mt-1 flex-shrink-0" />
                  <div>
                    <a
                      href="https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-persian-green hover:underline font-medium"
                    >
                      ATO
                    </a>
                    <p className="text-sm text-muted-foreground">Superannuation guarantee (12%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                  <CheckCircle2 className="w-5 h-5 text-persian-green mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-oxford-blue">Healthscope / Telstra Health</p>
                    <p className="text-sm text-muted-foreground">AI automation benchmarks</p>
                  </div>
                </div>
              </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          <div className="mt-12 mb-12">
            <h3 className="text-2xl font-bold text-oxford-blue text-center mb-8">Go Live In 5 Steps</h3>
            <div className="grid md:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-persian-green flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white rounded-lg p-4 border border-oxford-blue/10 h-full">
                  <h4 className="font-semibold text-oxford-blue mb-2">Test it Now Live</h4>
                  <p className="text-sm text-muted-foreground">Experience the 24/7 AI Healthcare receptionist in action with a live test call</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-persian-green flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white rounded-lg p-4 border border-oxford-blue/10 h-full">
                  <h4 className="font-semibold text-oxford-blue mb-2">Book a Demo</h4>
                  <p className="text-sm text-muted-foreground">Schedule a free consultation to see how 24/7 healthcare receptionist AI works for your clinic</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-persian-green flex items-center justify-center mb-4">
                  <FileCheck className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white rounded-lg p-4 border border-oxford-blue/10 h-full">
                  <h4 className="font-semibold text-oxford-blue mb-2">Choose Your Plan</h4>
                  <p className="text-sm text-muted-foreground">Select flexible month-to-month, 12-month or 24-month contract pricing</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-persian-green flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white rounded-lg p-4 border border-oxford-blue/10 h-full">
                  <h4 className="font-semibold text-oxford-blue mb-2">Customised Setup</h4>
                  <p className="text-sm text-muted-foreground">We configure the 24/7 healthcare receptionist AI to match your practice workflows</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-persian-green flex items-center justify-center mb-4">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white rounded-lg p-4 border border-oxford-blue/10 h-full">
                  <h4 className="font-semibold text-oxford-blue mb-2">Go Live In Days</h4>
                  <p className="text-sm text-muted-foreground">Your 24/7 healthcare receptionist AI starts handling calls</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-persian-green hover:bg-persian-green/90 text-white px-8 py-6 text-lg"
                onClick={() => window.open('https://247aihealthcarereceptionist.eb-sites.com/5690409502900224', '_blank')}
              >
                Test it Now Live
              </Button>
              <Button
                size="lg"
                className="bg-watermelon-red hover:bg-watermelon-red/90 text-white px-8 py-6 text-lg"
                onClick={() => window.open('https://meetings.engagebay.com/demo-booking', '_blank')}
              >
                Book My Free Demo
              </Button>
            </div>

            {/* Privacy Notice for Results Page */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="bg-oxford-blue/5 border border-oxford-blue/10 rounded-lg p-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We respect your privacy — your details are stored in compliance with the Australian Privacy Principles (APPs) and are never shared with third parties without consent.
                  You can unsubscribe anytime by emailing{" "}
                  <a
                    href="mailto:hello@247aihealthcarereceptionist.com.au"
                    className="text-persian-green hover:underline font-medium"
                  >
                    hello@247aihealthcarereceptionist.com.au
                  </a>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROIResults;
