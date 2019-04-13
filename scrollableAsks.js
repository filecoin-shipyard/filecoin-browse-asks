import React, { useState, useEffect } from 'react'
import { Box, Text, StdinContext } from 'ink'
import figures from 'figures'

function ScrollableAsks ({ height, stdin, setRawMode }) {
  const [updateTime, setUpdateTime] = useState()
  const [cursorIndex, setCursorIndex] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)

  const dataLength = 100

  useEffect(() => {
    setRawMode(true)
    stdin.on('data', handler)
    return () => stdin.removeListener('data', handler)

    function handler (data) {
      if (data === '\u001b[A') {
        setCursorAndScroll(cursorIndex - 1)
      }
      if (data === '\u001b[B') {
        setCursorAndScroll(cursorIndex + 1)
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
    }

    function setCursorAndScroll (newCursorIndex) {
      if (newCursorIndex >= 0 && newCursorIndex <= dataLength - 1) {
        setCursorIndex(newCursorIndex)
        if (newCursorIndex < scrollTop) {
          setScrollTop(newCursorIndex)
        }
        if (newCursorIndex > scrollTop + height - 1) {
          setScrollTop(newCursorIndex - height + 1)
        }
        setUpdateTime(Date.now())
      }
    }
  }, [cursorIndex, scrollTop])

  const rows = []
  for (let i = 0; i < dataLength; i++) {
    if (i >= scrollTop && i < scrollTop + height) {
      const pointer = (i === cursorIndex) ? figures.pointer : ' '
      rows.push(
        <Box>{pointer} Row {i + 1} of {dataLength}{' '}
        </Box>
      )
    }
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

