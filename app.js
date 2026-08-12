import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import {getFirestore,doc,setDoc,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';

const M=window.DEMOL_QUESTIONS,O=window.DEMOL_OPEN_QUESTIONS,N=window.DEMOL_NAMES,$=id=>document.getElementById(id);
N.forEach(n=>{const o=document.createElement('option');o.value=n;o.textContent=n;$('name').appendChild(o)});

// Open vragen worden tussen de meerkeuzevragen gemengd zodat Mol-vragen niet bij elkaar staan.
const slots=[3,7,11,15,19,23,27,31,34,37,40];
let sequence=[],mi=0,oi=0;
for(let pos=1;pos<=40;pos++){
  if(slots.includes(pos)) sequence.push({type:'open',i:oi++});
  else sequence.push({type:'mc',i:mi++});
}

let idx=0,person='',mc=Array(M.length).fill(null),open=Array(O.length).fill('');
const appFirebase=initializeApp(window.FIREBASE_CONFIG);
const db=getFirestore(appFirebase);

function show(id){['start','quiz','review','done'].forEach(x=>$(x).classList.toggle('hidden',x!==id))}
function questionText(item){
  let t=O[item.i];
  if(item.type==='open'&&item.i===5){
    const mol=open[1].trim();
    t=t.replace('{mol}',mol||'die persoon');
  }
  return t;
}
function saveOpen(){
  const item=sequence[idx];
  if(item.type==='open') open[item.i]=$('openAnswer').value.trim();
}
function render(){
  const item=sequence[idx];
  $('who').textContent=person;
  $('counter').textContent=(idx+1)+' / 40';
  $('bar').style.width=((idx+1)/40*100)+'%';
  $('qno').textContent=(item.type==='mc'?'Meerkeuzevraag ':'Open vraag ')+(item.i+1);
  $('options').innerHTML='';
  $('openAnswer').classList.add('hidden');

  if(item.type==='mc'){
    const q=M[item.i];
    $('question').textContent=q.vraag;
    ['A','B','C','D'].forEach(l=>{
      const lab=document.createElement('label');
      lab.className='option'+(mc[item.i]===l?' selected':'');
      lab.innerHTML='<input type="radio" name="ans" value="'+l+'" '+(mc[item.i]===l?'checked':'')+'><span class="letter">'+l+'</span><span>'+q[l]+'</span>';
      lab.querySelector('input').onchange=()=>{mc[item.i]=l;render()};
      $('options').appendChild(lab);
    });
  } else {
    $('question').textContent=questionText(item);
    $('openAnswer').classList.remove('hidden');
    $('openAnswer').value=open[item.i]||'';
  }
  $('prev').disabled=idx===0;
  $('next').textContent=idx===39?'Naar controle →':'Volgende →';
  $('quizMsg').classList.add('hidden');
}

$('startBtn').onclick=()=>{
  person=$('name').value;
  if(!person){
    $('startMsg').textContent='Kies eerst je naam.';
    $('startMsg').classList.remove('hidden');
    return;
  }
  $('startMsg').classList.add('hidden');
  show('quiz');
  render();
};

$('prev').onclick=()=>{saveOpen();if(idx>0){idx--;render()}};

$('next').onclick=()=>{
  const item=sequence[idx];
  if(item.type==='open'){
    saveOpen();
    if(!open[item.i]){
      $('quizMsg').textContent='Vul eerst een antwoord in.';
      $('quizMsg').classList.remove('hidden');
      return;
    }
  } else if(!mc[item.i]){
    $('quizMsg').textContent='Kies eerst een antwoord.';
    $('quizMsg').classList.remove('hidden');
    return;
  }
  if(idx<39){idx++;render()}
  else{
    $('reviewText').textContent='Alle 29 meerkeuzevragen en 11 open vragen zijn ingevuld voor '+person+'.';
    show('review');
  }
};

$('backBtn').onclick=()=>{show('quiz');render()};

$('submitBtn').onclick=async()=>{
  $('submitBtn').disabled=true;
  $('submitMsg').className='msg';
  $('submitMsg').textContent='Antwoorden opslaan…';
  $('submitMsg').classList.remove('hidden');
  try{
    const answerDetails=M.map((q,i)=>({vraag:q.vraag,keuze:mc[i],antwoord:q[mc[i]]}));
    const openAnswerDetails=O.map((q,i)=>({
      vraag:i===5?q.replace('{mol}',open[1].trim()||'die persoon'):q,
      antwoord:open[i]
    }));
    const key=person.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-');
    await setDoc(doc(db,'responses',key),{
      name:person,
      answers:mc,
      answerDetails,
      openAnswers:open,
      openAnswerDetails,
      submittedAt:serverTimestamp(),
      version:'1.6'
    });
    show('done');
  }catch(e){
    console.error(e);
    $('submitBtn').disabled=false;
    $('submitMsg').className='msg error';
    $('submitMsg').textContent='Opslaan mislukt. Controleer je internetverbinding en de Firestore-regels.';
  }
};
