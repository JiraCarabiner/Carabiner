/**
 * Auto-fill the pull request title and description with the default template
 * @returns void
 */
export const autoFillPullRequest = async () => {
  /** 1. Compare branch name from the URL */
  // 1.1 Get the branch name from the URL
  const urlMatch = window.location.pathname.match(/\/compare\/(.+)/);
  console.log('urlMatch: ', urlMatch);
  const branchName = urlMatch ? urlMatch[1] : '';

  /** 2. Select PR title/description fields */
  const titleInput = document.querySelector<HTMLInputElement>('#pull_request_title');
  const descriptionTextarea = document.querySelector<HTMLTextAreaElement>('#pull_request_body');
  if (!titleInput || !descriptionTextarea) {
    console.error('Title or description fields not found');
    return;
  }

  /** 3. Fetch defult template from chrome.storage */
  // 3.1 Get the templates from the storage
  const { defaultTemplateId } = await chrome.storage.sync.get('defaultTemplateId');
  const { templates } = await chrome.storage.sync.get('templates');
  // 3.2 Get the template by the defaultTemplateId
  const defaultTemplate = templates.find((tpl: any) => tpl.id === defaultTemplateId);
  if (!defaultTemplate) {
    console.error('Default template not found');
    return;
  }

  /** 4. Fill the fields with the template */
  // 4.1 Fill the title with the branch name
  titleInput.value = `${defaultTemplate.title} (${branchName})`;
  // 4.2 Fill the description with the template
  descriptionTextarea.value = defaultTemplate.content;

  // 4.3 Dispatch the input event to trigger the character count
  titleInput.dispatchEvent(new Event('input', { bubbles: true }));
  descriptionTextarea.dispatchEvent(new Event('input', { bubbles: true }));

  console.log('Pull request auto-fill completed');
};
