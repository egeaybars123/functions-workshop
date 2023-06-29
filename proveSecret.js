const walletAddress = args[0]
const inputHash = args[1]

const stringToHex = (str) => {
  let hex = ""
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i)
    const hexValue = charCode.toString(16)
    hex += hexValue.padStart(2, "0")
  }
  return hex
}

const hexSecret = stringToHex(secrets[0].secretWord)

const addressWithSecret = walletAddress + hexSecret

const alchemyKeccakRequest = Functions.makeHttpRequest({
  url: secrets[1].alchemyApi,
  method: "POST",
  data: {
    jsonrpc: "2.0",
    id: 1,
    method: "web3_sha3",
    params: [addressWithSecret],
  },
})

const [alchemyKeccakResponse] = await Promise.all([alchemyKeccakRequest])

const resultHash = alchemyKeccakResponse.result

if (resultHash === inputHash) {
  console.log("Address knows the secret")
  return Functions.encodeUint256(1)
} else {
  console.log("Address does not know the secret")
  return Functions.encodeUint256(0)
}
