import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { ArrowLeft, ArrowRight, Calculator, Info, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import PricingTableModal from "@/components/quiz/PricingTableModal";
import ROIResults from "@/components/quiz/ROIResults";


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
  priority: string; // Legacy field for backward compatibility
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
  fteSavings: string; // Number of FTEs that AI will replace/avoid (0-3+)
  appointmentsPerMonth: string; // Total appointments per month for no-show calculation
  autoCalculateAppointments: boolean; // Auto-calculate appointments from HCP count
  consentMarketing: boolean; // Consent for marketing and contact
  consentData: boolean; // Consent for data sharing with Healthengine
  consentContact: boolean; // Consent to be contacted about ROI results and demo
}

// SINGLE SOURCE OF TRUTH: Band midpoints (matching spec exactly)
const FTE_MAP = { "1–3": 2, "4–6": 5, "7–9": 8, "10+": 12 };
const WAGE_MAP = { "$5–6k": 5500, "$6–7k": 6500, "$7k+": 7500 };
const CLINIC_MAP = { "1–5": 3, "6–10": 8, "10+": 12 };

// Daily → Monthly conversion constant
const BUSINESS_DAYS_PER_MONTH = 22;

  // Pricing tiers (updated per specification)
  const PRICING = {
    setup: { flexible: 599, "12-month": 0, "24-month": 0 },
    subscription: 499, // Per clinic per month
    perUse: { flexible: 0.40, "12-month": 0.40, "24-month": 0.30 },
    fixed: {
      "1-5":  { flexible: 1999, "12-month": 1999, "24-month": 1499 },
      "6-10": { flexible: 3999, "12-month": 3999, "24-month": 3499 },
      "10+":  { flexible: 5999, "12-month": 5999, "24-month": 4499 },
    },
  };

  // HCP midpoint map for auto-calculating appointments
  const HCP_MAP = { "1–5": 3, "6–10": 8, "10+": 12 };

const ROIQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [calculationOpen, setCalculationOpen] = useState(true);
  const [showMonthly, setShowMonthly] = useState(true); // Monthly view by default
  const { toast } = useToast();
  const [quizData, setQuizData] = useState<QuizData>({
    role: "",
    roleOther: "",
    clinicCountBand: "",
    providers: "",
    callVolume: "",
    unansweredCalls: "",
    afterHoursCalls: "",
    fteReceptionists: "",
    monthlyWage: "",
    noShowRate: "8",  // Default: 8% DNA rate (RACGP baseline)
    software: "",
    softwareOther: "",
    priorities: [],
    priority: "", // Legacy field for backward compatibility
    timeline: "",
    preferredPricing: "",
    billingModel: "per-use",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    preferredCallTime: "",
    avgRevenuePerAppointment: "68.49",  // Default: 68.49 AUD (minimum viable revenue)
    showupRate: "92",                 // Default: 92% (100 - 8% DNA)
    aiRoutingShare: "60",             // Default: 60% (from Healthscope & Telstra Health benchmarks)
    afterhoursSpend: "0",             // Default: 0 AUD (optional field)
    fteSavings: "1",                  // Legacy: replaced by 0.65 multiplier logic
    appointmentsPerMonth: "2640",     // Default: auto-calculated from HCP × 40 × 22
    autoCalculateAppointments: true,  // Auto-calculate by default
    consentMarketing: false,          // Default: false
    consentData: false,               // Default: false
    consentContact: false,            // Default: false
  });
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions: Array<{
    title: string;
    field: keyof QuizData;
    options?: string[];
    helper?: string;
    type?: 'radio' | 'input';
    inputType?: 'number' | 'text';
    min?: number;
    max?: number;
    placeholder?: string;
  }> = [
    {
      title: "What's your role?",
      field: "role" as keyof QuizData,
      options: [
        "Practice Owner",
        "Practice Manager",
        "Executive / Director (CEO or CMO)",
        "Other"
      ]
    },
    {
      title: "Practice software used",
      field: "software" as keyof QuizData,
      options: ["Best Practice", "Medical Director", "Other"]
    },
    {
      title: "Timeline for exploring solutions",
      field: "timeline" as keyof QuizData,
      options: ["Immediately", "Within 1 month", "1-3 months", "3-6 months", "Just exploring"]
    },
    {
      title: "What are your top priorities? (choose up to 3)",
      field: "priorities" as keyof QuizData,
      options: ["Reduce costs", "Improve patient experience", "Increase revenue", "Staff efficiency", "24/7 availability"],
      helper: "Select up to three priorities that best describe your goals."
    },
    {
      title: "Number of Health Care Providers (Doctors, Nurses and Allied Health) per clinic?",
      field: "providers" as keyof QuizData,
      options: ["1–5", "6–10", "10+"]
    },
    {
      title: "Preferred pricing",
      field: "preferredPricing" as keyof QuizData,
      options: ["Flexible", "12-month contract", "24-month contract"]
    },
    {
      title: "Billing Model",
      field: "billingModel" as keyof QuizData,
      options: ["per-use", "fixed"]
    },
    {
      title: "Average Daily Patient call volume per clinic",
      field: "callVolume" as keyof QuizData,
      type: "input",
      inputType: "number",
      min: 1,
      placeholder: "",
    },
    {
      title: "Average Daily Unanswered calls per clinic",
      field: "unansweredCalls" as keyof QuizData,
      type: "input",
      inputType: "number",
      min: 1,
      max: Number(quizData.callVolume) || undefined,
      placeholder: "",
      helper: `Enter the average number of unanswered calls per clinic (max: ${Number(quizData.callVolume) || 'call volume'})`
    },
    {
      title: "Average Daily After hours calls expected per clinic",
      field: "afterHoursCalls" as keyof QuizData,
      type: "input",
      inputType: "number",
      min: 1,
      placeholder: "",
    },
    {
      title: "Average no-show (Did Not Attend) rate as a percentage (min: 5%, max: 8%)",
      field: "noShowRate" as keyof QuizData,
      type: "input",
      inputType: "number",
      min: 5,
      max: 8,
      placeholder: "8",
    },
    {
      title: "Average revenue per attended appointment",
      field: "avgRevenuePerAppointment" as keyof QuizData,
      type: "input",
      inputType: "number",
      min: 68.49,
      placeholder: "68.49",
    },
    {
      title: "Monthly Average wage for receptionist/s incl. 12% super (Sick leave and Annual leave not included)",
      field: "monthlyWage" as keyof QuizData,
      type: "input",
      inputType: "number",
      min: 1,
      placeholder: "",
      helper: "Note: Average Salary/Wage for 1 FT Receptionist in Australia including 12% Super is $6,000/month",
    }
  ];

  const getHCPBand = (providers: string) => {
    if (providers === "6–10") return "6-10";
    if (providers === "10+") return "10+";
    return "1-5";
  };

  const calculateResults = (overrideRoutingShare?: number) => {
    // Helper for band midpoints
    const bandMidpoint = (label: string, map: Record<string, number>, fallback: number) =>
      map[label] ?? fallback;

    // HCP Band derivation
    const hcpBand = (quizData.providers === "1–5") ? "1-5"
                  : (quizData.providers === "6–10") ? "6-10" : "10+";

    // Contract key
    const contractKey =
      quizData.preferredPricing === "Flexible" ? "flexible"
      : quizData.preferredPricing === "12-month contract" ? "12-month"
                                                   : "24-month";

    // Always calculate for 1 clinic (per-clinic basis)
    const clinics = 1;

    // Core assumptions (using defaults from spec)
    const avgBillable = Number(quizData.avgRevenuePerAppointment || 68.49);
    const showUpRate  = (100 - Number(quizData.noShowRate || 8)) / 100;  // Derived from DNA rate (default 8% DNA = 92% show-up)
    const routingShare = Number(quizData.aiRoutingShare || 60) / 100;   // Use user input or default to 60%
    const afterHours   = Number(quizData.afterhoursSpend || 0);        // Optional field, default 0
    
    // STAFFING REDUCTION: Direct wage input with 35% reduction assumption
    const monthlyWageAmount = Number(quizData.monthlyWage || 5500);  // Direct wage input
    const fteSavingsCount = 0.35;  // 35% reduction rate (realistic for AI implementation)

    // APPOINTMENTS CALCULATION: Use direct input
    // Default based on typical GP clinic: 3 providers × 40 patients/day × 22 working days/month = 2640
    const appointmentsPerMonth = Number(quizData.appointmentsPerMonth || 2640);
    
    // No-show calculation parameters (user-provided baseline)
    const baselineDNA = Number(quizData.noShowRate || 8) / 100;  // User's current DNA rate
    const improvedDNA = baselineDNA * 0.5;  // 50% improvement of user's DNA rate with AI

    // MISSED_PER_MONTH = unanswered calls per day × 22
    const missedPerDayMid = Number(quizData.unansweredCalls) || 50; // Use direct input or fallback to 25
    const MISSED_PER_MONTH = missedPerDayMid * BUSINESS_DAYS_PER_MONTH;

    // AI_ROUTED = MISSED_PER_MONTH × routingShare (SINGLE SOURCE OF TRUTH)
    const AI_ROUTED = Math.round(MISSED_PER_MONTH * routingShare);

    // Pricing calculations - using PRICING object as single source of truth
    const SUBSCRIPTION = PRICING.subscription;
    const SETUP = PRICING.setup[contractKey as "flexible" | "12-month" | "24-month"];
    const PER_USE = PRICING.perUse[contractKey as "flexible" | "12-month" | "24-month"];

    const FIXED_TIER = (quizData.billingModel === "fixed")
      ? PRICING.fixed[hcpBand as "1-5" | "6-10" | "10+"][contractKey as "flexible" | "12-month" | "24-month"]
      : 0;

    // Monthly AI cost (per clinic)
    const usageFee = (quizData.billingModel === "per-use") ? AI_ROUTED * PER_USE : 0;
    const monthlyAiCost = quizData.billingModel === "fixed" ? FIXED_TIER : SUBSCRIPTION + usageFee;
    const setupFee = SETUP;
    const year1PerClinic = (monthlyAiCost * 12) + setupFee;

    // 1) STAFFING SAVINGS (using direct wage input with 12% super already included)
    // Note: User input already includes 12% superannuation as specified in question
    const monthlyStaffingSavedPerClinic = monthlyWageAmount * fteSavingsCount;
    const annualStaffSavedPerClinic = monthlyStaffingSavedPerClinic * 12;

    // 2) REVENUE RECOVERED from missed calls
    const recoveredBookingsPerMonth = AI_ROUTED * showUpRate;
    const recoveredRevenuePerMonth  = recoveredBookingsPerMonth * avgBillable;
    const recoveredRevenueAnnualPerClinic = recoveredRevenuePerMonth * 12;

    // 3) AFTER-HOURS REVENUE GENERATED (NEW)
    const afterHoursCallsPerDay = Number(quizData.afterHoursCalls) || 0;
    const afterHoursCallsPerMonth = afterHoursCallsPerDay * BUSINESS_DAYS_PER_MONTH;
    const afterHoursBookingRate = 0.5; // 50% of after hours calls convert to bookings
    const afterHoursBookingsPerMonth = afterHoursCallsPerMonth * afterHoursBookingRate;
    const afterHoursRevenuePerMonth = afterHoursBookingsPerMonth * avgBillable;
    const afterHoursRevenueAnnualPerClinic = afterHoursRevenuePerMonth * 12;

    // 4) NO-SHOW SAVINGS
    const noShowReduction = baselineDNA - improvedDNA;  // 3% reduction
    const appointmentsSavedPerMonth = appointmentsPerMonth * noShowReduction;
    const noShowSavingsPerMonth = appointmentsSavedPerMonth * avgBillable;
    const annualNoShowSavingsPerClinic = noShowSavingsPerMonth * 12;

    // 5) AFTER-HOURS COST SAVINGS (from replacing answering service)
    const afterHoursAnnualSavingPerClinic = afterHours > 0 ? afterHours * 12 : 0;

    // TOTAL ANNUAL IMPACT = sum of all 5 drivers
    const totalAnnualImpactPerClinic = 
      annualStaffSavedPerClinic + 
      recoveredRevenueAnnualPerClinic + 
      afterHoursRevenueAnnualPerClinic + 
      annualNoShowSavingsPerClinic + 
      afterHoursAnnualSavingPerClinic;

    // Monthly benefit & net impact (per clinic)
    const monthlyBenefitPerClinic = 
      monthlyStaffingSavedPerClinic + 
      recoveredRevenuePerMonth + 
      afterHoursRevenuePerMonth + 
      noShowSavingsPerMonth + 
      afterHours;
    const netMonthlyImpactPerClinic = monthlyBenefitPerClinic - monthlyAiCost;

    // Totals (multi-site)
    const monthlyAiCostTotal   = monthlyAiCost * clinics;
    const netMonthlyROITotal   = netMonthlyImpactPerClinic * clinics;
    const year1CostTotal       = year1PerClinic * clinics;
    const recoveredRevenueAnnualTotal     = recoveredRevenueAnnualPerClinic * clinics;
    const afterHoursRevenueAnnualTotal = afterHoursRevenueAnnualPerClinic * clinics;
    const annualStaffSavedTotal = annualStaffSavedPerClinic * clinics;
    const annualNoShowSavingsTotal = annualNoShowSavingsPerClinic * clinics;
    const afterHoursAnnualSavingTotal = afterHoursAnnualSavingPerClinic * clinics;
    const totalAnnualImpactTotal = totalAnnualImpactPerClinic * clinics;

    // Human receptionist cost (for comparison)
    const humanMonthlyCost = monthlyWageAmount; // Direct wage input
    const humanMonthlyCostTotal = humanMonthlyCost * clinics;

    return {
      // per clinic
      monthlyAICost: Math.round(monthlyAiCost),
      year1Cost: Math.round(year1PerClinic),
      recoveredRevenue: Math.round(recoveredRevenueAnnualPerClinic),
      revenueRecoveredYear: Math.round(recoveredRevenueAnnualPerClinic),
      afterHoursRevenue: Math.round(afterHoursRevenueAnnualPerClinic),
      afterHoursRevenueYear: Math.round(afterHoursRevenueAnnualPerClinic),
      annualStaffSaved: Math.round(annualStaffSavedPerClinic),
      annualNoShowSavings: Math.round(annualNoShowSavingsPerClinic),
      afterHoursAnnualSaving: Math.round(afterHoursAnnualSavingPerClinic),
      totalAnnualImpact: Math.round(totalAnnualImpactPerClinic),
      monthlyBenefit: Math.round(monthlyBenefitPerClinic),
      netMonthlyROI: Math.round(netMonthlyImpactPerClinic),
      setup: setupFee,
      recoveredBookings: Math.round(recoveredBookingsPerMonth),
      afterHoursBookings: Math.round(afterHoursBookingsPerMonth),
      afterHoursRevenuePerMonth: Math.round(afterHoursRevenuePerMonth),
      aiRoutedCallsPerMonth: AI_ROUTED,
      humanMonthlyCost: Math.round(humanMonthlyCost),
      aiMonthlyCost: Math.round(monthlyAiCost),
      monthlyAiInteractionCost: Math.round(usageFee),
      missedPerDay: missedPerDayMid,
      showupRate: showUpRate * 100,
      fteSavingsCount,
      noShowSavingsPerMonth: Math.round(noShowSavingsPerMonth),
      perUseRate: PER_USE,
      contractType: contractKey,
      billingModel: quizData.billingModel,
      routingSharePercent: routingShare * 100, // Return the actual routing share used

      // Appointments per month for display
      appointmentsPerMonth,

      // totals
      clinics,
      monthlyAICostTotal: Math.round(monthlyAiCostTotal),
      year1CostTotal: Math.round(year1CostTotal),
      recoveredRevenueTotal: Math.round(recoveredRevenueAnnualTotal),
      revenueRecoveredYearTotal: Math.round(recoveredRevenueAnnualTotal),
      afterHoursRevenueTotal: Math.round(afterHoursRevenueAnnualTotal),
      afterHoursRevenueYearTotal: Math.round(afterHoursRevenueAnnualTotal),
      annualStaffSavedTotal: Math.round(annualStaffSavedTotal),
      annualNoShowSavingsTotal: Math.round(annualNoShowSavingsTotal),
      afterHoursAnnualSavingTotal: Math.round(afterHoursAnnualSavingTotal),
      totalAnnualImpactTotal: Math.round(totalAnnualImpactTotal),
      netMonthlyROITotal: Math.round(netMonthlyROITotal),
      humanMonthlyCostTotal: Math.round(humanMonthlyCostTotal),
    };
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Skip inputs step, move directly to lead capture
      setCurrentStep(questions.length + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Calculate results first
      const calculatedResults = calculateResults();
      
      // Prepare payload for WordPress REST API
      const payload = {
        // Contact info
        firstName: quizData.firstName,
        lastName: quizData.lastName,
        email: quizData.email,
        phone: quizData.phone,
        role: quizData.role,
        roleOther: quizData.roleOther,
        state: quizData.state,
        preferredCallTime: quizData.preferredCallTime,

        // Practice details
        providers: quizData.providers,
        clinicCountBand: quizData.clinicCountBand,
        callVolume: quizData.callVolume,
        unansweredCalls: quizData.unansweredCalls,
        afterHoursCalls: quizData.afterHoursCalls,
        fteReceptionists: quizData.fteReceptionists,
        monthlyWage: quizData.monthlyWage,
        noShowRate: quizData.noShowRate,
        software: quizData.software,
        softwareOther: quizData.softwareOther,
        priorities: quizData.priorities,
        timeline: quizData.timeline,
        preferredPricing: quizData.preferredPricing,
        billingModel: quizData.billingModel,
        avgRevenuePerAppointment: quizData.avgRevenuePerAppointment,
        aiRoutingShare: quizData.aiRoutingShare,
        afterhoursSpend: quizData.afterhoursSpend,
        appointmentsPerMonth: quizData.appointmentsPerMonth,
        
        // Calculated results
        totalMonthlySavings: calculatedResults.netMonthlyROI,
        totalAnnualImpact: calculatedResults.totalAnnualImpact,
        staffingSavings: calculatedResults.annualStaffSaved,
        revenueSavings: calculatedResults.revenueRecoveredYear,
        noShowSavings: calculatedResults.annualNoShowSavings,
        humanMonthlyCost: calculatedResults.humanMonthlyCost,
        aiMonthlyCost: calculatedResults.aiMonthlyCost,
        setupFee: calculatedResults.setup,
        year1TotalCost: calculatedResults.year1Cost,
        
        // Consent flags
        consentMarketing: quizData.consentMarketing,
        consentData: quizData.consentData,
        consentContact: quizData.consentContact,
      };
      
      // Submit to WordPress REST API endpoint
      const response = await fetch(
        '/wp-json/roi-calculator/v1/submit-lead',
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      const result = await response.json();
      
      // Show success and results
      toast({ 
        title: "Success!", 
        description: result.synced 
          ? "Your ROI report has been generated and saved." 
          : "Your ROI report has been generated."
      });
      setShowResults(true);
      
    } catch (error) {
      console.error('Submission error:', error);
      
      // Store for manual retry
      const payload = {
        firstName: quizData.firstName,
        lastName: quizData.lastName,
        email: quizData.email,
        phone: quizData.phone,
        role: quizData.role,
        state: quizData.state,
      };
      localStorage.setItem('pendingLead', JSON.stringify(payload));
      
      // Still show results even if submission failed
      toast({ 
        title: "Results Ready!", 
        description: "Your ROI calculations are displayed below. We'll retry saving your information." 
      });
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateQuizData = (field: keyof QuizData, value: string | boolean) => {
    setQuizData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate results using the user's input for routing share
  const results = calculateResults();


  // Scroll to top when results are shown
  useEffect(() => {
    if (showResults) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [showResults]);

  if (showResults) {
    return (
      <ROIResults
        quizData={quizData}
        results={results}
        showMonthly={showMonthly}
        setShowMonthly={setShowMonthly}
        calculationOpen={calculationOpen}
        setCalculationOpen={setCalculationOpen}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-oxford-blue mb-2 md:mb-3">
              What's the cost of missed calls in your practice?
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
              Discover your potential savings with AI reception in ~2 minutes
            </p>
          </div>

          <Card className="p-8">
            {currentStep < questions.length ? (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      Question {currentStep + 1} of {questions.length + 1}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {Math.round(((currentStep + 1) / (questions.length + 1)) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-soft-gray rounded-full h-2">
                    <div
                      className="bg-persian-green h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentStep + 1) / (questions.length + 1)) * 100}%` }}
                    />
                  </div>
                </div>

              <div className="flex items-start justify-between gap-4 mb-6">
                <h2 className="text-2xl font-semibold text-oxford-blue">
                  {questions[currentStep].title}
                </h2>
                
                {(questions[currentStep].field === "preferredPricing" || questions[currentStep].field === "billingModel") && (
                  <PricingTableModal 
                    highlightPlan={quizData.preferredPricing === "Flexible" ? "flexible" : quizData.preferredPricing === "12-month contract" ? "12-month" : "24-month"}
                    highlightBilling={quizData.billingModel as "per-use" | "fixed"}
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2 text-persian-green border-persian-green hover:bg-persian-green/5 flex-shrink-0"
                    >
                      <Info className="w-4 h-4" />
                      View Pricing Details
                    </Button>
                  </PricingTableModal>
                )}
              </div>

                {questions[currentStep].helper && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {questions[currentStep].helper}
                  </p>
                )}

                {questions[currentStep].field === "priorities" ? (
                  <div>
                    <div className="space-y-2">
                      {questions[currentStep].options?.map((option) => {
                        const isSelected = quizData.priorities.includes(option);
                        const isDisabled = !isSelected && quizData.priorities.length >= 3;

                        return (
                          <Label
                            key={option}
                            htmlFor={option}
                            className={cn(
                              "flex items-center gap-2 py-2 px-3 rounded border cursor-pointer transition-colors",
                              isSelected
                                ? "bg-gray-50 border-gray-300"
                                : "border-gray-200 hover:bg-gray-50",
                              isDisabled && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={(e) => {
                              if (isDisabled) {
                                e.preventDefault();
                                toast({
                                  title: "Selection limit reached",
                                  description: "You can choose up to three.",
                                  duration: 2000,
                                });
                              }
                            }}
                          >
                            <Checkbox
                              id={option}
                              checked={isSelected}
                              disabled={isDisabled}
                              onCheckedChange={(checked) => {
                                if (isDisabled && checked) {
                                  toast({
                                    title: "Selection limit reached",
                                    description: "You can choose up to three.",
                                    duration: 2000,
                                  });
                                  return;
                                }

                                const newPriorities = checked
                                  ? [...quizData.priorities, option]
                                  : quizData.priorities.filter(p => p !== option);

                                setQuizData({
                                  ...quizData,
                                  priorities: newPriorities,
                                  priority: newPriorities[0] || "" // Legacy field gets first selection
                                });
                              }}
                              className="pointer-events-none"
                            />
                            <span className="flex-1 text-sm">
                              {option}
                            </span>
                          </Label>
                        );
                      })}
                    </div>
                    <div
                      className="mt-3 text-sm text-muted-foreground"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      {quizData.priorities.length} of 3 selected
                    </div>
                  </div>
                ) : questions[currentStep].type === "input" ? (
                  <div>
                    {questions[currentStep].field === "noShowRate" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type={questions[currentStep].inputType || "text"}
                          min={questions[currentStep].min}
                          max={questions[currentStep].max}
                          placeholder={questions[currentStep].placeholder}
                          value={String(quizData[questions[currentStep].field] || "")}
                          onChange={(e) => updateQuizData(questions[currentStep].field, e.target.value)}
                          className="text-lg p-4 w-24"
                        />
                        <span className="text-lg font-medium text-oxford-blue">%</span>
                      </div>
                    ) : questions[currentStep].field === "avgRevenuePerAppointment" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-oxford-blue">$</span>
                        <Input
                          type={questions[currentStep].inputType || "text"}
                          min={questions[currentStep].min}
                          max={questions[currentStep].max}
                          placeholder={questions[currentStep].placeholder}
                          value={String(quizData[questions[currentStep].field] || "")}
                          onChange={(e) => updateQuizData(questions[currentStep].field, e.target.value)}
                          className="text-lg p-4 w-32"
                        />
                        <span className="text-lg font-medium text-oxford-blue">AUD</span>
                      </div>
                    ) : questions[currentStep].field === "monthlyWage" ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-oxford-blue">$</span>
                        <Input
                          type={questions[currentStep].inputType || "text"}
                          min={questions[currentStep].min}
                          max={questions[currentStep].max}
                          placeholder={questions[currentStep].placeholder}
                          value={String(quizData[questions[currentStep].field] || "")}
                          onChange={(e) => updateQuizData(questions[currentStep].field, e.target.value)}
                          className="text-lg p-4 w-40"
                        />
                        <span className="text-lg font-medium text-oxford-blue">AUD</span>
                      </div>
                    ) : (
                      <Input
                        type={questions[currentStep].inputType || "text"}
                        min={questions[currentStep].min}
                        max={questions[currentStep].max}
                        placeholder={questions[currentStep].placeholder}
                        value={String(quizData[questions[currentStep].field] || "")}
                        onChange={(e) => updateQuizData(questions[currentStep].field, e.target.value)}
                        className="text-lg p-4"
                      />
                    )}
                    {questions[currentStep].field === "callVolume" &&
                     quizData.callVolume &&
                     Number(quizData.callVolume) < 1 && (
                      <p className="text-xs text-red-500 mt-2">
                        Please enter a value of at least 1 call per day
                      </p>
                    )}
                    {questions[currentStep].field === "unansweredCalls" &&
                     quizData.unansweredCalls &&
                     (Number(quizData.unansweredCalls) < 1 || Number(quizData.unansweredCalls) > Number(quizData.callVolume)) && (
                      <p className="text-xs text-red-500 mt-2">
                        Please enter a value between 1 and {Number(quizData.callVolume) || 'your call volume'} calls per day
                      </p>
                    )}
                    {questions[currentStep].field === "afterHoursCalls" &&
                     quizData.afterHoursCalls &&
                     Number(quizData.afterHoursCalls) < 1 && (
                      <p className="text-xs text-red-500 mt-2">
                        Please enter a value of at least 1 call per day
                      </p>
                    )}
                    {questions[currentStep].field === "noShowRate" && 
                     quizData.noShowRate && 
                     (Number(quizData.noShowRate) < 5 || Number(quizData.noShowRate) > 8) && (
                      <p className="text-xs text-red-500 mt-2">
                        Please enter a value between 5% and 8%
                      </p>
                    )}
                    {questions[currentStep].field === "avgRevenuePerAppointment" &&
                     quizData.avgRevenuePerAppointment &&
                     Number(quizData.avgRevenuePerAppointment) < 68.49 && (
                      <p className="text-xs text-red-500 mt-2">
                        Please enter a value of at least $68.49 AUD
                      </p>
                    )}
                    {questions[currentStep].field === "monthlyWage" &&
                     quizData.monthlyWage &&
                     Number(quizData.monthlyWage) < 1 && (
                      <p className="text-xs text-red-500 mt-2">
                        Please enter a valid monthly wage in AUD
                      </p>
                    )}
                  </div>
                ) : (
                  <RadioGroup
                    value={String(quizData[questions[currentStep].field] || "")}
                    onValueChange={(value) => updateQuizData(questions[currentStep].field, value)}
                    className="space-y-2"
                  >
                  {questions[currentStep].options?.map((option) => (
                    <div key={option}>
                      <div className="flex items-center space-x-2 py-2 px-3 rounded border border-gray-200 hover:bg-gray-50">
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className="flex-1 cursor-pointer text-sm">
                          {option}
                        </Label>
                      </div>
                      {questions[currentStep].field === "role" && option === "Practice Owner" && quizData.role === "Practice Owner" && (
                        <div className="ml-6 mt-2 mb-2">
                          <Label className="text-sm font-medium">Number of clinics?</Label>
                          <RadioGroup
                            value={quizData.clinicCountBand}
                            onValueChange={(value) => updateQuizData("clinicCountBand", value)}
                            className="space-y-2 mt-2"
                          >
                            {["1-3", "3-5", "5-7", "7+"].map((clinicOption) => (
                              <div key={clinicOption} className="flex items-center space-x-2 py-1.5 px-2 rounded border border-gray-200 hover:bg-gray-50">
                                <RadioGroupItem value={clinicOption} id={`clinic-${clinicOption}`} />
                                <Label htmlFor={`clinic-${clinicOption}`} className="flex-1 cursor-pointer text-sm">
                                  {clinicOption}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                      {questions[currentStep].field === "role" && option === "Practice Manager" && quizData.role === "Practice Manager" && (
                        <div className="ml-6 mt-2 mb-2">
                          <Label className="text-sm font-medium">Number of clinics?</Label>
                          <RadioGroup
                            value={quizData.clinicCountBand}
                            onValueChange={(value) => updateQuizData("clinicCountBand", value)}
                            className="space-y-2 mt-2"
                          >
                            {["1-3", "3-5", "5-7", "7+"].map((clinicOption) => (
                              <div key={clinicOption} className="flex items-center space-x-2 py-1.5 px-2 rounded border border-gray-200 hover:bg-gray-50">
                                <RadioGroupItem value={clinicOption} id={`clinic-${clinicOption}`} />
                                <Label htmlFor={`clinic-${clinicOption}`} className="flex-1 cursor-pointer text-sm">
                                  {clinicOption}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                      {questions[currentStep].field === "role" && option === "Executive / Director (CEO or CMO)" && quizData.role === "Executive / Director (CEO or CMO)" && (
                        <div className="ml-6 mt-2 mb-2">
                          <Label className="text-sm font-medium">Number of clinics?</Label>
                          <RadioGroup
                            value={quizData.clinicCountBand}
                            onValueChange={(value) => updateQuizData("clinicCountBand", value)}
                            className="space-y-2 mt-2"
                          >
                            {["1-3", "3-5", "5-7", "7+"].map((clinicOption) => (
                              <div key={clinicOption} className="flex items-center space-x-2 py-1.5 px-2 rounded border border-gray-200 hover:bg-gray-50">
                                <RadioGroupItem value={clinicOption} id={`clinic-${clinicOption}`} />
                                <Label htmlFor={`clinic-${clinicOption}`} className="flex-1 cursor-pointer text-sm">
                                  {clinicOption}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      )}
                      {questions[currentStep].field === "role" && option === "Other" && quizData.role === "Other" && (
                        <div className="ml-8 mt-2 mb-2">
                          <Label htmlFor="roleOther" className="text-sm font-medium">Please specify your role</Label>
                          <Input
                            id="roleOther"
                            value={quizData.roleOther}
                            onChange={(e) => updateQuizData("roleOther", e.target.value)}
                            placeholder="Enter your role or job title"
                            className="mt-2"
                          />
                        </div>
                      )}
                      {questions[currentStep].field === "software" && option === "Other" && quizData.software === "Other" && (
                        <div className="ml-8 mt-2 mb-2">
                          <Label htmlFor="softwareOther" className="text-sm font-medium">Please specify your practice software</Label>
                          <Input
                            id="softwareOther"
                            value={quizData.softwareOther}
                            onChange={(e) => updateQuizData("softwareOther", e.target.value)}
                            placeholder="Enter your practice software name"
                            className="mt-2"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  </RadioGroup>
                )}




                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={
                      (questions[currentStep].field === "priorities"
                        ? quizData.priorities.length === 0
                        : !quizData[questions[currentStep].field]) ||
                      (questions[currentStep].field === "software" && quizData.software === "Other" && !quizData.softwareOther) ||
                      (questions[currentStep].field === "role" && quizData.role === "Other" && !quizData.roleOther) ||
                      (questions[currentStep].field === "role" && quizData.role === "Practice Owner" && !quizData.clinicCountBand) ||
                      (questions[currentStep].field === "role" && quizData.role === "Practice Manager" && !quizData.clinicCountBand) ||
                      (questions[currentStep].field === "role" && quizData.role === "Executive / Director (CEO or CMO)" && !quizData.clinicCountBand) ||
                      (questions[currentStep].field === "callVolume" &&
                        (Number(quizData.callVolume) < 1 || !quizData.callVolume)) ||
                      (questions[currentStep].field === "unansweredCalls" &&
                        (Number(quizData.unansweredCalls) < 1 || !quizData.unansweredCalls || Number(quizData.unansweredCalls) > Number(quizData.callVolume))) ||
                      (questions[currentStep].field === "afterHoursCalls" &&
                        (Number(quizData.afterHoursCalls) < 1 || !quizData.afterHoursCalls)) ||
                      (questions[currentStep].field === "noShowRate" &&
                        (Number(quizData.noShowRate) < 5 || Number(quizData.noShowRate) > 8)) ||
                      (questions[currentStep].field === "avgRevenuePerAppointment" &&
                        (Number(quizData.avgRevenuePerAppointment) < 68.49 || !quizData.avgRevenuePerAppointment)) ||
                      (questions[currentStep].field === "monthlyWage" &&
                        (Number(quizData.monthlyWage) < 1 || !quizData.monthlyWage))
                    }
                    className="flex items-center gap-2 bg-persian-green hover:bg-persian-green/90 text-white font-semibold w-full md:w-auto"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      Final Step
                    </span>
                    <span className="text-sm text-muted-foreground">
                      100% Complete
                    </span>
                  </div>
                  <div className="w-full bg-soft-gray rounded-full h-2">
                    <div 
                      className="bg-persian-green h-2 rounded-full transition-all duration-300"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold text-oxford-blue mb-6">
                  Get Your Personalised Results
                </h2>
                <p className="text-muted-foreground mb-6">
                  Please provide your details to see your practice's potential savings
                </p>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={quizData.firstName}
                      onChange={(e) => updateQuizData("firstName", e.target.value)}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={quizData.lastName}
                      onChange={(e) => updateQuizData("lastName", e.target.value)}
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={quizData.email}
                      onChange={(e) => updateQuizData("email", e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={quizData.phone}
                      onChange={(e) => updateQuizData("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={quizData.state}
                      onValueChange={(value) => updateQuizData("state", value)}
                    >
                      <SelectTrigger id="state" className="mt-2 bg-white">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Australian Capital Territory (ACT)">Australian Capital Territory (ACT)</SelectItem>
                        <SelectItem value="New South Wales (NSW)">New South Wales (NSW)</SelectItem>
                        <SelectItem value="Northern Territory (NT)">Northern Territory (NT)</SelectItem>
                        <SelectItem value="Queensland (QLD)">Queensland (QLD)</SelectItem>
                        <SelectItem value="South Australia (SA)">South Australia (SA)</SelectItem>
                        <SelectItem value="Tasmania (TAS)">Tasmania (TAS)</SelectItem>
                        <SelectItem value="Victoria (VIC)">Victoria (VIC)</SelectItem>
                        <SelectItem value="Western Australia (WA)">Western Australia (WA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="callTime">Preferred call time/day</Label>
                    <Select
                      value={quizData.preferredCallTime}
                      onValueChange={(value) => updateQuizData("preferredCallTime", value)}
                    >
                      <SelectTrigger id="callTime" className="mt-2 bg-white">
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Weekday mornings (9am-12pm)">Weekday mornings (9am-12pm)</SelectItem>
                        <SelectItem value="Weekday afternoons (12pm-5pm)">Weekday afternoons (12pm-5pm)</SelectItem>
                        <SelectItem value="Weekday evenings (5pm-7pm)">Weekday evenings (5pm-7pm)</SelectItem>
                        <SelectItem value="Weekend mornings">Weekend mornings</SelectItem>
                        <SelectItem value="Weekend afternoons">Weekend afternoons</SelectItem>
                        <SelectItem value="Anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="mt-6 border-t border-oxford-blue/10 pt-6">
                    <h3 className="text-lg font-semibold text-oxford-blue mb-4">Terms and Conditions </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="consentMarketing"
                          checked={quizData.consentMarketing}
                          onCheckedChange={(checked) => updateQuizData("consentMarketing", !!checked)}
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor="consentMarketing" 
                            className="text-sm leading-relaxed cursor-pointer"
                          >
                            By submitting this form you are consenting to receive marketing communications from Healthengine whose data use is subject to their{" "}
                            <a 
                              href="https://healthengine.com.au/privacy" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-persian-green hover:underline font-medium"
                            >
                              Privacy Policy
                            </a>, acknowledging that you have read and agree to our{" "}
                            <a 
                              href="https://healthengine.com.au/terms" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-persian-green hover:underline font-medium"
                            >
                              Terms of Use
                            </a>{" "}
                            and that you can opt-out at any time.
                          </Label>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="consentData"
                          checked={!!quizData.consentData}
                          onCheckedChange={(checked) => updateQuizData("consentData", !!checked)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="consentData"
                            className="text-sm leading-relaxed cursor-pointer"
                          >
                            By clicking Submit, you agree to send your info to Healthengine whose data use is subject to their privacy policy. Facebook will also use it subject to our Data Policy, including to auto-fill forms for ads.{" "}
                            <a
                              href="https://www.facebook.com/privacy/policy/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-persian-green hover:underline font-medium"
                            >
                              View Meta's Privacy Policy
                            </a>.{" "}
                          </Label>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="consentContact"
                          checked={!!quizData.consentContact}
                          onCheckedChange={(checked) => updateQuizData("consentContact", !!checked)}
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="consentContact"
                            className="text-sm leading-relaxed cursor-pointer"
                          >
                            I agree to be contacted about my ROI results and demo.
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!quizData.firstName || !quizData.lastName || !quizData.email || !quizData.phone || !quizData.state || !quizData.consentMarketing || !quizData.consentData || !quizData.consentContact || isSubmitting}
                    className="flex items-center gap-2 bg-persian-green hover:bg-persian-green/90 text-white font-semibold w-full md:w-auto mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        Get My Results
                        <Calculator className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ROIQuiz;