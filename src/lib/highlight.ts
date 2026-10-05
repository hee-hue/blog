import { bundledLanguages, codeToHtml } from "shiki";

const ALIASES: Record<string, string> = { sh: "bash", shell: "bash", md: "markdown" };

/** 빌드/서버 시점에 라이트·다크 두 테마를 함께 생성한다. 색은 CSS 변수로 전환된다. */
export async function highlight(code: string, lang: string): Promise<string> {
  const l = ALIASES[lang] ?? lang;
  return codeToHtml(code, {
    lang: l in bundledLanguages ? l : "text",
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
  });
}
