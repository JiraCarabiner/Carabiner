chrome.runtime.onMessage.addListener((message: any, sender, sendResponse: (response: any) => void) => {
  console.log('Message received:', message);

  if (message.action === 'fetchJiraData') {
    const jql = message.jql;
    const githubLink = message.githubLink; // content에서 보내준 GitHub 링크
    console.log(`GitHub Link: ${githubLink}`);
    console.log(`JQL: ${jql}`);

    chrome.storage.sync.get(['apiToken', 'email', 'mappings'], async (data) => {
      console.log('Storage data retrieved:', data);

      const { apiToken, email, mappings } = data;
      if (!apiToken || !email || !mappings) {
        console.error('Missing storage data');
        sendResponse({ error: 'API token, email, 또는 매핑 정보가 저장되어 있지 않습니다.' });
        return;
      }

      // 저장된 매핑 중 GitHub 링크와 일치하는 도메인 찾기
      const mapping = (mappings as Array<{ github: string; jira: string }>).find((m) => githubLink.includes(m.github));

      if (!mapping) {
        console.error('No matching mapping found');
        sendResponse({ error: '현재 페이지의 GitHub 도메인과 일치하는 매핑이 없습니다.' });
        return;
      }

      // 찾은 매핑의 Jira 도메인 사용
      const jiraDomain = mapping.jira;
      const url = `https://${jiraDomain}/rest/api/3/search`;
      const params = new URLSearchParams({
        jql,
        fields: 'summary,assignee,status',
        maxResults: '50',
      });

      try {
        console.log(`Fetching URL: ${url}?${params.toString()}`);
        const response = await fetch(`${url}?${params.toString()}`, {
          method: 'GET',
          headers: {
            Authorization: `Basic ${btoa(`${email}:${apiToken}`)}`,
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`);
        }

        const responseData = await response.json();
        console.log('API Response:', responseData);
        sendResponse(responseData);
      } catch (error) {
        console.error('Error fetching API data:', error);
        sendResponse({ error: (error as Error).message });
      }
    });

    return true; // 비동기 응답을 위해 true 반환
  }
});
