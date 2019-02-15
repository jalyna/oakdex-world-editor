import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

interface AppProps { }

function mapStateToProps ({ }: any) {
  return { }
}

function App ({ }: AppProps) {
  return 'hallo welt'
}

export default connect(
  mapStateToProps,
  (d: Dispatch) => { return {} },
)(App)
