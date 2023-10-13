export const replaceNonAlphanumericWithHyphen = (string: string) => {
  // Use a regular expression to match any character that is not a letter or a number
  // and replace it with a hyphen
  return string.replace(/[^a-zA-Z0-9]/g, '-');
}