/**
 * 주어진 content 문자열에서 [[{{변수}}]] 형태의 placeholder를 찾아서
 * key-value 매핑에 따라 치환한 최종 문자열을 반환합니다.
 *
 * @param content 템플릿 content (ex: "branch = [[{{branchName}}]]")
 * @param data 치환할 값 (ex: { branchName: "feature-1" })
 * @returns 치환된 문자열 (ex: "branch = feature-1")
 */
export function replacePlaceholder(content: string, data: Record<string, string>): string {
  return content.replace(/\[\[\{\{(\w+)\}\}\]\]/g, (match, p1) => {
    // p1 = placeholder 이름 (ex: branchName)
    if (data[p1]) {
      return data[p1];
    }
    return match; // data에 해당 키가 없으면 원문 그대로 반환
  });
}

/**
 * content 안에 존재하는 모든 플레이스홀더 이름을 배열로 반환합니다.
 * @param content 템플릿 문자열
 * @returns 플레이스홀더 이름 배열
 */
export function extractPlaceholders(content: string): string[] {
  const regex = /\[\[\{\{(\w+)\}\}\]\]/g;
  const found = new Set<string>();
  let match;
  while ((match = regex.exec(content)) !== null) {
    found.add(match[1]);
  }
  return Array.from(found);
}
