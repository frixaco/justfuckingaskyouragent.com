const $ = (selector) => document.querySelector(selector);
const clean = (value, max) => (value || '').replace(/\s+/g, ' ').trim().slice(0, max);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

async function copyText(text, statusEl, okMessage, fallbackEl) {
  try {
    await navigator.clipboard.writeText(text);
    statusEl.textContent = okMessage;
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(fallbackEl);
    selection.removeAllRanges();
    selection.addRange(range);
    statusEl.textContent = 'Clipboard blocked. It’s selected — hit ⌘C or Ctrl+C like an animal.';
  }
}

/* ---------- Hero: personalised "someone sent you this" + typing demo ---------- */

const params = new URLSearchParams(window.location.search);
const to = clean(params.get('to'), 40);
const from = clean(params.get('from'), 40);
const question = clean(params.get('q'), 200);

const typed = $('#ask-typed');
const askSr = $('#ask-sr');
const askBar = $('#ask-bar');
const askResult = $('#ask-result');

if (to || from || question) {
  let line = 'Someone sent you this. On purpose.';
  if (to && from) line = `Hey ${to}, ${from} sent you this. On purpose.`;
  else if (to) line = `Hey ${to}, someone sent you this. On purpose.`;
  else if (from) line = `${from} sent you this. On purpose.`;

  $('#eyebrow-text').textContent = line;
  const dms = from ? `${from}’s DMs` : 'someone’s DMs';
  $('#hero-lede').textContent = question
    ? `You asked a human something your agent could’ve answered in four seconds. See that box? That’s your question, being typed into an agent. Instead of into ${dms}.`
    : 'You asked a human something your agent could’ve answered in four seconds. They love you. They also have shit to do.';
  if (to) document.title = `${to}, just fucking ask your agent`;
}

const examples = [
  'how do I make a pivot table',
  'rewrite this email so I don’t get fired',
  'is my eye twitching because I’m dying',
  'explain my lease like I’m five',
  'what can I cook with 2 eggs and a lemon',
  'what did my manager mean by “let’s take this offline”',
  'summarize this 40-page PDF I was supposed to read',
  'how do I tell my roommate to do the dishes without a war',
  'teach me enough Italian to not embarrass myself',
  'how do I exit vim'
];

async function typeInto(text, speed) {
  for (let i = 1; i <= text.length; i += 1) {
    typed.textContent = text.slice(0, i);
    await sleep(speed + Math.random() * speed);
  }
}

async function erase(speed) {
  for (let i = typed.textContent.length; i >= 0; i -= 1) {
    typed.textContent = typed.textContent.slice(0, i);
    await sleep(speed);
  }
}

const whenVisible = () => new Promise((resolve) => {
  if (document.visibilityState === 'visible') return resolve();
  const onChange = () => {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', onChange);
    resolve();
  };
  document.addEventListener('visibilitychange', onChange);
});

async function playQuestion() {
  askSr.textContent = `Your question, typed into an agent: ${question}`;
  if (reduceMotion) {
    typed.textContent = question;
  } else {
    typed.textContent = '';
    // Opened in a background tab? Save the show for when they're actually looking.
    await whenVisible();
    await sleep(900);
    await typeInto(question, 55);
    await sleep(500);
  }
  askBar.classList.add('sent');
  askResult.hidden = false;
}

async function cycleExamples() {
  askSr.textContent = `Example questions: ${examples.join('; ')}.`;
  if (reduceMotion) return;
  let index = 0;
  await sleep(2200);
  for (;;) {
    await erase(18);
    index = (index + 1) % examples.length;
    await sleep(250);
    await typeInto(examples[index], 32);
    await sleep(2200);
  }
}

if (question) playQuestion();
else cycleExamples();

/* ---------- Prompt picker ---------- */

