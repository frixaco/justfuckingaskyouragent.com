const prompts = {
  bug: 'Help me fix this bug. Expected: [what should happen]. Actual: [what happens]. Reproduce it, find the cause, and make the smallest fix. Run the relevant checks. Show me what changed and anything you couldn’t verify.',
  code: 'Help me understand [this code or feature]. Trace how it works through the actual files. Explain the important decisions and point me to the relevant code. Separate what you can verify from what you’re inferring. Don’t change anything.',
  feature: 'Add [specific feature] to this project. Read the existing code and follow its patterns. Keep the change small and leave [things to preserve] alone. It’s done when [observable result]. Run the relevant checks and explain what changed.',
  research: 'Help me decide [specific question]. My constraints are [budget, time, requirements]. Check current primary sources, compare the relevant options, and link the evidence. Make a recommendation for my situation. Flag uncertainty instead of guessing.',
  admin: 'Turn [these notes or this document] into [the result I need]. Use only the information I provide. Keep [important details] intact. Flag anything missing instead of inventing it. Give me a draft to review before anything is sent.'
};

const task = document.querySelector('#task');
const promptText = document.querySelector('#prompt-text');
const copyButton = document.querySelector('#copy-prompt');
const status = document.querySelector('#copy-status');

copyButton.hidden = false;
task.addEventListener('change', () => {
  promptText.textContent = prompts[task.value];
  status.textContent = '';
});

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(promptText.textContent);
    status.textContent = 'Copied. Go give it an actual job.';
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(promptText);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = 'Clipboard blocked. The prompt is selected — copy it with ⌘C or Ctrl+C.';
  }
});
