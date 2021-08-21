const splitURL = (text) => {
  const match = text.match(/(?<protocol>(http|https))?(:\/\/)?(?:www\.)?(?<domain>[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6})\b(?<subpage>([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/)
  if (text.match(/[^\u0000-\u007f]/g)) {
    return false;
  }
  if (match && match.groups) {
    return match.groups;
  }
  return false;
}

module.exports = splitURL