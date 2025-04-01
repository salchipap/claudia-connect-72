
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, PlusCircle, X } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Reminder } from '@/types/Reminder';

const Dashboard = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    message: '',
    description: '',
    date: new Date().toISOString(),
    send_date: new Date().toISOString(),
    action: '',
    remotejid: '',
    repetition: '',
  });
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/register');
        return;
      }
      
      setUser(session.user);
      fetchReminders(session.user.id);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/register');
        } else if (session && event === 'SIGNED_IN') {
          setUser(session.user);
          fetchReminders(session.user.id);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchReminders = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId);
        
      if (error) {
        throw error;
      }
      
      setReminders(data as Reminder[]);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  const addReminder = async () => {
    if (!user) return;
    
    if (!newReminder.title || !newReminder.message || !newReminder.remotejid) {
      toast.error('Please fill all required fields');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert([
          {
            user_id: user.id,
            title: newReminder.title,
            message: newReminder.message,
            description: newReminder.description,
            date: newReminder.date,
            send_date: newReminder.send_date,
            action: newReminder.action,
            remotejid: newReminder.remotejid,
            repetition: newReminder.repetition,
            origin: 'manual',
            status: 'pending'
          }
        ])
        .select();
        
      if (error) {
        throw error;
      }
      
      setReminders([...reminders, data[0] as Reminder]);
      setIsAddReminderOpen(false);
      resetNewReminder();
      toast.success('Reminder added successfully');
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast.error('Failed to add reminder');
    }
  };

  const resetNewReminder = () => {
    setNewReminder({
      title: '',
      message: '',
      description: '',
      date: new Date().toISOString(),
      send_date: new Date().toISOString(),
      action: '',
      remotejid: '',
      repetition: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Sent</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-[#142126] text-claudia-white py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-claudia-white">Dashboard</h1>
            <p className="text-claudia-white/70">Manage your reminders and schedule</p>
          </div>
          <Button 
            onClick={() => setIsAddReminderOpen(true)} 
            className="bg-claudia-primary hover:bg-claudia-primary/90"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Card */}
          <Card className="bg-[#1a2a30] border-claudia-primary/20 text-claudia-white">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription className="text-claudia-white/70">View your schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border border-claudia-primary/20 bg-[#142126]"
              />
            </CardContent>
          </Card>
          
          {/* Reminders List */}
          <Card className="bg-[#1a2a30] border-claudia-primary/20 text-claudia-white lg:col-span-2">
            <CardHeader>
              <CardTitle>Reminders</CardTitle>
              <CardDescription className="text-claudia-white/70">Your upcoming tasks and reminders</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-claudia-primary"></div>
                </div>
              ) : reminders.length === 0 ? (
                <div className="text-center py-8 text-claudia-white/70">
                  <p>No reminders yet</p>
                  <Button 
                    onClick={() => setIsAddReminderOpen(true)} 
                    variant="link" 
                    className="text-claudia-primary mt-2"
                  >
                    Create your first reminder
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div 
                      key={reminder.id} 
                      className="p-4 rounded-lg border border-claudia-primary/20 bg-[#142126] hover:bg-[#1d2e36] transition-colors"
                    >
                      <div className="flex justify-between">
                        <h3 className="font-medium text-claudia-white">{reminder.title}</h3>
                        {getStatusBadge(reminder.status)}
                      </div>
                      <p className="text-claudia-white/70 text-sm mt-1">{reminder.message}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-claudia-white/50">
                        <div>
                          <span className="font-medium">Date:</span> {new Date(reminder.date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Send Date:</span> {new Date(reminder.send_date).toLocaleDateString()}
                        </div>
                        {reminder.repetition && (
                          <div>
                            <span className="font-medium">Repetition:</span> {reminder.repetition}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Add Reminder Dialog */}
      <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
        <DialogContent className="bg-[#1a2a30] text-claudia-white border-claudia-primary/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
            <DialogDescription className="text-claudia-white/70">
              Create a new reminder to be sent via WhatsApp
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                placeholder="Meeting with client" 
                className="bg-[#142126] border-claudia-primary/30 text-claudia-white"
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder="Don't forget your meeting tomorrow at 2pm" 
                className="bg-[#142126] border-claudia-primary/30 text-claudia-white"
                value={newReminder.message}
                onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Input 
                id="description" 
                placeholder="Additional details" 
                className="bg-[#142126] border-claudia-primary/30 text-claudia-white"
                value={newReminder.description}
                onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-[#142126] border-claudia-primary/30 text-claudia-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(newReminder.date), 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1a2a30] border-claudia-primary/20">
                    <Calendar
                      mode="single"
                      selected={new Date(newReminder.date)}
                      onSelect={(date) => setNewReminder({...newReminder, date: date?.toISOString() || new Date().toISOString()})}
                      initialFocus
                      className="bg-[#142126]"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="send_date">Send Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-[#142126] border-claudia-primary/30 text-claudia-white"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(newReminder.send_date), 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1a2a30] border-claudia-primary/20">
                    <Calendar
                      mode="single"
                      selected={new Date(newReminder.send_date)}
                      onSelect={(date) => setNewReminder({...newReminder, send_date: date?.toISOString() || new Date().toISOString()})}
                      initialFocus
                      className="bg-[#142126]"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="remotejid">Phone Number (WhatsApp)</Label>
              <Input 
                id="remotejid" 
                placeholder="573128310805" 
                className="bg-[#142126] border-claudia-primary/30 text-claudia-white"
                value={newReminder.remotejid}
                onChange={(e) => setNewReminder({...newReminder, remotejid: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="repetition">Repetition (Optional)</Label>
              <Select onValueChange={(value) => setNewReminder({...newReminder, repetition: value})}>
                <SelectTrigger className="bg-[#142126] border-claudia-primary/30 text-claudia-white">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a2a30] border-claudia-primary/30 text-claudia-white">
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="action">Action (Optional)</Label>
              <Input 
                id="action" 
                placeholder="Call client" 
                className="bg-[#142126] border-claudia-primary/30 text-claudia-white"
                value={newReminder.action}
                onChange={(e) => setNewReminder({...newReminder, action: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddReminderOpen(false)} className="border-claudia-primary/30 text-claudia-white">
              Cancel
            </Button>
            <Button onClick={addReminder} className="bg-claudia-primary hover:bg-claudia-primary/90">
              Add Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
