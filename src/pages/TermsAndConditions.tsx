
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
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">5. Data Processing and Privacy</h2>
            <p>
              ClaudIA collects and processes personal data as described in our Privacy Policy. By using our 
              service, you acknowledge and consent to the processing of your personal data in accordance with 
              our Privacy Policy.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2 text-claudia-primary/90">5.1 Data Collection</h3>
            <p>
              We collect various types of personal data including but not limited to: name, email address, phone number, 
              and any data you provide when creating reminders or other content within our service.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2 text-claudia-primary/90">5.2 Data Usage</h3>
            <p>
              The data we collect is used for:
            </p>
            <ul className="list-disc pl-5 mt-2 mb-4 space-y-1">
              <li>Providing and maintaining our service</li>
              <li>Notifying you about changes to our service</li>
              <li>Providing customer support</li>
              <li>Gathering analysis to improve our service</li>
              <li>Monitoring the usage of our service</li>
              <li>Detecting, preventing, and addressing technical issues</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4 mb-2 text-claudia-primary/90">5.3 Data Sharing</h3>
            <p>
              We may share your personal data with:
            </p>
            <ul className="list-disc pl-5 mt-2 mb-4 space-y-1">
              <li>Service providers to monitor and analyze the use of our service</li>
              <li>Business partners to offer you certain products, services or promotions</li>
              <li>Affiliates to provide you with our services</li>
              <li>Other users when you share information through our service</li>
              <li>Law enforcement agencies when required by law</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-4 mb-2 text-claudia-primary/90">5.4 Data Storage Period</h3>
            <p>
              We will retain your personal data only for as long as is necessary for the purposes set out in 
              these Terms and our Privacy Policy. We will retain and use your personal data to the extent 
              necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements 
              and policies.
            </p>
            
            <h3 className="text-lg font-semibold mt-4 mb-2 text-claudia-primary/90">5.5 Data Security</h3>
            <p>
              We value your trust in providing us with your personal data, and we are committed to using 
              commercially acceptable means of protecting it. However, no method of transmission over the 
              internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute 
              security.
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
            
            <h2 className="text-xl font-semibold mt-6 mb-3 text-claudia-primary">8. Subscription Model</h2>
            <p>
              ClaudIA operates on a monthly subscription model. By subscribing to our service, you agree to pay 
              the specified monthly fee. You may cancel your subscription at any time, but no refunds will be 
              provided for the current billing period. We reserve the right to change our subscription fees at any time. 
              Continued use of the service after a price change constitutes your acceptance of the new fees.
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
