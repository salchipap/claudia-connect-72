
import React from 'react';
import NavBar from '@/components/NavBar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-[#142126] text-claudia-white">
      <NavBar />
      
      <div className="container mx-auto px-6 pt-32 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Preguntas Frecuentes
        </h1>
        <div className="max-w-3xl mx-auto mt-10">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="border-claudia-primary/20 bg-[#1a2a30] rounded-lg px-4">
              <AccordionTrigger className="text-claudia-white hover:text-claudia-primary">
                ¿Qué es ClaudIA?
              </AccordionTrigger>
              <AccordionContent className="text-claudia-white/80">
                ClaudIA es un asistente de inteligencia artificial avanzado diseñado para ayudarte con múltiples tareas a través de WhatsApp. Está programado para responder preguntas, proporcionar información y asistirte en diversas tareas diarias.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border-claudia-primary/20 bg-[#1a2a30] rounded-lg px-4">
              <AccordionTrigger className="text-claudia-white hover:text-claudia-primary">
                ¿Cómo funciona ClaudIA?
              </AccordionTrigger>
              <AccordionContent className="text-claudia-white/80">
                ClaudIA funciona a través de WhatsApp. Simplemente registra tu cuenta, inicia sesión y comienza a chatear con ClaudIA enviando mensajes a nuestro número oficial. ClaudIA utilizará inteligencia artificial para entender tus necesidades y responder de manera adecuada.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border-claudia-primary/20 bg-[#1a2a30] rounded-lg px-4">
              <AccordionTrigger className="text-claudia-white hover:text-claudia-primary">
                ¿Es seguro usar ClaudIA?
              </AccordionTrigger>
              <AccordionContent className="text-claudia-white/80">
                Sí, ClaudIA toma muy en serio la seguridad de tus datos. Toda la información compartida se maneja con estrictos protocolos de seguridad y privacidad. No compartimos tu información personal con terceros sin tu consentimiento.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border-claudia-primary/20 bg-[#1a2a30] rounded-lg px-4">
              <AccordionTrigger className="text-claudia-white hover:text-claudia-primary">
                ¿Qué planes de suscripción ofrece ClaudIA?
              </AccordionTrigger>
              <AccordionContent className="text-claudia-white/80">
                ClaudIA ofrece varios planes según tus necesidades. Tenemos un plan básico gratuito con funcionalidades limitadas, y planes premium con características adicionales como mayor número de consultas, tiempos de respuesta prioritarios y funcionalidades avanzadas. Visita nuestra sección de Precios para más detalles.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border-claudia-primary/20 bg-[#1a2a30] rounded-lg px-4">
              <AccordionTrigger className="text-claudia-white hover:text-claudia-primary">
                ¿Cómo puedo contactar con soporte?
              </AccordionTrigger>
              <AccordionContent className="text-claudia-white/80">
                Para contactar con nuestro equipo de soporte, puedes enviar un mensaje directo a nuestro número de WhatsApp indicando que necesitas ayuda con un problema específico. Un miembro de nuestro equipo te atenderá lo antes posible.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
