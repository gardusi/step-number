import { BigInteger } from 'big-integer'
import * as bigInt from 'big-integer'
import * as fs from 'fs'

const multiplyDigits = (number: BigInteger): BigInteger => {
  // Creates a base 10 digits array
  const array = number.toArray(10).value

  // Multiplies all the digits
  return array.reduce((acc, curr) => bigInt(acc).multiply(curr), bigInt(1))
}

const cycleNumber = async (number: BigInteger, steps: number = 0): Promise<number> => {
  // If number is less than 10, we reached the end
  if (number.lesser(10)) return steps
  return await cycleNumber(multiplyDigits(number), steps + 1)
}

const getNextNumber = (number: BigInteger): BigInteger => {

  const digits = number.plus(1).toArray(10).value

  // Jumps all the zeroes
  const noZeroes = digits.map((digit) => {
    if (digit == 0) {
      return 1
    }
    return digit
  })

  // Strips known future one-steps (multiply to zero)
  while (true) {
    const evenIndex = noZeroes.findIndex(n => n % 2 === 0)
    const fiveIndex = noZeroes.indexOf(5)
    if (evenIndex === -1 || fiveIndex === -1) {
      break;
    } else if (evenIndex > fiveIndex) {
      noZeroes[evenIndex] = noZeroes[evenIndex] + 1
    } else {
      noZeroes[fiveIndex] = 6
    }
  }
  
  return bigInt(noZeroes.join(''))
}

const searchResults = async (start: BigInteger, end: BigInteger): Promise<void> => {
  // Starts with zero
  let number = start

  // Very very very long iterator
  while (number.lesserOrEquals(end)) {

    // Synchronously receives results
    const steps = await cycleNumber(number)

    // Registers the truly important steps
    if (steps >= 10) {
      const message = `${number.toString()}: ${steps} steps`
      fs.appendFileSync(`solutions.log`, `${message}\n`)
      console.log(message)
    }

    // Prepares next number
    number = getNextNumber(number)
  }
}

// Clears the previous log
fs.writeFileSync(`solutions.log`, '')

Promise.all([
  searchResults(bigInt(), bigInt("1111111111111111")),
  searchResults(bigInt("1111111111111112"), bigInt("2111111111111111")),
  searchResults(bigInt("2111111111111112"), bigInt("3111111111111111")),
  searchResults(bigInt("3111111111111112"), bigInt("4111111111111111")),
  searchResults(bigInt("4111111111111112"), bigInt("5111111111111111")),
  searchResults(bigInt("5111111111111112"), bigInt("6111111111111111")),
  searchResults(bigInt("6111111111111112"), bigInt("7111111111111111")),
  searchResults(bigInt("7111111111111112"), bigInt("8111111111111111")),
  searchResults(bigInt("8111111111111112"), bigInt("9111111111111111")),
  searchResults(bigInt("9111111111111112"), bigInt("9999999999999999"))
])
