
export type Reminder = {
  id: string;
  user_id: string;
  reminder: string;
  action: string;
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
