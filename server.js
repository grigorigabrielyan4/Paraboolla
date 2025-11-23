import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 5000;
const PUBLIC = path.join(process.cwd(), 'public');
const DATA_FILE = path.join(process.cwd(), 'feedbacks.json');

app.use(bodyParser.json());
app.use(express.static(PUBLIC));

if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]), 'utf8');

app.post('/feedback', (req,res)=>{
  try {
    const payload = req.body;
    if (!payload || !payload.message) return res.status(400).json({ success:false, message:'Invalid payload' });

    const all = JSON.parse(fs.readFileSync(DATA_FILE,'utf8'));
    all.push(payload);
    fs.writeFileSync(DATA_FILE, JSON.stringify(all,null,2),'utf8');
    console.log('✅ New feedback saved:', payload);
    res.json({ success:true, message:'Շնորհակալություն — կարծիքը ուղարկված է։' });
  } catch(err){
    console.error('❌ Error saving feedback:',err);
    res.status(500).json({ success:false, message:'Սխալ՝ պահպանման ընթացքում։' });
  }
});

app.listen(PORT, ()=>console.log(`✅ Server running at http://localhost:${PORT}`));
