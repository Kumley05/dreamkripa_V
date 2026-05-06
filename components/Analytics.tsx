'use client';

import { useEffect } from 'react';

export default function Analytics() {
  useEffect(() => {
    // Initialize Google Analytics
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_GA_ID) {
      // Load Google Analytics script
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
      `;
      document.head.appendChild(script2);
    }
  }, []);

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, []);

  return null;
}

// Custom hook for tracking events
export const useAnalytics = () => {
  const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }
  };

  const trackLeadSubmission = (leadData: { program?: string; category?: string }) => {
    trackEvent('generate_lead', {
      event_category: 'lead_generation',
      event_label: leadData.program || 'application_form',
      program_category: leadData.category,
    });
  };

  const trackPageView = (page: string, title?: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: page,
      });
    }
  };

  const trackButtonClick = (buttonName: string, buttonLocation: string) => {
    trackEvent('click', {
      event_category: 'engagement',
      event_label: buttonName,
      button_location: buttonLocation,
    });
  };

  return {
    trackEvent,
    trackLeadSubmission,
    trackPageView,
    trackButtonClick,
  };
};
