const form = document.getElementById('message-form');
const nameInput = document.getElementById('name-input');
const messageInput = document.getElementById('message-input');
const messagesDiv = document.getElementById('messages');

// ---------- LOAD EXISTING MESSAGES ----------
async function loadMessages() {
  const res = await fetch('/api/messages');
  const messages = await res.json();
  renderMessages(messages);
}

function renderMessages(messages) {
  messagesDiv.innerHTML = '';

  if (messages.length === 0) {
    messagesDiv.innerHTML = '<p>No messages yet. Be the first!</p>';
    return;
  }

  messages.forEach((entry) => {
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `
      <div class="entry-header">
        <strong>${escapeHtml(entry.name)}</strong>
        <span>${entry.date}</span>
      </div>
      <p>${escapeHtml(entry.message)}</p>
    `;
    messagesDiv.appendChild(div);
  });
}

// ---------- SUBMIT NEW MESSAGE ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const message = messageInput.value.trim();

  const res = await fetch('/api/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, message })
  });

  if (res.ok) {
    form.reset();
    loadMessages(); // refresh the list to show the new entry
  }
});

// Prevents raw HTML in a name/message from being rendered as markup (XSS prevention)
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---------- INITIAL LOAD ----------
loadMessages();