const prompts = {
  email: 'Help me write an email to [who] about [the thing]. I want them to [the outcome I need]. Tone: [polite / firm / “per my last email”]. Under 120 words. No corporate filler, and don’t start with “I hope this email finds you well.” Here’s the context: [paste the thread or my notes].',
  meeting: 'Here are the notes / transcript from [meeting]. Give me: decisions made, who owns what, deadlines, and anything everyone agreed to but nobody wrote down. Flag anything vague. Then draft a five-line follow-up I can send so it looks like I was paying attention. [paste notes]',
  admin: 'Read this [lease / contract / bill / terms and conditions] and tell me in plain English: what I’m agreeing to, what it costs me (including the sneaky stuff), every deadline, and anything unusual or worth pushing back on. Quote the exact clause for anything important. [paste document]',
  health: 'Help me understand [my test results / what my doctor said / this diagnosis]. Explain it in plain language, what the numbers usually mean, and what I should ask at my next appointment. Context: [age, relevant history, meds]. Don’t diagnose me — tell me what’s worth raising with a doctor, and what would mean “go today.”',
  learn: 'Teach me [topic]. I currently know [nothing / the basics / just enough to be dangerous]. Explain it simply with one real-world example, then quiz me with three questions. Don’t give me the answers until I’ve tried. Tell me exactly what I got wrong. I have [20 minutes] a day.',
  advice: 'I need advice. Here’s what happened, honestly, including my part: [the story]. What I want: [outcome]. Give me a few options, the likely consequences of each, and a draft of what I could actually say. Be honest if I’m the asshole.',
  decide: 'Help me choose [a laptop / a vacuum / a gym / where to go on holiday]. Budget: [X]. Must-haves: [list]. Don’t care about: [list]. Compare three options, explain the trade-offs, link sources for anything factual, and tell me which one you’d pick for me and why.',
  cook: 'I have [ingredients], [30 minutes], and [a pan and hope]. Give me one recipe I can actually make, step by step, without “a pinch of saffron” I don’t own. Dietary stuff: [vegetarian / allergic to X / just tired].',
  bug: 'Help me fix this bug. Expected: [what should happen]. Actual: [what happens]. Here’s the full error: [paste it, not a cropped screenshot]. Reproduce it, find the cause, and make the smallest fix. Run the relevant checks. Show me what changed and anything you couldn’t verify.'
};

const task = $('#task');
const promptText = $('#prompt-text');
const copyButton = $('#copy-prompt');
const copyStatus = $('#copy-status');

copyButton.hidden = false;
task.addEventListener('change', () => {
  promptText.textContent = prompts[task.value];
  copyStatus.textContent = '';
});

copyButton.addEventListener('click', () => {
  copyText(promptText.textContent, copyStatus, 'Copied. Now paste it into your agent. Not into Slack. Not to Dave.', promptText);
});

/* ---------- Share builder ---------- */

const shareForm = $('#share-form');
const shareTo = $('#share-to');
const shareFrom = $('#share-from');
const shareQ = $('#share-q');
const shareLink = $('#share-link');
const sharePreview = $('#share-preview');
const shareStatus = $('#share-status');
const base = /^https?:$/.test(window.location.protocol)
  ? window.location.origin + window.location.pathname
  : 'https://justfuckingaskyouragent.com/';

function buildLink() {
  const out = new URLSearchParams();
  const t = clean(shareTo.value, 40);
  const f = clean(shareFrom.value, 40);
  const q = clean(shareQ.value, 200);
  if (t) out.set('to', t);
  if (f) out.set('from', f);
  if (q) out.set('q', q);
  const query = out.toString();
  return base + (query ? `?${query}` : '');
}

function updateLink() {
  const link = buildLink();
  shareLink.textContent = link;
  sharePreview.href = link;
  shareStatus.textContent = '';
}

shareForm.hidden = false;
updateLink();
shareForm.addEventListener('input', updateLink);
shareForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = clean(shareTo.value, 40);
  copyText(
    buildLink(),
    shareStatus,
    name ? `Copied. Send it to ${name}. Then mute ${name}.` : 'Copied. Go ruin someone’s day, productively.',
    shareLink
  );
});
