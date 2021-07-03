const logTime = (name) => {
  console.log(`log...${name}  ` + new Date().toLocaleDateString());
}

exports.callback = () => {
  setTimeout(() => {
    logTime('callback 1')
    setTimeout(() => {
      logTime('callback 2')
    }, 100)
  }, 100)
}

const promise = (name, delay = 100) => new Promise(resolve => {
  setTimeout(() => {
    logTime(name)
    resolve()
  }, delay);
})

exports.promise = () => {
  promise('Promise 1')
    .then(promise('Promise 2'))
    .then(promise('Promise 3'))
}

exports.generator = () => {
  const generator = function* (name) {
    yield promise(name + 1)
    yield promise(name + 2)
    yield promise(name + 3)
  }
  let co = generator => {
    if (it = generator.next().value) {
      it.then(res => {
        co(generator)
      })
    } else {
      return
    }
  }
  co(generator('Co-Generator'))
}

exports.asyncAwait = async () => {
  await promise('Async/Await 1')
  await promise('Async/Await 2')
  await promise('Async/Await 3')
  await promise('Async/Await 4')
}

exports.event = async () => {
  const asyncFun = name => event => {
    setTimeout(() => {
      logTime(name)
      event.emit('end')
    }, 100);
    return event
  }
  const ary = [
    asyncFun('event 1'),
    asyncFun('event 2'),
    asyncFun('event 3')
  ]

  const { EventEmitter } = require('events')
  const event = new EventEmitter()
  let i = 0
  event.on('end', () => i < ary.length && ary[i++](event))
  event.emit('end')
}