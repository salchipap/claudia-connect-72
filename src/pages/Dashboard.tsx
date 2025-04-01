
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import NavBar from '@/components/NavBar';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { Edit, Trash, Clock, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';

type Reminder = {
  id: string;
  title: string;
  message: string;
  description: string | null;
  date: string;
  send_date: string;
  action: string | null;
  remotejid: string;
  status: string;
  repetition: string | null;
  origin: string;
};

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to access the dashboard",
          variant: "destructive",
        });
        navigate('/');
        return;
      }
      
      setUser(data.session.user);
      fetchReminders();
    };
    
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/');
      } else if (session) {
        setUser(session.user);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  // Fetch reminders from Supabase
  const fetchReminders = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setReminders(data as Reminder[]);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast({
        title: "Error",
        description: "Failed to load reminders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter reminders by selected date
  const getRemindersForSelectedDate = () => {
    if (!date) return [];
    
    return reminders.filter(reminder => {
      const reminderDate = new Date(reminder.date);
      return (
        reminderDate.getDate() === date.getDate() &&
        reminderDate.getMonth() === date.getMonth() &&
        reminderDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Delete a reminder
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setReminders(reminders.filter(reminder => reminder.id !== id));
      
      toast({
        title: "Success",
        description: "Reminder deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive",
      });
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="min-h-screen bg-[#142126] text-claudia-foreground relative">
      <NavBar />
      
      <main className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-claudia-white">
              Your Dashboard
            </h1>
            <p className="text-claudia-white/70 text-lg">
              Manage your reminders and schedule with ClaudIA
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="col-span-1 bg-[#1a2a30] rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-claudia-white flex items-center">
                <CalendarIcon className="mr-2 text-claudia-primary" size={20} />
                Calendar
              </h2>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="border border-claudia-primary/20 rounded-md bg-[#142126] text-claudia-white"
                />
              </div>
            </div>
            
            {/* Reminders Section */}
            <div className="col-span-1 lg:col-span-2 bg-[#1a2a30] rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-claudia-white flex items-center">
                  <Clock className="mr-2 text-claudia-primary" size={20} />
                  Reminders
                  {date && (
                    <span className="ml-2 text-sm font-normal text-claudia-white/70">
                      {format(date, 'MMMM d, yyyy')}
                    </span>
                  )}
                </h2>
                <button 
                  className="flex items-center gap-1 px-3 py-1 bg-claudia-primary text-claudia-white rounded-md text-sm"
                  onClick={() => {
                    // For now just show a toast since we haven't implemented the add reminder form yet
                    toast({
                      title: "Coming soon",
                      description: "Add reminder functionality will be implemented soon",
                    });
                  }}
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
              
              {loading ? (
                <div className="text-center py-6 text-claudia-white/70">
                  Loading reminders...
                </div>
              ) : getRemindersForSelectedDate().length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-claudia-primary/20">
                        <TableHead className="text-claudia-white">Title</TableHead>
                        <TableHead className="text-claudia-white">Schedule</TableHead>
                        <TableHead className="text-claudia-white">Status</TableHead>
                        <TableHead className="text-claudia-white text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getRemindersForSelectedDate().map((reminder) => (
                        <TableRow 
                          key={reminder.id}
                          className="border-b border-claudia-primary/10 hover:bg-[#142126]/50"
                        >
                          <TableCell className="font-medium text-claudia-white">
                            {reminder.title}
                          </TableCell>
                          <TableCell className="text-claudia-white/80">
                            {formatDate(reminder.send_date)}
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              reminder.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : reminder.status === 'pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reminder.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                className="p-1 text-claudia-white/70 hover:text-claudia-primary"
                                onClick={() => {
                                  toast({
                                    title: "Coming soon",
                                    description: "Edit functionality will be implemented soon",
                                  });
                                }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="p-1 text-claudia-white/70 hover:text-claudia-primary/80"
                                onClick={() => handleDelete(reminder.id)}
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-claudia-primary/20 rounded-lg">
                  <Clock className="mx-auto h-12 w-12 text-claudia-primary/40 mb-2" />
                  <h3 className="text-lg font-medium text-claudia-white mb-1">No reminders for this date</h3>
                  <p className="text-claudia-white/60">
                    Select another date or add a new reminder
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
