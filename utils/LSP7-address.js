
const LSP7InfoObj = (url) => {
  //return ganache address if in development
  if (url.includes('localhost')) {
     return '0x6B385CBd303100C1575f82c514fB3E7353544d3d'
  }
  return //l16 address
}

export default LSP7InfoObj;
