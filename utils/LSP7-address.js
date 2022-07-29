
const LSP7InfoObj = (url) => {
  //return ganache address if in development
  if (url.includes('localhost')) {
     return '0x8294cAc95d55350C6B417e0085AF20dCEf5B32ba'
  }
  return //l16 address
}

export default LSP7InfoObj;
