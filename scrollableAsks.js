import React, { useState, useEffect } from 'react'
import { Box, Text, StdinContext } from 'ink'
import figures from 'figures'

const globalState = {
  lastKey: null
}

function ScrollableAsks ({ height, stdin, setRawMode }) {
  const [updateTime, setUpdateTime] = useState()
  const [cursorIndex, setCursorIndex] = useState(0)

  const state = { cursorIndex }

  useEffect(() => {
    setRawMode(true)
    stdin.on('data', handler)
    return () => stdin.removeListener('data', handler)

    function handler (data) {
      if (data === '\u001b[A') {
        data = 'up'
        if (state.cursorIndex > 0) {
          setCursorIndex(state.cursorIndex - 1)
        }
      }
      if (data === '\u001b[B') {
        data = 'down ' + state.cursorIndex
        if (state.cursorIndex < height - 1) {
          setCursorIndex(state.cursorIndex + 1)
        }
      }
      if (data === '\u001b[D') {
        data = 'left'
      }
      if (data === '\u001b[C') {
        data = 'right'
      }
      if (data === '\r') {
        data = 'return'
      }
      globalState.lastKey = data
      setUpdateTime(Date.now())
    }
  }, [cursorIndex])

  const rows = []
  for (let i = 0; i < height; i++) {
    const pointer = (i === cursorIndex) ? figures.pointer : ' ' 
    rows.push(
      <Box>{pointer} Row {i + 1} of {height}{' '}
      LastKey {JSON.stringify(globalState.lastKey)}
      </Box>
    )
  }
  return (
    <Box flexDirection="column">
      {rows}
    </Box>
  )
}

export default function ScrollableAsksWithStdin ({ height }) {
  return (
    <StdinContext.Consumer>
      {({stdin, setRawMode}) => (
        <ScrollableAsks
          height={height}
          stdin={stdin}
          setRawMode={setRawMode} />
      )}
    </StdinContext.Consumer>
  )
}

