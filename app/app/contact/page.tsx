'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, ChevronLeft, CheckCircle2, User, GraduationCap, MapPin, Phone, Mail, MapPin as LocationIcon } from 'lucide-react';
import { Program, ProgramCategory } from '@/types';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  programCategoryId: number | undefined;
  programId: number | undefined;
  educationLevel: string;
  city: string;
  state: string;
  preferredIntake: string;
  message: string;
  consentEmail: boolean;
  consentPhone: boolean;
}

interface FormErrors {
  [key: string]: string;
}

function ContactPageContent() {
  const searchParams = useSearchParams();
  const programParam = searchParams.get('program');

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    programCategoryId: undefined,
    programId: undefined,
    educationLevel: '',
    city: '',
    state: '',
    preferredIntake: '',
    message: '',
    consentEmail: true,
    consentPhone: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [categories, setCategories] = useState<ProgramCategory[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);

  const educationLevels = ['10th', '12th', 'Graduate', 'Post Graduate'];
  const intakes = ['2025', '2026', '2027'];
  const indianStates = [
    'Andhra Pradesh', 'Delhi', 'Gujarat', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Tamil Nadu', 'Telangana',
    'Uttar Pradesh', 'West Bengal', 'Other'
  ];

  useEffect(() => {
    fetchCategories();
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (formData.programCategoryId) {
      const filtered = programs.filter(p => Number(p.category_id) === Number(formData.programCategoryId));
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms([]);
    }
  }, [formData.programCategoryId, programs]);

  useEffect(() => {
    if (programParam) {
      const program = programs.find(p => p.slug === programParam);
      if (program) {
        setFormData(prev => ({
          ...prev,
          programId: Number(program.id),
          programCategoryId: Number(program.category_id),
        }));
      }
    }
  }, [programParam, programs]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories?active=true');
      const data = await response.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      const data = await response.json();
      if (data.success) setPrograms(data.data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (step === 2) {
      if (!formData.programCategoryId) {
        newErrors.programCategoryId = 'Please select a field';
      }
      if (!formData.programId) {
        newErrors.programId = 'Please select a program';
      }
      if (!formData.educationLevel) {
        newErrors.educationLevel = 'Please select your education level';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = (() => {
      if (type === 'checkbox') return (e.target as HTMLInputElement).checked;
      if (name === 'programCategoryId' || name === 'programId') return value ? parseInt(value, 10) : undefined;
      return value;
    })();
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue,
    }));
    if (name === 'programCategoryId') {
      setFormData(prev => ({ ...prev, programId: undefined }));
    }
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitSuccess(true);
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'generate_lead', {
            event_category: 'lead_generation',
            event_label: 'contact_form',
          });
        }
      } else {
        setErrors({ submit: data.error || 'Failed to submit application. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h1>
              <p className="text-lg text-gray-600 mb-8">
                Thank you for your interest! Our expert counselor will contact you within 24 hours
                to guide you through the admission process.
              </p>
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
                <ul className="text-left text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Our counselor will call you to understand your goals</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>You'll receive personalized program recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Get guidance on application and admission process</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/"
                className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Header */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Ready to start? Fill in your details and our counselors will help you find the perfect program.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Application Form */}
              <div className="lg:col-span-2">
                {/* Progress Steps */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                            currentStep >= step
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {currentStep > step ? <CheckCircle2 className="h-5 w-5" /> : step}
                          </div>
                          <span className={`text-xs mt-2 hidden sm:block ${
                            currentStep >= step ? 'text-blue-600 font-medium' : 'text-gray-500'
                          }`}>
                            {step === 1 && 'Personal'}
                            {step === 2 && 'Program'}
                            {step === 3 && 'Details'}
                          </span>
                        </div>
                        {step < 3 && (
                          <div className={`flex-1 h-1 mx-2 ${
                            currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Application</h2>
                  <p className="text-gray-600 mb-6">
                    Fill in your details and our counselors will help you find the perfect program.
                  </p>

                  <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Information */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <div className="flex items-center mb-4">
                          <User className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter your first name"
                            />
                            {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                              }`}
                              placeholder="Enter your last name"
                            />
                            {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="your.email@example.com"
                          />
                          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter 10-digit mobile number"
                          />
                          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Program Selection */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="flex items-center mb-4">
                          <GraduationCap className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Program Selection</h3>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Education Level <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="educationLevel"
                            value={formData.educationLevel}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                              errors.educationLevel ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select your education level</option>
                            {educationLevels.map((level) => (
                              <option key={level} value={level}>{level}</option>
                            ))}
                          </select>
                          {errors.educationLevel && <p className="text-red-600 text-sm mt-1">{errors.educationLevel}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Your Field <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="programCategoryId"
                            value={formData.programCategoryId || ''}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                              errors.programCategoryId ? 'border-red-500' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Select a field</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                          {errors.programCategoryId && <p className="text-red-600 text-sm mt-1">{errors.programCategoryId}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Program <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="programId"
                            value={formData.programId || ''}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                              errors.programId ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={!formData.programCategoryId}
                          >
                            <option value="">
                              {formData.programCategoryId ? 'Select a program' : 'Select a field first'}
                            </option>
                            {filteredPrograms.map((prog) => (
                              <option key={prog.id} value={prog.id}>{prog.title}</option>
                            ))}
                          </select>
                          {errors.programId && <p className="text-red-600 text-sm mt-1">{errors.programId}</p>}
                        </div>
                      </div>
                    )}

                    {/* Step 3: Additional Details */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <div className="flex items-center mb-4">
                          <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                          <h3 className="text-lg font-semibold text-gray-900">Location & Preferences</h3>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Your city"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <select
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">Select state</option>
                              {indianStates.map((state) => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Intake Year</label>
                          <select
                            name="preferredIntake"
                            value={formData.preferredIntake}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Select intake year</option>
                            {intakes.map((year) => (
                              <option key={year} value={year}>{year}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows={4}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tell us about your goals or any specific requirements..."
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              name="consentEmail"
                              checked={formData.consentEmail}
                              onChange={handleChange}
                              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">
                              I agree to receive communication via email regarding programs and admission guidance.
                            </span>
                          </label>
                          <label className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              name="consentPhone"
                              checked={formData.consentPhone}
                              onChange={handleChange}
                              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600">
                              I agree to receive phone calls/SMS from counselors for admission guidance.
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {errors.submit && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{errors.submit}</p>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 flex justify-between">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={handlePrevious}
                          className="flex items-center px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </button>
                      ) : (
                        <div></div>
                      )}
                      {currentStep < 3 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex items-center px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Application'}
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                  By submitting this form, you agree to our{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                  {' '}and{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                </p>
              </div>

              {/* Contact Information Sidebar */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                  <p className="text-gray-600 mb-8">
                    Have questions about programs, admissions, or need guidance? Our team is here to help.
                    Reach out through any of the following channels.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">+91 98765 43210</p>
                      <p className="text-sm text-gray-500">Mon-Sat, 9AM-6PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">admissions@dreamkripa.com</p>
                      <p className="text-sm text-gray-500">We reply within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <LocationIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                      <p className="text-gray-600">India</p>
                      <p className="text-sm text-gray-500">Visit us by appointment</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Quick Response Guaranteed</h3>
                  <p className="text-sm text-gray-700">
                    Most inquiries are responded to within the same business day. For urgent matters,
                    please call us directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactPageContent />
    </Suspense>
  );
}