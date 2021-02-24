#! /usr/bin/env node

// Why would we use Custom iterators ? 
// To have the behaviour we want on our iterations

// We need to define the Symbol.iterator function and the next method ourselves.

// We want to list food with specificity to find vegans products / diet products etc
// We need the user to have the ability to list few products

const { default: axios } = require("axios");

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'enter command > '
})

readline.prompt();
readline.on('line', async line => {
    switch(line) {
        case 'log': {
            const { data } = await axios.get(`http://localhost:3001/food`)
            const it = data[Symbol.iterator]()
            let actionIt

            const actionIterator = {
                [Symbol.iterator]() {
                    const positions = [...this.actions]
                    return {
                        [Symbol.iterator]() {
                            return this
                        },
                        next(...args) {
                            if (positions.length > 0) {
                                const position = positions.shift()
                                const result = position(...args)
                                return { value: result, done: false }
                            }
                            else {
                                return { done: true }
                            }
                        }
                    }
                },
                actions: [askForServingSize, displayCalories],
            }

            function askForServingSize(food) {
                readline.question(`How many servings did you eat ? (as a decimal: 1, 0.5, 1.25)`), servingSize => {
                    actionIt.next(servingSize, food)
                }
            }

            function displayCalories(servingSize, food) {
                const calories = food.calories
                console.log(`${food.name} with a serving of ${servingSize} has a ${Number.parseFloat(calories * parseInt(servingSize, 10),).toFixed()} calories`)
                actionIt.next()
                readline.prompt()
            }

            readline.question(`What would you like to log today ?`, async item => {
                console.log(item)
                let position = it.next()
                while(!position.done) {
                    const food = position.value.name
                    if ( food === item ) {
                        console.log(`${item} has a number of ${position.value.calories} calories`)
                        actionIt = actionIterator[Symbol.iterator]()
                        actionIt.next(position.value)
                    }
                    position = it.next()
                }
                readline.prompt()
            })
            break;
        }
        case 'list vegan foods': {
            axios.get(`http://localhost:3001/food`).then( ({data}) => {
                let idx = 0
                const veganOnly = data.filter( food => {
                    return food.dietary_preferences.includes('vegan')
                })
                const veganIterable = {
                    [Symbol.iterator]() {
                        return {
                            [Symbol.iterator]() {
                                return this 
                            },
                            next() {
                                const current = veganOnly[idx]
                                idx++
                                if (current)
                                    return { value: current, done: false }
                                else
                                    return { value: current, done: true }
                            }
                        }
                    }
                }
                for (let val of veganIterable) {
                    console.log(val.name)
                }
                readline.prompt()
            })
        }
            break;
        default: 
            break;

    }
})

