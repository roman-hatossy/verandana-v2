export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email) return { isValid: false, error: 'Email jest wymagany' }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) { return { isValid: false, error: 'Nieprawidłowy format email' } }
  return { isValid: true }
}
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone) return { isValid: false, error: 'Telefon jest wymagany' }
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  const phoneRegex = /^(?:\+48)?\d{9}$/
  if (!phoneRegex.test(cleanPhone)) { return { isValid: false, error: 'Podaj 9 cyfr' } }
  return { isValid: true }
}
export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 3) return cleaned
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`
  return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)}`
}
