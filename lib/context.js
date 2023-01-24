let context = {}

module.exports = {
  get: (k) => {  context[k] },
  set: (k, v) => { context[k] = v },
  clear: () => { context = {} },
  getAll: () => { context },
}