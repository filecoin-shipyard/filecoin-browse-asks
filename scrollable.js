import React, { useState, useEffect } from 'react'
import { Box, Text, StdinContext } from 'ink'
import figures from 'figures'

function Scrollable ({ height, render, onCursorScrollHandler }) {
  const [updateTime, setUpdateTime] = useState()
  const [cursorIndex, setCursorIndex] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [dataLength, setDataLength] = useState(0)

  useEffect(() => {
    onCursorScrollHandler({ setCursorAndScroll })

    function setCursorAndScroll (offset) {
      const newCursorIndex = cursorIndex + offset
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
  }, [height, scrollTop, cursorIndex, dataLength])

  return render({ height, scrollTop, cursorIndex, onDataLength: setDataLength })
}

function ScrollKeys ({ height, stdin, setRawMode, updateCursorAndScroll }) {
  useEffect(() => {
    setRawMode(true)
    stdin.on('data', handler)
    return () => stdin.removeListener('data', handler)

    function handler (data) {
      if (data === '\u001b[A') {
        updateCursorAndScroll(-1)
      }
      if (data === '\u001b[B') {
        updateCursorAndScroll(+1)
      }
      /*
      if (data === '\u001b[D') {
        data = 'left'
      }
      if (data === '\u001b[C') {
        data = 'right'
      }
      if (data === '\r') {
        data = 'return'
      }
      */
    }
  }, [updateCursorAndScroll])

  return null
}

export default function ScrollableWithStdin ({ height, render }) {
  const [cursorScrollHandler, setCursorScrollHandler] = useState()
  return (
    <>
      <Scrollable
        height={height}
        render={render}
        onCursorScrollHandler={setCursorScrollHandler} />
      <StdinContext.Consumer>
        {
          ({stdin, setRawMode}) => (
            <ScrollKeys
              stdin={stdin}
              setRawMode={setRawMode}
              updateCursorAndScroll={
                cursorScrollHandler ? cursorScrollHandler.setCursorAndScroll :
                  () => {}
              } />
          )
        }
      </StdinContext.Consumer>
    </>
  )
}

