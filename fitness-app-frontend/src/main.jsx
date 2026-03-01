import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import {store} from './store/store'
import { Provider } from 'react-redux'
import { authConfig } from './authConfig'
import { AuthProvider } from 'react-oauth2-code-pkce'

const root = createRoot(document.getElementById('root'))

root.render(
  <AuthProvider authConfig={authConfig}
               loadingComponent={<div>loading....</div>}>
      <Provider store={store}>
        <App />
      </Provider>
  </AuthProvider>,
)

export default App