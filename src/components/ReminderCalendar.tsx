
import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, isBefore, startOfDay, set } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Reminder } from "@/types/Reminder";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  CalendarClock, 
  CalendarDays, 
  Check, 
  Plus, 
  Clock, 
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronDown,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema de validación para el formulario
const reminderFormSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  message: z.string().min(1, { message: "El mensaje es obligatorio" }),
  description: z.string().optional(),
  time: z.string().min(1, { message: "La hora es obligatoria" }),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

const ReminderCalendar = () => {
  // Initialize with current date
  const today = startOfDay(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(today);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [reminderDates, setReminderDates] = useState<Date[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [creatingReminder, setCreatingReminder] = useState(false);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();

  // Inicializar react-hook-form
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      title: "",
      message: "",
      description: "",
      time: format(new Date().setMinutes(Math.ceil(new Date().getMinutes() / 5) * 5), "HH:mm"),
    },
  });

  useEffect(() => {
    if (!user) return;

    const fetchReminders = async () => {
      setLoadingReminders(true);
      try {
        const { data, error } = await supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const formattedReminders = data as Reminder[];
        setReminders(formattedReminders);

        const dates = formattedReminders.map(reminder => new Date(reminder.date));
        setReminderDates(dates);
      } catch (error: any) {
        console.error('Error fetching reminders:', error.message);
        toast({
          title: "Error",
          description: "No se pudieron cargar los recordatorios",
          variant: "destructive",
        });
      } finally {
        setLoadingReminders(false);
      }
    };

    fetchReminders();
  }, [user, toast]);

  const getRemindersForSelectedDate = () => {
    if (!selectedDate) return [];
    return reminders.filter(reminder => 
      isSameDay(new Date(reminder.date), selectedDate)
    );
  };

  const onSubmit = async (data: ReminderFormValues) => {
    if (!user || !selectedDate) return;
    
    setCreatingReminder(true);
    
    try {
      // Crear fecha de envío combinando la fecha seleccionada con la hora elegida
      const [hours, minutes] = data.time.split(':').map(Number);
      const sendDate = new Date(selectedDate);
      sendDate.setHours(hours, minutes, 0, 0);
      
      // Validar que la fecha de envío no sea en el pasado
      if (isBefore(sendDate, new Date())) {
        toast({
          title: "Fecha inválida",
          description: "La hora de envío no puede ser en el pasado",
          variant: "destructive",
        });
        setCreatingReminder(false);
        return;
      }
      
      // Verificar si el usuario tiene recordatorios disponibles
      if (!userProfile?.reminders || parseInt(userProfile.reminders) <= 0) {
        toast({
          title: "Sin recordatorios disponibles",
          description: "Has alcanzado el límite de recordatorios disponibles",
          variant: "destructive",
        });
        setCreatingReminder(false);
        return;
      }
      
      let phoneNumber = '';
      
      if (userProfile?.remotejid) {
        phoneNumber = userProfile.remotejid;
      } else if (user?.user_metadata?.remotejid) {
        phoneNumber = user.user_metadata.remotejid;
      } else {
        toast({
          title: "Advertencia",
          description: "No tienes un número de teléfono configurado. El recordatorio se guardará pero no podrá enviarse.",
          variant: "default",
        });
        phoneNumber = 'sin-telefono';
      }
      
      console.log('Número de teléfono usado para el recordatorio:', phoneNumber);
      
      const reminderData = {
        user_id: user.id,
        title: data.title,
        message: data.message,
        description: data.description || null,
        date: selectedDate.toISOString(),
        send_date: sendDate.toISOString(),
        remotejid: phoneNumber,
        status: 'pending',
        origin: 'manual',
      };
      
      console.log('Datos del recordatorio a guardar:', reminderData);
      
      // Crear el recordatorio
      const { data: reminderResponse, error } = await supabase
        .from('reminders')
        .insert(reminderData)
        .select();
        
      if (error) throw error;
      
      if (reminderResponse && reminderResponse.length > 0) {
        const newReminderData = reminderResponse[0] as Reminder;
        setReminders([...reminders, newReminderData]);
        
        setReminderDates([...reminderDates, selectedDate]);
        
        // Decrementar el contador de recordatorios disponibles
        if (userProfile && userProfile.reminders) {
          const currentReminders = parseInt(userProfile.reminders);
          const newCount = Math.max(0, currentReminders - 1).toString();
          
          const { error: updateError } = await supabase
            .from('users')
            .update({ reminders: newCount })
            .eq('id', user.id);
            
          if (updateError) {
            console.error('Error al actualizar recordatorios disponibles:', updateError);
          } else {
            console.log('Recordatorios disponibles actualizados a:', newCount);
          }
        }
        
        toast({
          title: "Recordatorio creado",
          description: "Tu recordatorio ha sido programado exitosamente",
        });
        
        form.reset();
        setIsCreateDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Error creating reminder:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el recordatorio. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setCreatingReminder(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    // Prevent selecting dates before today
    if (date && !isBefore(date, today)) {
      setSelectedDate(date);
      setPopoverOpen(false);
    } else if (date && isBefore(date, today)) {
      toast({
        title: "Fecha inválida",
        description: "No puedes seleccionar fechas anteriores a hoy",
        variant: "destructive",
      });
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'sent': return 'Enviado';
      case 'failed': return 'Fallido';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };
  
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'pending': 
        return 'bg-yellow-500/20 text-yellow-300';
      case 'sent': 
        return 'bg-green-500/20 text-green-300';
      case 'failed': 
        return 'bg-red-500/20 text-red-300';
      case 'cancelled': 
        return 'bg-gray-500/20 text-gray-300';
      default: 
        return 'bg-blue-500/20 text-blue-300';
    }
  };

  return (
    <div className="bg-[#1a2a30] rounded-lg shadow-xl">
      <div className="p-6 border-b border-claudia-primary/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-claudia-primary" />
            <h2 className="text-2xl font-bold text-claudia-white">Calendario de Recordatorios</h2>
          </div>
          <Button 
            onClick={() => {
              form.reset();
              setIsCreateDialogOpen(true);
            }}
            className="bg-claudia-primary hover:bg-claudia-primary/80 text-claudia-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Crear Recordatorio
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <Card className="flex-1 bg-[#142126] border-claudia-primary/10 shadow-lg">
            <CardContent className="p-4">
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-left font-normal bg-[#1a2a30] border-claudia-primary/20 text-claudia-white hover:bg-[#1a2a30]/80"
                  >
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-5 w-5 text-claudia-primary" />
                      {selectedDate ? format(selectedDate, "PPPP", { locale: es }) : "Seleccionar fecha"}
                    </div>
                    <ChevronDown className="h-4 w-4 text-claudia-primary/70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-[#1a2a30] border-claudia-primary/20">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    locale={es}
                    className="bg-[#142126] rounded-md border border-claudia-primary/10 shadow-md"
                    disabled={(date) => isBefore(date, today)}
                    modifiersClassNames={{
                      selected: 'bg-claudia-primary text-claudia-white',
                      today: 'bg-claudia-primary/10 text-claudia-white',
                    }}
                    modifiers={{
                      highlighted: (date) => reminderDates.some(reminderDate => 
                        isSameDay(reminderDate, date)
                      )
                    }}
                    modifiersStyles={{
                      highlighted: { 
                        border: '2px solid rgba(36, 210, 102, 0.5)',
                        borderRadius: '100%',
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-claudia-white mb-3 flex items-center">
                  Leyenda
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-[#24D266]"></div>
                    <span className="text-claudia-white/90">Día seleccionado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-[#24D266]/20"></div>
                    <span className="text-claudia-white/90">Hoy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-[#24D266]/50"></div>
                    <span className="text-claudia-white/90">Tiene recordatorios</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-[2] bg-[#142126] border-claudia-primary/10 shadow-lg">
            <CardContent className="p-4">
              <h3 className="text-xl font-semibold text-claudia-white mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarClock size={20} className="text-claudia-primary mr-2" />
                  {selectedDate ? 
                    format(selectedDate, "d 'de' MMMM, yyyy", { locale: es }) : 
                    "Selecciona una fecha para ver recordatorios"}
                </div>
                
                {selectedDate && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-claudia-primary hover:text-claudia-white hover:bg-claudia-primary/20"
                    onClick={() => {
                      form.reset();
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Nuevo
                  </Button>
                )}
              </h3>

              {loadingReminders ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-t-claudia-primary border-r-claudia-primary/70 border-b-claudia-primary/40 border-l-claudia-primary/20"></div>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  {getRemindersForSelectedDate().length > 0 ? (
                    getRemindersForSelectedDate().map((reminder) => (
                      <div 
                        key={reminder.id} 
                        className="p-4 bg-[#1a2a30] rounded-md border-l-4 border-claudia-primary border-y border-r hover:bg-[#1a2a30]/80 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-lg text-claudia-white">{reminder.title}</h4>
                            <p className="text-claudia-white/90 mt-1">{reminder.message}</p>
                            {reminder.description && (
                              <p className="text-claudia-white/70 mt-2 text-sm">{reminder.description}</p>
                            )}
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(reminder.status)}`}>
                            {getStatusText(reminder.status)}
                          </span>
                        </div>
                        <div className="mt-3 text-sm text-claudia-white/60 flex items-center gap-2">
                          <Clock size={14} className="text-claudia-primary" />
                          <span>Envío: {format(new Date(reminder.send_date), "d MMM yyyy, HH:mm", { locale: es })}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-14 px-4 border-2 border-dashed border-claudia-primary/20 rounded-lg">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-claudia-primary/10 rounded-full">
                          <CalendarClock size={32} className="text-claudia-primary" />
                        </div>
                        <h4 className="text-xl font-medium text-claudia-white">No hay recordatorios</h4>
                        <p className="text-claudia-white/60 max-w-xs">No hay recordatorios programados para esta fecha. ¿Quieres crear uno?</p>
                        <Button 
                          variant="outline" 
                          className="mt-2 border-claudia-primary text-claudia-primary hover:bg-claudia-primary/10"
                          onClick={() => {
                            form.reset();
                            setIsCreateDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" /> Crear Recordatorio
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-[#1a2a30] text-claudia-white border-claudia-primary/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-claudia-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-claudia-primary" />
              Crear Nuevo Recordatorio
            </DialogTitle>
            <DialogDescription className="text-claudia-white/70">
              Programa un recordatorio para {selectedDate ? format(selectedDate, "d 'de' MMMM, yyyy", { locale: es }) : "la fecha seleccionada"}.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
              <div className="p-3 bg-[#142126]/70 rounded-md flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-claudia-primary" />
                <span className="text-claudia-white/80">
                  Número de teléfono: {userProfile?.remotejid || user?.user_metadata?.remotejid || 'No disponible'}
                </span>
                {!userProfile?.remotejid && !user?.user_metadata?.remotejid && (
                  <div className="ml-auto px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full">
                    ¡Importante!
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-claudia-white">Título</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Título del recordatorio" 
                        className="bg-[#142126] border-claudia-primary/20 text-claudia-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-claudia-white">Mensaje</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Contenido del recordatorio" 
                        className="bg-[#142126] border-claudia-primary/20 text-claudia-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-claudia-white">Descripción (opcional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalles adicionales" 
                        className="bg-[#142126] border-claudia-primary/20 text-claudia-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-claudia-white flex items-center gap-1">
                      <Clock className="h-4 w-4 text-claudia-primary" />
                      Hora de envío
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="time" 
                        className="bg-[#142126] border-claudia-primary/20 text-claudia-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-claudia-primary/20 text-claudia-white hover:bg-[#142126]"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  className="bg-claudia-primary text-claudia-white hover:bg-claudia-primary/80"
                  disabled={creatingReminder}
                >
                  {creatingReminder ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-claudia-white border-t-transparent rounded-full" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Crear Recordatorio
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReminderCalendar;
