import { GoogleLogin } from "./components/GoogleLogin"

import { RegisterBodySchema } from "@scr4m/common"


function App() {
  console.log(RegisterBodySchema.parse({ token: '' }))
  return (
    <>
      <GoogleLogin />
    </>
  )
}

export default App
