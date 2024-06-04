import { GoogleLogin } from "./components/GoogleLogin"

import { RegisterBodySchema } from "@scr4m/common"

RegisterBodySchema.parse({ token: '' })

function App() {
  return (
    <>
      <GoogleLogin />
    </>
  )
}

export default App
