import React from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Check } from 'lucide-react';

interface PricingTableModalProps {
  children: React.ReactNode;
  highlightPlan?: 'flexible' | '12-month' | '24-month';
  highlightBilling?: 'per-use' | 'fixed';
}

const PricingTableModal: React.FC<PricingTableModalProps> = ({
  children,
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[70vh] overflow-y-auto bg-white text-gray-900 p-0 sm:rounded-2xl shadow-2xl z-[999999] border-0">
        {/* Accessibility - Hidden title and description */}
        <DialogTitle className="sr-only">24/7 AI Healthcare Receptionist Pricing Details</DialogTitle>
        <DialogDescription className="sr-only">
          View detailed pricing information for 24/7 AI Healthcare Receptionist service including flexible plans, 12-month contracts, and 24-month contracts.
        </DialogDescription>

        {/* Gradient Header */}
        <div className="bg-gradient-to-br from-[#0d3f77] via-[#168a9c] to-[#40aeaf] p-6 sm:p-8 text-white">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-3">
            24/7 AI Healthcare Receptionist
          </h1>
          <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-3xl">
            Reduce missed calls, eliminate admin pressure, and deliver 24/7 patient care — all for less than the cost of one full-time receptionist.
          </p>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-6">
          {/* Pricing Guide Table Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0d3f77]">Pricing Guide</h2>

          {/* Main Pricing Table - Desktop */}
          <div className="hidden lg:block mt-8">
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left p-4 font-bold text-gray-700 bg-gray-50 whitespace-nowrap text-base">Fee Type / Plan</th>
                    <th className="text-center p-4 font-bold bg-gradient-to-br from-[#168a9c] to-[#40aeaf] text-white">
                      <div className="text-base">Flexible Plan</div>
                      <div className="text-xs font-normal opacity-90 mt-1">(AUD)</div>
                    </th>
                    <th className="text-center p-4 font-bold bg-gradient-to-br from-[#0d3f77] to-[#168a9c] text-white">
                      <div className="text-base">12-Month Contract</div>
                      <div className="text-xs font-normal opacity-90 mt-1">(AUD)</div>
                    </th>
                    <th className="text-center p-4 pt-11 font-bold bg-gradient-to-br from-[#0d3f77] to-[#40aeaf] text-white relative">
                      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-[10px] bg-yellow-400 text-gray-900 px-2 py-1 rounded-full font-bold shadow-md z-10">BEST VALUE</div>
                      <div className="text-base">24-Month Contract</div>
                      <div className="text-xs font-normal opacity-90 mt-1">(AUD)</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white text-sm">
                  {/* Set-Up Fee */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900 bg-gray-50">
                      Set-Up Fee <span className="font-normal text-gray-600">(per clinic)</span>
                    </td>
                    <td className="text-center p-4 text-gray-700">
                      <span className="font-bold text-gray-900">$599</span> one-time
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-green-600 text-base">Free</span>
                    </td>
                    <td className="text-center p-4 bg-yellow-50">
                      <span className="font-bold text-green-600 text-base">Free</span>
                    </td>
                  </tr>

                  {/* Subscription Fee */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900 bg-gray-50">
                      Subscription Fee <span className="font-normal text-gray-600">(per clinic)</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$499</span> <span className="text-gray-600">/ month</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$499</span> <span className="text-gray-600">/ month</span>
                    </td>
                    <td className="text-center p-4 bg-yellow-50">
                      <span className="font-bold text-gray-900 text-base">$499</span> <span className="text-gray-600">/ month</span>
                    </td>
                  </tr>

                  {/* AI Agent Fees */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900 bg-gray-50">
                      AI Agent Fees <span className="font-normal text-gray-600">(Pay-per-service)</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$0.40</span> <span className="text-gray-600">/ use</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$0.40</span> <span className="text-gray-600">/ use</span>
                    </td>
                    <td className="text-center p-4 bg-yellow-50">
                      <span className="font-bold text-[#168a9c] text-base">$0.30</span> <span className="text-gray-600">/ use</span>
                    </td>
                  </tr>

                  {/* Or Divider */}
                  <tr className="border-b-2 border-gray-300 bg-gray-100">
                    <td className="p-4 font-bold text-gray-900 bg-gray-100">
                      Unlimited Monthly Usage <span className="font-normal text-gray-600">(per clinic)</span>
                    </td>
                    <td className="text-center p-4 font-semibold text-[#168a9c] text-base">Or</td>
                    <td className="text-center p-4 font-semibold text-[#168a9c] text-base">Or</td>
                    <td className="text-center p-4 font-semibold text-[#168a9c] text-base bg-yellow-50">Or</td>
                  </tr>

                  {/* 1-5 HCPs */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-8 text-gray-700">
                      <span className="text-[#168a9c] font-bold mr-2">•</span> 1-5 HCPs
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$1,999</span> <span className="text-gray-600">/ month</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$1,999</span> <span className="text-gray-600">/ month</span>
                    </td>
                    <td className="text-center p-4 bg-yellow-50">
                      <span className="font-bold text-[#168a9c] text-base">$1,499</span> <span className="text-gray-600">/ month</span>
                    </td>
                  </tr>

                  {/* 6-10 HCPs */}
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-8 text-gray-700">
                      <span className="text-[#168a9c] font-bold mr-2">•</span> 6-10 HCPs
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$3,999</span> <span className="text-gray-600">/ month</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$3,999</span> <span className="text-gray-600">/ month</span>
                    </td>
                    <td className="text-center p-4 bg-yellow-50">
                      <span className="font-bold text-[#168a9c] text-base">$3,499</span> <span className="text-gray-600">/ month</span>
                    </td>
                  </tr>

                  {/* 10+ HCPs */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-8 text-gray-700">
                      <span className="text-[#168a9c] font-bold mr-2">•</span> 10+ HCPs
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$5,999</span> <span className="text-gray-600">/ month</span>
                    </td>
                    <td className="text-center p-4">
                      <span className="font-bold text-gray-900 text-base">$5,999</span> <span className="text-gray-600">/ month</span>
                    </td>
                    <td className="text-center p-4 bg-yellow-50">
                      <span className="font-bold text-[#168a9c] text-base">$4,499</span> <span className="text-gray-600">/ month</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {/* Flexible Plan Card */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
              <div className="bg-gradient-to-br from-[#168a9c] to-[#40aeaf] p-4 text-center font-bold text-white">
                Flexible Plan <span className="text-sm font-normal">(AUD)</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Set-Up Fee</span>
                  <span className="font-bold text-gray-900">$599 <span className="text-sm font-normal text-gray-600">one-time</span></span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Subscription</span>
                  <span className="font-bold text-gray-900">$499 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">AI Agent Fees</span>
                  <span className="font-bold text-gray-900">$0.40 <span className="text-sm font-normal text-gray-600">/ use</span></span>
                </div>
                <div className="pt-2 pb-2 text-center text-[#168a9c] font-bold border-b-2 border-gray-300">Or Unlimited Usage:</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">1-5 HCPs</span>
                  <span className="font-bold text-gray-900">$1,999 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">6-10 HCPs</span>
                  <span className="font-bold text-gray-900">$3,999 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">10+ HCPs</span>
                  <span className="font-bold text-gray-900">$5,999 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
              </div>
            </div>

            {/* 12-Month Contract Card */}
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
              <div className="bg-gradient-to-br from-[#0d3f77] to-[#168a9c] p-4 text-center font-bold text-white">
                12-Month Contract <span className="text-sm font-normal">(AUD)</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Set-Up Fee</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">Subscription</span>
                  <span className="font-bold text-gray-900">$499 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                  <span className="text-gray-600">AI Agent Fees</span>
                  <span className="font-bold text-gray-900">$0.40 <span className="text-sm font-normal text-gray-600">/ use</span></span>
                </div>
                <div className="pt-2 pb-2 text-center text-[#168a9c] font-bold border-b-2 border-gray-300">Or Unlimited Usage:</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">1-5 HCPs</span>
                  <span className="font-bold text-gray-900">$1,999 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">6-10 HCPs</span>
                  <span className="font-bold text-gray-900">$3,999 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">10+ HCPs</span>
                  <span className="font-bold text-gray-900">$5,999 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
              </div>
            </div>

            {/* 24-Month Contract Card */}
            <div className="border-2 border-yellow-400 rounded-xl overflow-hidden shadow-2xl ring-2 ring-yellow-400/40 bg-white">
              <div className="bg-gradient-to-br from-[#0d3f77] to-[#40aeaf] p-4 text-center font-bold text-white relative">
                <span className="absolute -top-2 right-2 text-xs bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-bold shadow-md">BEST VALUE</span>
                24-Month Contract <span className="text-sm font-normal">(AUD)</span>
              </div>
              <div className="p-4 space-y-3 bg-yellow-50">
                <div className="flex justify-between items-center border-b border-yellow-200 pb-3">
                  <span className="text-gray-700 font-medium">Set-Up Fee</span>
                  <span className="font-bold text-green-600 text-base">Free</span>
                </div>
                <div className="flex justify-between items-center border-b border-yellow-200 pb-3">
                  <span className="text-gray-700 font-medium">Subscription</span>
                  <span className="font-bold text-gray-900">$499 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
                <div className="flex justify-between items-center border-b border-yellow-200 pb-3">
                  <span className="text-gray-700 font-medium">AI Agent Fees</span>
                  <span className="font-bold text-[#168a9c] text-base">$0.30 <span className="text-sm font-normal text-gray-600">/ use</span></span>
                </div>
                <div className="pt-2 pb-2 text-center text-[#168a9c] font-bold border-b-2 border-yellow-300">Or Unlimited Usage:</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">1-5 HCPs</span>
                  <span className="font-bold text-[#168a9c] text-base">$1,499 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">6-10 HCPs</span>
                  <span className="font-bold text-[#168a9c] text-base">$3,499 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">10+ HCPs</span>
                  <span className="font-bold text-[#168a9c] text-base">$4,499 <span className="text-sm font-normal text-gray-600">/ month</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Included with All Plans */}
          <div className="mt-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#0d3f77]">Included with All Plans</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Free Appointment Reminders</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Free Welcome Message</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Free Appointment Confirmations</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Free Message on Hold</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Free FAQs</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">Free After-Hours Message (when no human receptionist is available)</span>
              </div>
            </div>
          </div>

          {/* Footer Tagline */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <p className="text-sm text-gray-600 text-center leading-relaxed font-medium">
              Transparent pricing. No lock-in surprises. Just smarter reception — 24/7.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PricingTableModal;
