import React, { useState, useEffect } from 'react'
import { Box, Text, StdinContext } from 'ink'
import figures from 'figures'
import Asks from './asks'

function ScrollableAsks ({ height, stdin, setRawMode }) {
  const [updateTime, setUpdateTime] = useState()
  const [cursorIndex, setCursorIndex] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [dataLength, setDataLength] = useState(0)

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
  }, [cursorIndex, scrollTop, dataLength])

  return (
    <Asks
      height={height}
      scrollTop={scrollTop}
      cursorIndex={cursorIndex}
      onDataLength={setDataLength} />
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

