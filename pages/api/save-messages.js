// pages/api/save-message.js
import supabase from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { user_id, user_message, bot_response } = req.body;

  const { error } = await supabase
    .from('chat_messages')
    .insert([{ user_id, user_message, bot_response }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Saved' });
}
