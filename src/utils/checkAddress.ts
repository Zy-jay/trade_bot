export function checkAddress(address?: string) {
  if (!address || address.length !== 42 || address.substring(0, 2) !== "0x") {
    return false
  } else {
    return true
  }
}
