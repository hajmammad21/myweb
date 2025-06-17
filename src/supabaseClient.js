// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gwrkhmrptvbkxaylakou.supabase.co' // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3cmtobXJwdHZia3hheWxha291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMjcyNzUsImV4cCI6MjA2NDgwMzI3NX0.2Ih68scLkmoDRqfn-9ENu5wP5VhBYW_obC9-NX00Uok' // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey)

// Authentication service functions
export const authService = {
  // Check if user exists by phone number
  async checkUserExists(phone) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw error
    }
    
    return data
  },

  // Create new user
  async createUser(userData) {
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name: userData.name,
          phone: userData.phone,
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update user's last login
  async updateLastLogin(userId) {
    const { data, error } = await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Store verification code (optional - for security you might want to store hashed codes)
  async storeVerificationCode(phone, code) {
    const { data, error } = await supabase
      .from('verification_codes')
      .upsert([
        {
          phone: phone,
          code: code,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString() // 5 minutes expiry
        }
      ])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Verify code
  async verifyCode(phone, code) {
    const { data, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .gt('expires_at', new Date().toISOString())
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return !!data
  },

  // Clean up expired verification codes
  async cleanupExpiredCodes() {
    const { error } = await supabase
      .from('verification_codes')
      .delete()
      .lt('expires_at', new Date().toISOString())
    
    if (error) throw error
  }
}