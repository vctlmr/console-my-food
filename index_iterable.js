#! /usr/bin/env node

// An iterable is an object that allows an iteration of himself
// An array is a built-in iterable but strings maps and sets are iterables too
// To be iterable it must implement the @@iterator method
// so the object must have a property with a symbol.iterator key


// example the for...of Loop is iterable
// the for...of loop only works with iterable object, it iterates over values
// the for...in loop is not the same, it iterates over enumerable properties

// for example
// a for..in loop iterate on the keys of an array
// YOU need to call next() one last time to get done = true

const arr = [1, 2, 3, 6, 9]
const it = arr[Symbol.iterator]()
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())
console.log(it.next())

const map = new Map()
map.set('key1', 'value1')
map.set('key2', 'value2')
const mapIterator = map[Symbol.iterator]()
console.log(mapIterator.next().value)
console.log(mapIterator.next().value)

for (const [key, value] of map) {
    console.log(`${key} and ${value}`)
}

const mySet = new Set()
mySet.add('uno')
mySet.add('dos')
const setIterator = mySet[Symbol.iterator]()
console.log(setIterator.next())
console.log(setIterator.next())

for (const value of mySet) {
    console.log(`${value}`)
}