import express from 'express';
import { protect } from '../middleware/auth.js';
import client from '../utils/aiClient.js';
import Student from '../models/Student.js';
import Marks from '../models/Marks.js';
const router = express.Router();

router.post('/query', protect, async (req,res)=>{
  const { query } = req.body;
  try{
    // Example: simple AI response from OpenAI
    const students = await Student.find().limit(5);
    const marks = await Marks.find().limit(5);
    const context = `Students: ${students.map(s=>s.fullName).join(', ')}. Marks: ${marks.map(m=>m.score).join(', ')}`;
    
    const completion = await client.chat.completions.create({
      model:'gpt-4',
      messages:[
        { role:'system', content:'You are a school analytics assistant.' },
        { role:'user', content: query + '. Context: ' + context }
      ]
    });
    res.json({ answer: completion.choices[0].message.content });
  }catch(e){ res.status(500).json({ error: e.message }); }
});

export default router;
