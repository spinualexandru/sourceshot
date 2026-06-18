import { type CodeLanguage, type SyntaxLanguage } from "./code-options.ts";

export function detectCodeLanguage(code: string): SyntaxLanguage {
  const trimmedCode = code.trim();
  const hasTypeScriptSignals =
    /\b(?:interface|type|enum)\s+\w+/.test(trimmedCode) ||
    /\bimport\s+type\b/.test(trimmedCode) ||
    /:\s*[A-Z_a-z][\w<>{}[\], |]*(?:[,)=;]|=>)/.test(trimmedCode) ||
    /\b(?:as\s+const|satisfies\s+\w)/.test(trimmedCode);

  if (!trimmedCode) {
    return "typescript";
  }

  if (/^[{[]/.test(trimmedCode)) {
    try {
      JSON.parse(trimmedCode);
      return "json";
    } catch {
      // Continue with syntax heuristics.
    }
  }

  if (
    /^<!doctype\s+html\b/i.test(trimmedCode) ||
    /(?:^|[\s>])<\/?[a-z][\w:-]*(?:\s[^<>]*|\/?)>/i.test(trimmedCode)
  ) {
    const hasJsxSignals =
      /\b(?:className|on[A-Z]\w*|use[A-Z]\w*)=/.test(trimmedCode) ||
      /<[A-Z][\w.]*[\s>/]/.test(trimmedCode) ||
      /<[^>]+>[\s\S]*\{[\s\S]*\}[\s\S]*<\/[^>]+>/.test(trimmedCode);
    if (hasJsxSignals) {
      return hasTypeScriptSignals ? "tsx" : "jsx";
    }

    return "html";
  }

  if (/^(?:#|\s*[-*]\s|\s*\d+\.\s|>|\|)/m.test(trimmedCode) || /```[\s\S]*```/.test(trimmedCode)) {
    return "markdown";
  }

  if (/\bpackage\s+main\b/.test(trimmedCode) || /\bfunc\s+\w+\s*\(/.test(trimmedCode)) {
    return "go";
  }

  if (/\bfn\s+\w+\s*\(|\blet\s+mut\b|\bimpl\s+\w+|\btrait\s+\w+|println!\s*\(/.test(trimmedCode)) {
    return "rust";
  }

  if (
    /^\s*(?:from\s+\w[\w.]*\s+import\s+|import\s+\w|def\s+\w+\s*\(|class\s+\w+\s*[:(])/m.test(
      trimmedCode,
    ) ||
    /\bprint\s*\(|^\s*(?:if|for|while|with|try|except|elif)\b.*:\s*$/m.test(trimmedCode)
  ) {
    return "python";
  }

  if (
    /(?:^|[{};])\s*(?:[.#][\w-]+|\w[\w-]*|\*)[\w\s.#:[\],>+~-]*\{\s*[\w-]+\s*:/.test(trimmedCode) ||
    /@(media|supports|container|keyframes)\b/.test(trimmedCode)
  ) {
    return "css";
  }

  if (/<[A-Z_a-z][\w.:-]*(?:\s[^>]*)?>[\s\S]*<\/[A-Z_a-z][\w.:-]*>/.test(trimmedCode)) {
    return hasTypeScriptSignals ? "tsx" : "jsx";
  }

  if (hasTypeScriptSignals) {
    return "typescript";
  }

  if (/\b(?:const|let|var|function|import|export|class)\b/.test(trimmedCode)) {
    return "javascript";
  }

  return "typescript";
}

export function resolveCodeLanguage(code: string, language: CodeLanguage): SyntaxLanguage {
  return language === "auto" ? detectCodeLanguage(code) : language;
}
