function wait(time = 1) {
  return new Promise(res => {
    setTimeout(() => {
      return res();
    }, time * 1000);
  });
}

module.exports = { wait };
