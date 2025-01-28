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

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['templates'], (data) => {
    if (!data.templates) {
      const defaultTemplates = [
        {
          id: 'default-en',
          title: 'Default English Template',
          content: `---
title: "[JIRA-789] A Detailed Pull Request Template"
---

# Related Jira Issue
- **Issue**: [JIRA-789](https://your-jira-site.atlassian.net/browse/JIRA-789)

## Description
- **What changed?**  
  Summarize the main changes, new features, or bug fixes introduced by this PR.
- **Why?**  
  Explain the context or the motivation behind these changes.

## Implementation Details
- **Technical Approach**  
  - Outline the design approach, patterns used, or major refactoring decisions.
  - Mention any libraries or dependencies added/removed.

- **Data/Schema Changes**  
  - If the database schema or significant data structures changed, describe them here.

## Tests
- **Manual Testing**  
  - Steps to reproduce or verify the behavior locally.
- **Automated Testing**  
  - Any new/updated unit tests, integration tests, etc.

## Impact & Rollback Plan
- **Backward Compatibility**  
  - Does this PR introduce a breaking change?
- **Rollback Procedure**  
  - If something goes wrong, how do we revert safely?

## Checklist
- [ ] Jira ticket updated with relevant information
- [ ] Tests added or updated
- [ ] Documentation updated (if needed)
- [ ] Code reviewed by at least one peer
- [ ] No ESLint/TypeScript errors

## Additional Notes
- Include links to related PRs, design docs, or Slack discussions if any.
`,
        },
        {
          id: 'default-ko',
          title: '기본 한국어 템플릿',
          content: `---
title: "[PROJECT-456] 상세 PR 제목"
---

## Jira 이슈 링크
- **Jira**: [PROJECT-456](https://your-jira-site.atlassian.net/browse/PROJECT-456)

## 작업 내용
1. 어떤 문제(이슈)가 있었는지
2. 어떤 부분을 어떻게 해결했는지
3. 추가적으로 고려해야 할 사항이 있는지

## 스크린샷 (선택)
| 변경 전 | 변경 후 |
| --- | --- |
| (변경 전 UI 스크린샷) | (변경 후 UI 스크린샷) |

## 테스트 방법
- [ ] 유닛 테스트 (테스트 코드)
- [ ] 통합 테스트 (API, DB 연동 등)
- [ ] 수동 테스트 (수작업 검증)

## 체크리스트
- [ ] 코드가 정상 컴파일/빌드됨
- [ ] ESLint/Prettier 등 린팅/포매팅 오류 없음
- [ ] Jira 티켓에 작업 내용과 로그가 기록되었음
- [ ] 리뷰어가 알아야 할 추가 사항(배포 방법, 롤백 방법 등)이 있으면 명시

## 기타 참고 사항
- 필요한 경우 팀원에게 공유할 문서나 링크를 추가.
`,
        },
      ];
      chrome.storage.sync.set({ templates: defaultTemplates, defaultTemplateId: 'default-en' });
    }
  });
});
