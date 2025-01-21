// DOM 요소 타입 정의
const getInputElement = (id: string): HTMLInputElement => {
  const element = document.getElementById(id) as HTMLInputElement;
  if (!element) {
    throw new Error(`Element with ID '${id}' not found`);
  }
  return element;
};

// Save options to Chrome storage
const saveButton = document.getElementById('save');
if (saveButton) {
  saveButton.addEventListener('click', () => {
    const domain = getInputElement('domain').value.trim();
    const email = getInputElement('email').value.trim();
    const apiToken = getInputElement('apiToken').value.trim();

    if (!domain || !email || !apiToken) {
      alert('Please fill in all fields before saving.');
      return;
    }

    chrome.storage.sync.set({ domain, email, apiToken }, () => {
      console.log('Saved data:', { domain, email, apiToken });
      alert('Settings saved!');
    });
  });
}

// Clear stored settings
const clearButton = document.getElementById('clear');
if (clearButton) {
  clearButton.addEventListener('click', () => {
    chrome.storage.sync.clear(() => {
      console.log('Settings cleared');
      alert('Settings cleared!');
      // Clear input fields
      getInputElement('domain').value = '';
      getInputElement('email').value = '';
      getInputElement('apiToken').value = '';
    });
  });
}

// Load saved options when the page loads
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['domain', 'email', 'apiToken'], (data) => {
    console.log('Loaded settings:', data);

    // 입력 필드에 저장된 값 채우기
    getInputElement('domain').value = data.domain || '';
    getInputElement('email').value = data.email || '';
    getInputElement('apiToken').value = data.apiToken || '';
  });
});
