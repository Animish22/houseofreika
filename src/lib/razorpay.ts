import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export const formatAmountForRazorpay = (amount: number) => {
  return Math.round(amount * 100) // Razorpay expects amount in paise
}
