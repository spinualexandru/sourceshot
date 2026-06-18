const html = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((result, string, i) => result + string + (values[i] ?? ""), "");
const ts = (strings: TemplateStringsArray, ...values: any[]) =>
  strings.reduce((result, string, i) => result + string + (values[i] ?? ""), "");

export { ts };
export default html;
