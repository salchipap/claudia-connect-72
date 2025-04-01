
import React from 'react';
import { Search, FileText, Image, Globe, MessageCircle, Brain, Zap } from 'lucide-react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';

const FeatureItem = ({ 
  title, 
  description, 
  icon, 
  imageUrl, 
  imageAlt, 
  reversed = false 
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  imageUrl: string;
  imageAlt: string;
  reversed?: boolean;
}) => {
  return (
    <div className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 mb-16 items-center`}>
      <div className="flex-1 space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-claudia-primary/20 rounded-full text-claudia-primary">
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-claudia-white">{title}</h3>
        </div>
        <p className="text-lg text-claudia-white/80 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="flex-1 glass-card overflow-hidden">
        <img 
          src={imageUrl} 
          alt={imageAlt} 
          className="w-full h-auto object-cover rounded-lg transition-transform hover:scale-105 duration-300" 
        />
      </div>
    </div>
  );
};

const KnowClaudia = () => {
  const features = [
    {
      title: "Búsqueda Inteligente en Internet",
      description: "ClaudIA puede realizar búsquedas precisas en internet para encontrar la información más relevante y actualizada. Utiliza algoritmos avanzados para filtrar y presentar solo los datos más pertinentes a tu consulta.",
      icon: <Search size={24} />,
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      imageAlt: "Búsqueda inteligente en internet"
    },
    {
      title: "Análisis de Documentos",
      description: "Extrae información clave de documentos complejos y obtén respuestas precisas sobre su contenido. ClaudIA puede procesar PDFs, documentos de texto y otros formatos para ayudarte a encontrar exactamente lo que necesitas.",
      icon: <FileText size={24} />,
      imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
      imageAlt: "Análisis de documentos"
    },
    {
      title: "Extracción de Texto de Imágenes",
      description: "ClaudIA puede extraer texto de imágenes utilizando tecnología OCR avanzada. Convierte el contenido visual en texto digital que puedes editar, buscar o analizar según tus necesidades.",
      icon: <Image size={24} />,
      imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      imageAlt: "Extracción de texto de imágenes"
    },
    {
      title: "Traducción Avanzada",
      description: "Traduce textos manteniendo el contexto y los matices culturales con alta precisión. ClaudIA puede ayudarte a comunicarte efectivamente en múltiples idiomas, respetando el significado original del mensaje.",
      icon: <Globe size={24} />,
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      imageAlt: "Traducción avanzada"
    },
    {
      title: "Conversación Natural",
      description: "Interactúa de forma natural con ClaudIA y obtén respuestas claras, relevantes y personalizadas. La IA está diseñada para entender el contexto de tus preguntas y proporcionarte información útil.",
      icon: <MessageCircle size={24} />,
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      imageAlt: "Conversación natural"
    },
    {
      title: "Generación de Contenido",
      description: "ClaudIA puede crear contenido original como artículos, resúmenes, informes y más. Utiliza técnicas avanzadas de procesamiento de lenguaje para generar textos coherentes y relevantes según tus necesidades.",
      icon: <Brain size={24} />,
      imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      imageAlt: "Generación de contenido"
    },
    {
      title: "Automatización Inteligente",
      description: "Automatiza tareas repetitivas y ahorra tiempo con la inteligencia de ClaudIA. Desde programación de recordatorios hasta clasificación de información, ClaudIA te ayuda a ser más productivo.",
      icon: <Zap size={24} />,
      imageUrl: "https://images.unsplash.com/photo-1585909695284-32d2985ac9c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      imageAlt: "Automatización inteligente"
    }
  ];

  return (
    <div className="min-h-screen bg-[#142126] text-claudia-foreground">
      <NavBar />
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-claudia-white">
              Conoce a <span className="text-claudia-primary">ClaudIA</span>
            </h1>
            <p className="text-xl md:text-2xl text-claudia-white/80 max-w-3xl mx-auto">
              Descubre todas las capacidades de nuestra asistente inteligente y cómo puede transformar tu productividad.
            </p>
          </div>
          
          {/* Features */}
          <div className="space-y-12">
            {features.map((feature, index) => (
              <FeatureItem 
                key={index}
                {...feature}
                reversed={index % 2 !== 0}
              />
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-claudia-white">
              ¿Listo para experimentar el poder de <span className="text-claudia-primary">ClaudIA</span>?
            </h2>
            <p className="text-xl text-claudia-white/80 max-w-2xl mx-auto mb-8">
              Regístrate hoy mismo y comienza a aprovechar todas las capacidades que ClaudIA tiene para ofrecerte.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/register" className="btn bg-claudia-primary hover:bg-claudia-primary/90 text-black font-semibold py-3 px-8 rounded-lg transition-colors">
                Registrarse
              </a>
              <a href="/login" className="btn bg-transparent border border-claudia-primary text-claudia-primary hover:bg-claudia-primary/10 font-semibold py-3 px-8 rounded-lg transition-colors">
                Iniciar Sesión
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default KnowClaudia;
