// request.mjs
import axios from 'axios'

async function registerUser() {
  try {
    const response = await axios.post('https://auth.mizu.work/register')
    console.log('Response:', response.data)
  } catch (error) {
    console.error(
      'Error:',
      error.response ? error.response.data : error.message
    )
  }
}

// Call the function
registerUser()
