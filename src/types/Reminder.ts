
export type Reminder = {
  id: string;
  user_id: string;
  title?: string; // Keep for backward compatibility
  reminder: string; // New field, changed to required
  message?: string; // Keep for backward compatibility
  action: string; // New field, changed to required
  description?: string;
  date: string;
  send_date: string;
  remotejid: string;
  status: string;
  repetition?: string;
  origin: string;
  created_at: string;
  updated_at: string;
};
