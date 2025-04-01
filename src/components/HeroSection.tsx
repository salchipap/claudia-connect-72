
import React from 'react';
import Button from './Button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  // Función para abrir el modal de inicio de sesión
  const handleLoginClick = () => {
    // Navegar a la ruta de login donde se muestra el formulario
    navigate('/login');
  };

  return <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden py-12 sm:py-0">
      {/* Abstract Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-radial from-claudia-muted to-background opacity-70"></div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-claudia-secondary via-transparent to-transparent opacity-40"></div>
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-claudia-secondary opacity-20 blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 left-1/3 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-claudia-accent opacity-10 blur-3xl animate-float" style={{
      animationDelay: '2s'
    }}></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Added Image */}
        <div className="mb-4 flex justify-center">
          <img src="https://img.recraft.ai/TPT2gnDTOAplVWXdKprcxYJZGSC82p_p5DJzbNYpSyU/rs:fit:1024:1024:0/q:95/g:no/plain/abs://prod/images/8fbdfedc-79e6-4ae5-9912-89c9048c67d8@jpg" alt="ClaudIA" className="rounded-lg w-28 h-28 sm:w-40 sm:h-40 object-cover animate-fade-in shadow-lg" />
        </div>
        
        <div className="inline-block px-3 py-1 rounded-full bg-opacity-30 text-claudia-primary text-sm font-medium mb-4 animate-fade-in bg-inherit">
          Inteligencia artificial avanzada
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 tracking-tight animate-fade-in text-slate-50">
          Explora el conocimiento con <span className="text-claudia-primary">ClaudIA</span>
        </h1>
        
        <p className="text-base sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto animate-fade-in" style={{
        animationDelay: '200ms'
      }}>
          Una inteligencia artificial que realiza búsquedas en internet, investigaciones, traducciones, extracción de texto de imágenes y responde a tus preguntas con precisión.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{
        animationDelay: '400ms'
      }}>
          {/* Botón de Chatear con ClaudIA - Actualizado con estilo consistente */}
          <Button 
            href="https://wa.me/573128310805" 
            variant="primary" 
            size="lg" 
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full overflow-hidden">
                <img 
                  src="https://img.recraft.ai/TPT2gnDTOAplVWXdKprcxYJZGSC82p_p5DJzbNYpSyU/rs:fit:1024:1024:0/q:95/g:no/plain/abs://prod/images/8fbdfedc-79e6-4ae5-9912-89c9048c67d8@jpg" 
                  alt="ClaudIA" 
                  className="h-full w-full object-cover" 
                />
              </div>
              <span>Chatear con ClaudIA</span>
            </div>
            <ArrowRight className="h-5 w-5" />
          </Button>
          
          {/* Botón de Iniciar Sesión - Ahora abre el modal en lugar de redireccionar */}
          <Button 
            onClick={handleLoginClick} 
            variant="ghost" 
            size="lg" 
            className="w-full sm:w-auto text-claudia-white"
          >
            Iniciar Sesión
          </Button>
          
          {/* Mantener el botón de Registrarse */}
          <Button to="/register" variant="outlined" size="lg" className="w-full sm:w-auto text-claudia-white">
            Registrarse
          </Button>
        </div>
      </div>
    </section>;
};
export default HeroSection;
