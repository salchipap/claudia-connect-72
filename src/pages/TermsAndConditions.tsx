
import React from 'react';
import NavBar from '@/components/NavBar';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-[#142126] text-claudia-foreground relative">
      <NavBar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto bg-[#1a2a30] rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-claudia-white">Terms and Conditions</h1>
          
          <div className="prose prose-invert max-w-none text-claudia-white/90">
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">1. Introduction</h2>
            <p>
              Welcome to ClaudIA. These Terms and Conditions govern your use of our website and services. 
              By accessing or using ClaudIA, you agree to be bound by these Terms. If you disagree with any 
              part of the terms, you may not access the service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">2. Use of Service</h2>
            <p>
              ClaudIA provides an AI-powered assistant that helps users with various tasks. Our service is 
              designed to be used for lawful purposes only. You agree not to use our service for any illegal 
              or unauthorized purpose.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">3. User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and 
              current at all times. Failure to do so constitutes a breach of the Terms, which may result in 
              immediate termination of your account on our service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">4. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are and will remain the exclusive 
              property of ClaudIA and its licensors. The service is protected by copyright, trademark, and other 
              laws of both the Colombia and foreign countries.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">5. Data Usage</h2>
            <p>
              We collect and process personal data as described in our Privacy Policy. By using ClaudIA, you 
              consent to such processing and you warrant that all data provided by you is accurate.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">6. Reminders and Notifications</h2>
            <p>
              ClaudIA may send reminders and notifications to you via WhatsApp or other platforms based on your 
              settings and requests. You are responsible for ensuring that the contact information you provide is 
              accurate and up-to-date. We are not responsible for any failures in delivery due to incorrect contact 
              information or technical issues beyond our control.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">7. Service Availability</h2>
            <p>
              We will strive to make our service available at all times. However, we do not guarantee that our 
              service will be available without interruption. We reserve the right to suspend or terminate the 
              service at any time for maintenance or other reasons.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">8. Payments and Subscriptions</h2>
            <p>
              Some features of ClaudIA may require payment or subscription. By purchasing a subscription or tokens, 
              you agree to pay the specified fees. We reserve the right to change our fees at any time. Continued 
              use of the service after a fee change constitutes your acceptance of the new fees.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">9. Limitation of Liability</h2>
            <p>
              In no event shall ClaudIA, nor its directors, employees, partners, agents, suppliers, or affiliates, 
              be liable for any indirect, incidental, special, consequential or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access 
              to or use of or inability to access or use the service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">10. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your 
              responsibility to review these Terms periodically for changes. Your continued use of the service following 
              the posting of any changes to these Terms constitutes acceptance of those changes.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us via WhatsApp at +573128310805.
            </p>
            
            <p className="mt-8 text-claudia-white/60 text-sm">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsAndConditions;
