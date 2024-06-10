/** Replaces occurences of `<key>@</key>` with `value`. Call recursively
    e.g. `applyNeonTemplate(applyNeonTemplate(d, {"pass": "a"}), {"code": "4"})`
*/
export function applyNeonTemplate(
  templateURL: string,
  args: { key: string; value: string },
): string {
  return templateURL.replaceAll(`<${args.key}>@<${args.key}`, args.value);
}
