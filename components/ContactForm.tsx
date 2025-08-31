// /Users/macbookair/Documents/IllusionTech-Development/components/ContactForm.tsx
'use client';

import mailcheck from 'mailcheck';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useState, FormEvent, ChangeEvent, useEffect, MouseEvent, useMemo } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/Alert';
import {
  Terminal,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
} from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useAssistantStore } from '@/lib/assistant-store';
import { IPageContentData } from '@/lib/models/PageContent';
import { ServiceForForm } from '@/app/contact/page';

const formVariants: Variants = {
  offscreen: {
    opacity: 0,
    y: 50,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', bounce: 0.4, duration: 0.8 },
  },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

// Reusable Select component for a consistent look
const Select = ({
  id,
  name,
  value,
  onChange,
  disabled,
  children,
  className,
  label,
  labelClasses,
  onMouseEnter,
  onMouseLeave,
}: {
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled: boolean;
  children: React.ReactNode;
  className: string;
  label: string;
  labelClasses: string;
  onMouseEnter?: (e: MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: MouseEvent<HTMLDivElement>) => void;
}) => (
  <div className="space-y-2" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
    <Label htmlFor={id} className={labelClasses}>
      {label}
    </Label>
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`${className} appearance-none w-full pr-8`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-300">
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  </div>
);

// Helper component to reduce repetition for assistant interactions
const InteractiveField = ({
  children,
  message,
  className,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) => {
  const setInteraction = useAssistantStore((state) => state.setInteraction);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setInteraction(message, e.currentTarget);
  };

  const handleMouseLeave = () => {
    setInteraction(null, null);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={className}>
      {children}
    </div>
  );
};
// The actual form component that handles state and submission
function Form({ content, services }: { content: IPageContentData, services: ServiceForForm[] }) {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const setInteraction = useAssistantStore((state) => state.setInteraction);
  const [currentStep, setCurrentStep] = useState(1);

  // --- Dynamic Data Generation ---
  const {
    webDevServices,
    supportServices,
    newProjectPackages,
    maintenancePlans,
    projectBudgetRanges,
    maintenanceBudgetRanges,
    projectTimelines,
    maintenanceContractLengths,
    packageToBudgetMap,
    budgetToPackageMap,
    maintenanceToBudgetMap,
    budgetToMaintenanceMap,
  } = useMemo(() => {
    const webDevServices = services.filter((s) => s.type === 'web-development');
    const supportServices = services.filter((s) => s.type === 'support');

    const newProjectPackages = [
      ...webDevServices.map((s) => ({ value: s.slug || s._id, label: s.name })),
      { value: 'unsure', label: "I'm not sure yet" },
    ];

    const maintenancePlans = [
      ...supportServices.map((s) => ({ value: s.slug || s._id, label: s.name })),
      { value: 'unsure', label: "I'm not sure yet" },
    ];

    const priceToValue = (price: string) => price.replace(/[^0-9-]/g, '');

    const projectBudgetRanges = [
      ...webDevServices.map((s) => ({ value: priceToValue(s.price || ''), label: s.price || '' })).filter(b => b.label),
      { value: 'flexible', label: 'Flexible' },
    ];

    const maintenanceBudgetRanges = [
      ...supportServices.map((s) => ({ value: priceToValue(s.price || ''), label: s.price || '' })).filter(b => b.label),
      { value: 'flexible', label: 'Flexible' },
    ];

    const projectTimelines = content.projectTimelines?.length ? content.projectTimelines : [
      { value: '1w', label: '1 Week' }, { value: '2-3w', label: '2-3 Weeks' }, { value: '1m', label: '1 Month' },
      { value: '2m', label: '2 Months' }, { value: '3m', label: '3 Months' }, { value: 'flexible', label: 'Flexible' }
    ];

    const maintenanceContractLengths = content.maintenanceContractLengths?.length ? content.maintenanceContractLengths : [
      { value: 'monthly', label: 'Monthly' }, { value: 'quarterly', label: 'Quarterly (3 months)' },
      { value: 'annually', label: 'Annually (1 year)' }, { value: 'flexible', label: 'Flexible' }
    ];

    const packageToBudgetMap = new Map(webDevServices.map(s => [s.slug || s._id, priceToValue(s.price || '')]));
    const budgetToPackageMap = new Map(Array.from(packageToBudgetMap.entries()).map(([k, v]) => [v, k]));
    const maintenanceToBudgetMap = new Map(supportServices.map(s => [s.slug || s._id, priceToValue(s.price || '')]));
    const budgetToMaintenanceMap = new Map(Array.from(maintenanceToBudgetMap.entries()).map(([k, v]) => [v, k]));

    return {
      webDevServices, supportServices, newProjectPackages, maintenancePlans,
      projectBudgetRanges, maintenanceBudgetRanges, projectTimelines, maintenanceContractLengths,
      packageToBudgetMap, budgetToPackageMap, maintenanceToBudgetMap, budgetToMaintenanceMap
    };
  }, [services, content]);

  const [formData, setFormData] = useState({
    serviceType: '',
    newProjectPackage: '',
    maintenancePlan: '',
    websiteURL: '',
    budget: '',
    timeline: '',
    email: '',
    message: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [status, setStatus] = useState<{
    type: 'idle' | 'submitting' | 'success' | 'error';
    message: string;
  }>({ type: 'idle', message: '' });
  const [emailSuggestion, setEmailSuggestion] = useState<{
    full: string;
    address: string;
  } | null>(null);

  // This effect hook ensures that whenever the user navigates to a new step,
  // any previous validation errors are cleared. This prevents old error
  // messages from a failed submission attempt on one step from reappearing
  // when the user navigates away and then back to that step.
  useEffect(() => {
    setStatus({ type: 'idle', message: '' });
  }, [currentStep]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // Clear any existing validation error as soon as the user starts typing
    if (status.type === 'error') {
      setStatus({ type: 'idle', message: '' });
    }

    const { name, value } = e.target;

    if (name === 'newProjectPackage') {
      // User changed the package, so we update the budget
      const newBudget = packageToBudgetMap.get(value) || (value === 'unsure' ? '' : formData.budget);
      setFormData(prev => ({ ...prev, newProjectPackage: value, budget: newBudget }));
    } else if (name === 'maintenancePlan') {
      // User changed the maintenance plan, so we update the budget
      const newBudget = maintenanceToBudgetMap.get(value) || (value === 'unsure' ? '' : formData.budget);
      setFormData(prev => ({ ...prev, maintenancePlan: value, budget: newBudget }));
    } else if (name === 'budget') {
      // User changed the budget, so we update the appropriate package/plan
      if (formData.serviceType === 'new-project') {
        const newPackage = budgetToPackageMap.get(value) || 'unsure';
        setFormData(prev => ({ ...prev, budget: value, newProjectPackage: newPackage }));
      } else if (formData.serviceType === 'maintenance') {
        const newPlan = budgetToMaintenanceMap.get(value) || 'unsure';
        setFormData(prev => ({ ...prev, budget: value, maintenancePlan: newPlan }));
      } else {
        setFormData(prev => ({ ...prev, budget: value }));
      }
    } else {
      // Handle all other form fields normally
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    // Clear any existing validation error as soon as the user starts typing
    if (status.type === 'error') {
      setStatus({ type: 'idle', message: '' });
    }

    // The PhoneInput component returns the value directly.
    setFormData((prev) => ({ ...prev, phoneNumber: value || '' }));
  };

  const handleEmailBlur = () => {
    // Clear previous suggestion
    setEmailSuggestion(null);
    mailcheck.run({ email: formData.email, suggested: setEmailSuggestion });
  };
  const totalSteps = 3;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    const errorMessage = validateStep(3);
    if (errorMessage) {
      setStatus({ type: 'error', message: errorMessage });
      return;
    }
    
    if (!executeRecaptcha) {
      console.error('reCAPTCHA not available');
      setStatus({ type: 'error', message: 'reCAPTCHA not available. Please try again later.' });
      return;
    }

    setStatus({ type: 'submitting', message: 'Sending...' });

    const token = await executeRecaptcha('contact_form');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, token }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'An unknown error occurred.');
      }

      setStatus({ type: 'success', message: result.message });
      // Reset form and go back to step 1 after a delay
      setFormData({ serviceType: '', newProjectPackage: '', maintenancePlan: '', websiteURL: '', budget: '', timeline: '', firstName: '', lastName: '', email: '', message: '', phoneNumber: '' });
      setTimeout(() => {
        // Only reset to step 1 if we are still on the last step.
        // This prevents resetting if the user navigates back during the success message display.
        if (currentStep === totalSteps) {
            setCurrentStep(1);
        }
        setStatus({ type: 'idle', message: '' });
      }, 4000);
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message || 'Failed to send message. Please try again.' });
    }
  };

  // Reusable classes for consistent styling
  const inputClasses = "transition duration-300 ease-in-out focus:shadow-lg bg-slate-900 text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 border-slate-700 focus:border-accent";
  const labelClasses = "text-slate-300";

  const validateStep = (step: number): string | null => {
    switch (step) {
      case 1:
        if (!formData.serviceType) return 'Please select a service type to continue.';
        break;
      case 2:
        if (!formData.message.trim()) return 'Please provide a message or additional details.';
        break;
      case 3:
        if (!formData.firstName.trim()) return 'Please enter your first name.';
        if (!formData.lastName.trim()) return 'Please enter your last name.';
        if (!formData.email.trim()) return 'Please enter your email address.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return 'Please enter a valid email address.';
        if (formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber)) return 'Please enter a valid phone number.';
        break;
    }
    return null;
  };

  const handleNext = () => {
    const errorMessage = validateStep(currentStep);
    if (errorMessage) {
      setStatus({ type: 'error', message: errorMessage });
      return;
    }

    if (currentStep < totalSteps) {
      setStatus({ type: 'idle', message: '' });
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStatus({ type: 'idle', message: '' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const ServiceOption = ({
    label,
    value,
    description,
  }: { label: string; value: string; description: string }) => (
    <motion.div
      onClick={() => {
        setFormData(prev => ({ ...prev, serviceType: value }));
        if (status.type === 'error') setStatus({ type: 'idle', message: '' });
      }}
      className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
        formData.serviceType === value
          ? 'bg-accent/20 border-accent ring-2 ring-accent'
          : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
      }`}
      whileTap={{ scale: 0.97 }}
      onMouseEnter={(e) => setInteraction(description, e.currentTarget)}
      onMouseLeave={() => setInteraction(null, null)}
    ><p className="font-semibold text-white">{label}</p></motion.div>
  );

  // Helper to determine which services are for custom quotes
  const customQuoteServices = ['ui-ux-design', 'website-design', 'automation'];

  return (
    <>
      <motion.div
        className="relative w-full max-w-lg mx-auto p-6 sm:p-8 rounded-2xl bg-black dark:bg-slate-800 backdrop-blur-xl border border-white/10 dark:border-slate-700 shadow-2xl shadow-black/20 dark:shadow-black/50 overflow-hidden"
        initial="offscreen"
        whileInView="onscreen"        
        viewport={{ once: false, amount: 0.3 }}
        variants={formVariants}
      >
        <form onSubmit={handleSubmit}>
          {/* Progress Bar and Step Counter */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-center text-accent mb-2">
              Step {currentStep} of {totalSteps}
            </p>
            <div className="relative h-1 w-full bg-slate-700 rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-accent rounded-full"
                animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                transition={{ ease: 'easeInOut', duration: 0.5 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
              className="space-y-6 min-h-[320px]" // Set a min-height to prevent layout shifts
            >
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white text-center">{content.contactFormStep1Heading ?? 'What can we help you with?'}</h3>
                  <ServiceOption label="A New Website or Application" value="new-project" description="Choose this if you have a new idea you want to bring to life." />
                  <ServiceOption label="Website Support & Maintenance" value="maintenance" description="Select this for ongoing support for an existing website." />
                  <ServiceOption label="UI/UX Design" value="ui-ux-design" description="For projects focused on user experience and interface design." />
                  <ServiceOption label="Website Design" value="website-design" description="Need a visually stunning design for your website? Start here." />
                  <ServiceOption label="Automation & Integration" value="automation" description="For connecting systems or automating business processes." />
                  <ServiceOption label="General Inquiry" value="general" description="Have a different question? Let us know here." />
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white text-center mb-4">{content.contactFormStep2Heading ?? 'Tell us more'}</h3>

                  {formData.serviceType === 'maintenance' && (
                    <div className="space-y-4 animate-fade-in-up">
                      <InteractiveField message="Select the maintenance plan that best fits your needs.">
                        <Select id="maintenancePlan" name="maintenancePlan" value={formData.maintenancePlan} onChange={handleChange} disabled={status.type === 'submitting'} className={inputClasses} label="Which plan are you considering?" labelClasses={labelClasses}>
                          <option value="" disabled>Select a plan...</option>
                          {maintenancePlans.map(plan => <option key={plan.value} value={plan.value}>{plan.label}</option>)}
                        </Select>
                      </InteractiveField>
                      <InteractiveField message="Enter the URL of the website that needs maintenance." className="space-y-2">
                        <Label htmlFor="websiteURL" className={labelClasses}>Current Website URL (if any)</Label>
                        <Input id="websiteURL" name="websiteURL" type="url" placeholder="https://example.com" value={formData.websiteURL} onChange={handleChange} disabled={status.type === 'submitting'} className={inputClasses} />
                      </InteractiveField>
                    </div>
                  )}

                  {formData.serviceType === 'new-project' && (
                    <div className="space-y-4 animate-fade-in-up">
                      <InteractiveField message="Choose the package that most closely matches your project scope.">
                        <Select id="newProjectPackage" name="newProjectPackage" value={formData.newProjectPackage} onChange={handleChange} disabled={status.type === 'submitting'} className={inputClasses} label="Which package are you considering?" labelClasses={labelClasses}>
                          <option value="" disabled>Select a package...</option>
                          {newProjectPackages.map(pkg => <option key={pkg.value} value={pkg.value}>{pkg.label}</option>)}
                        </Select>
                      </InteractiveField>
                    </div>
                  )}

                  {/* Conditional Budget & Timeline/Contract Length fields */}
                  {(formData.serviceType === 'new-project' || formData.serviceType === 'maintenance') && (
                    <div className="grid sm:grid-cols-2 gap-4 animate-fade-in-up">
                      {formData.serviceType === 'new-project' ? (
                        <>
                          <InteractiveField message="Give us an idea of your budget. This helps us tailor our proposal.">
                            <Select id="budget" name="budget" value={formData.budget} onChange={handleChange} disabled={status.type === 'submitting'} className={inputClasses} label="Project Budget" labelClasses={labelClasses}>
                              <option value="" disabled>Select a range...</option>
                              {projectBudgetRanges.map(range => <option key={range.value} value={range.value}>{range.label}</option>)}
                            </Select>
                          </InteractiveField>
                          <InteractiveField message="Let us know your ideal timeframe for project completion.">
                            <Select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} disabled={status.type === 'submitting'} className={inputClasses} label="Project Timeline" labelClasses={labelClasses}>
                              <option value="" disabled>Select a timeline...</option>
                              {projectTimelines.map(time => <option key={time.value} value={time.value}>{time.label}</option>)}
                            </Select>
                          </InteractiveField>
                        </>
                      ) : (
                        <>
                          <InteractiveField message="Select your preferred monthly budget for ongoing support.">
                            <Select id="budget" name="budget" value={formData.budget} onChange={handleChange} disabled={status.type === 'submitting'} className={inputClasses} label="Monthly Budget" labelClasses={labelClasses}>
                              <option value="" disabled>Select a range...</option>
                              {maintenanceBudgetRanges.map(range => <option key={range.value} value={range.value}>{range.label}</option>)}
                            </Select>
                          </InteractiveField>
                          <InteractiveField message="Choose how long you'd like to engage our maintenance services.">
                            <Select id="timeline" name="timeline" value={formData.timeline} onChange={handleChange} disabled={status.type === 'submitting'} className={inputClasses} label="Contract Length" labelClasses={labelClasses}>
                              <option value="" disabled>Select a length...</option>
                              {maintenanceContractLengths.map(time => <option key={time.value} value={time.value}>{time.label}</option>)}
                            </Select>
                          </InteractiveField>
                        </>
                      )}
                    </div>
                  )}

                  {/* Message field is common for all service types in step 2 */}
                  <InteractiveField message="Please provide as much detail as possible about your project or question." className="space-y-2">
                    <Label htmlFor="message" className={labelClasses}>
                      {formData.serviceType === 'general' ? 'Your Message' : 'Any additional details?'}
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your project, ideas, or any questions you have..."
                      required
                      rows={formData.serviceType === 'general' ? 8 : 4}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={status.type === 'submitting'}
                      className={`${inputClasses} resize-none`}
                    />
                  </InteractiveField>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white text-center mb-4">{content.contactFormStep3Heading ?? 'Your Contact Information'}</h3>
                  <InteractiveField message="Please enter your first name." className="space-y-2">
                      <Label htmlFor="firstName" className={labelClasses}>First Name</Label>
                      <Input id="firstName" name="firstName" type="text" placeholder="John" required value={formData.firstName} onChange={handleChange} disabled={status.type === 'submitting'} className={inputClasses} />
                  </InteractiveField>
                  <InteractiveField message="Please enter your last name." className="space-y-2">
                      <Label htmlFor="lastName" className={labelClasses}>Last Name</Label>
                      <Input id="lastName" name="lastName" type="text" placeholder="Doe" required value={formData.lastName} onChange={handleChange} disabled={status.type === 'submitting'} className={inputClasses} />
                  </InteractiveField>
                  <InteractiveField message="We'll use this email to get back to you." className="space-y-2">
                    <Label htmlFor="email" className={labelClasses}>Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" required value={formData.email} onChange={handleChange} onBlur={handleEmailBlur} disabled={status.type === 'submitting'} className={inputClasses} />
                  </InteractiveField>
                  <InteractiveField message="Optional: Provide a phone number for easier contact." className="space-y-2 ContactFormPhoneInput">
                    <Label htmlFor="phoneNumber" className={labelClasses}>Phone Number (Optional)</Label>
                    <PhoneInput
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={handlePhoneChange}
                      disabled={status.type === 'submitting'}
                      // The custom CSS in globals.css will style the input.
                      // The className and numberInputProps props are removed to let the library and dedicated CSS handle layout and styling.
                    />
                  </InteractiveField>                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Status Messages */}
          {emailSuggestion && (
            <div className="my-2 text-center text-sm">
              <span className="text-slate-400">Did you mean </span>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({ ...prev, email: emailSuggestion.full }));
                  setEmailSuggestion(null);
                }}
                className="font-semibold text-accent hover:underline"
              >
                {emailSuggestion.full}
              </button>?
            </div>
          )}
          <div className="mt-6 min-h-[80px]">
            {status.type === 'success' && (
              <Alert className="bg-green-900/40 border-green-500/30 text-green-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}

            {status.type === 'error' && (
              <Alert variant="destructive" className="bg-red-900/40 border-red-500/30 text-red-300">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{status.message}</AlertDescription>
              </Alert>
            )}
          </div>
          {/* reCAPTCHA Notice */}
          <p className="text-xs text-slate-500 text-center mt-4">
            This site is protected by reCAPTCHA and the Google{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-300"
            >
              Privacy Policy
            </a>{' '}
            and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-300">Terms of Service</a> apply.
          </p>

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-end">
            <div className="flex items-center gap-x-2">
              <InteractiveField message="Go back to the previous step.">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBack}
                  className={`transition-opacity duration-300 ${
                    currentStep === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                  disabled={status.type === 'submitting'}
                >
                  <ArrowLeft className="mr-2 h-4 w-4 hidden sm:inline-block" />
                  Back
                </Button>
              </InteractiveField>
              <InteractiveField message={currentStep === totalSteps ? 'Submit your inquiry to our team.' : 'Proceed to the next step.'}>
                <Button
                  type={currentStep === totalSteps ? 'submit' : 'button'}
                  onClick={currentStep < totalSteps ? handleNext : undefined}
                  className="transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
                  disabled={status.type === 'submitting'}
                >
                  {status.type === 'submitting'
                    ? 'Sending...'
                    : currentStep === totalSteps
                    ? 'Submit'
                    : <>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4 hidden sm:inline-block" />
                      </>}
                </Button>
              </InteractiveField>
            </div>
          </div>
        </form>
      </motion.div>
    </>
  );
}

// The main component that wraps the form with the reCAPTCHA provider
export default function ContactForm({ content, services }: { content: IPageContentData, services: ServiceForForm[] }) {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
      <Form content={content} services={services} />
    </GoogleReCaptchaProvider>
  );
}
