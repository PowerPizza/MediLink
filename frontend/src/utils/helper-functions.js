export const createVerificationCode = () => {
    return `${String(Math.floor(Math.random()*1000)).padStart(3, '0')}-${String(Math.floor(Math.random()*1000)).padStart(3, 0)}`
}
