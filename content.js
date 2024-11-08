function createShareButton() {
const button = document.createElement('button');
button.className = `share-button inline-flex items-center justify-center relative shrink-0 ring-offset-2 ring-offset-bg-300 ring-accent-main-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none text-text-200 border-transparent transition-colors font-styrene active:bg-bg-400 hover:bg-bg-500/40 hover:text-text-100 h-8 w-8 rounded-md active:scale-95 !rounded-lg`;
button.innerHTML = `
    <svg class="share-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
`;

button.addEventListener('click', generateAndDownloadHTML);
return button;
}

function extractMessages() {
    const messages = [];
    
    // Find all message containers
    const userMessages = document.getElementsByClassName('font-user-message');
    if (userMessages.length > 0) {
        userMessages[userMessages.length - 1].remove();
    }

    const claudeMessages = document.getElementsByClassName('font-claude-message');
    
    // Convert HTMLCollections to Arrays for easier processing
    const userArray = Array.from(userMessages);
    const claudeArray = Array.from(claudeMessages);
    
    // Combine all messages and sort them by their position in the DOM
    const allMessages = [...userArray, ...claudeArray].sort((a, b) => {
      return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    });
    
    allMessages.forEach(element => {
      const isHuman = element.classList.contains('font-user-message');
      const content = element.textContent.trim();
      
      if (content) {
        messages.push({
          role: isHuman ? 'human' : 'assistant',
          content: content
        });
      }
    });
    
    return messages;
  }

function generateHTML(messages) {
const template = `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Claude Chat Conversation</title>
    <meta charset="UTF-8">
    <style>
        body {
        font-family: system-ui, -apple-system, sans-serif;
        line-height: 1.5;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background: #f9fafb;
        }
        .message {
        margin: 20px 0;
        padding: 15px;
        border-radius: 8px;
        }
        .human {
        background: #e5e7eb;
        }
        .assistant {
        background: #dbeafe;
        }
        .role {
        font-weight: bold;
        margin-bottom: 8px;
        }
    </style>
    </head>
    <body>
    ${messages.map(msg => `
        <div class="message ${msg.role}">
        <div class="role">${msg.role === 'human' ? 'Human' : 'Claude'}</div>
        <div class="content">${msg.content}</div>
        </div>
    `).join('')}
    </body>
    </html>
`;

return template;
}

function generateAndDownloadHTML() {
const messages = extractMessages();
const html = generateHTML(messages);
const chatId = window.location.href.split('/').pop()

const blob = new Blob([html], { type: 'text/html' });
const url = URL.createObjectURL(blob);

const a = document.createElement('a');
a.href = url;
a.download = 'claude-chat.html';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}

// Wait for the chat input box to be present
function init() {
const targetNode = document.body;
const config = { childList: true, subtree: true };

const callback = function(mutationsList, observer) {
    const screenshotButton = document.querySelector('button[aria-label="Capture screenshot"]');
    if (screenshotButton && !document.querySelector('.share-button')) {
        const shareButton = createShareButton();
        screenshotButton.parentNode.insertBefore(shareButton, screenshotButton.nextSibling);
    }
};

const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
}
init();