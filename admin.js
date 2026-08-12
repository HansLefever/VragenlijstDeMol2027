import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js';
import {getFirestore,collection,getDocs} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js';
import {getAuth,signInWithEmailAndPassword,signOut,onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js';

const $ = id => document.getElementById(id);
let rows = [];
const app = initializeApp(window.FIREBASE_CONFIG);
const db = getFirestore(app);
const auth = getAuth(app);

function msg(text, type='') {
  $('msg').className = 'msg' + (type ? ' ' + type : '');
  $('msg').textContent = text;
  $('msg').classList.remove('hidden');
}

function showLoggedIn(user) {
  $('loginBox').classList.add('hidden');
  $('adminBox').classList.remove('hidden');
  $('loggedInAs').textContent = user.email || 'beheerder';
}

function showLoggedOut() {
  $('loginBox').classList.remove('hidden');
  $('adminBox').classList.add('hidden');
  $('table').classList.add('hidden');
  $('csv').disabled = true;
}

$('login').onclick = async () => {
  const email = $('email').value.trim();
  const password = $('password').value;
  if (!email || !password) return msg('Vul e-mailadres en wachtwoord in.', 'error');
  try {
    msg('Aanmelden…');
    await signInWithEmailAndPassword(auth, email, password);
    $('msg').classList.add('hidden');
  } catch (e) {
    console.error(e);
    msg('Aanmelden mislukt. Controleer e-mailadres, wachtwoord en Firebase Authentication.', 'error');
  }
};

$('logout').onclick = async () => {
  await signOut(auth);
};

$('load').onclick = async () => {
  try {
    msg('Laden…');
    const s = await getDocs(collection(db, 'responses'));
    rows = [];
    s.forEach(d => rows.push(d.data()));
    rows.sort((a,b) => (a.name || '').localeCompare(b.name || '', 'nl'));
    let h = '<table><thead><tr><th>Naam</th>' +
      window.DEMOL_QUESTIONS.map((_,i) => '<th>V'+(i+1)+'</th>').join('') +
      '</tr></thead><tbody>';
    for (const r of rows) {
      h += '<tr><td>' + (r.name || '') + '</td>' +
        window.DEMOL_QUESTIONS.map((_,i) => '<td>' + (((r.answers||[])[i]) || '') + '</td>').join('') +
        '</tr>';
    }
    h += '</tbody></table>';
    $('table').innerHTML = h;
    $('table').classList.remove('hidden');
    msg(rows.length + ' deelnemer(s) gevonden.', 'ok');
    $('csv').disabled = !rows.length;
  } catch (e) {
    console.error(e);
    msg('Laden mislukt. Controleer je aanmelding en Firestore-regels.', 'error');
  }
};

$('csv').onclick = () => {
  if (!rows.length) return;
  const esc = v => '"' + String(v ?? '').replaceAll('"','""') + '"';
  const header = ['Naam', ...window.DEMOL_QUESTIONS.map((_,i) => 'V'+(i+1))];
  const lines = [header.map(esc).join(';')];
  for (const r of rows) lines.push([r.name, ...(r.answers||[])].map(esc).join(';'));
  const blob = new Blob(['\ufeff' + lines.join('\r\n')], {type:'text/csv;charset=utf-8'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'De_Mol_2027_antwoorden.csv';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

onAuthStateChanged(auth, user => user ? showLoggedIn(user) : showLoggedOut());
