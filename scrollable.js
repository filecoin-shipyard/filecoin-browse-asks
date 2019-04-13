import React, { useState, useEffect } from 'react'
import { Box, Text, StdinContext } from 'ink'
import figures from 'figures'

function Scrollable ({ height, render, onCursorScrollHandler }) {
  const [updateTime, setUpdateTime] = useState()
  const [cursorIndex, setCursorIndex] = useState(0)
  const [scrollTop, setScrollTop] = useState(0)
  const [dataLength, setDataLength] = useState(0)

  const contentHeight = height - 2
  const { columns } = process.stdout

  useEffect(() => {
    onCursorScrollHandler({ setCursorAndScroll })

    function setCursorAndScroll (offset) {
      const newCursorIndex = cursorIndex + offset
      if (newCursorIndex >= 0 && newCursorIndex <= dataLength - 1) {
        setCursorIndex(newCursorIndex)
        if (newCursorIndex < scrollTop) {
          setScrollTop(newCursorIndex)
        }
        if (newCursorIndex > scrollTop + contentHeight - 1) {
          setScrollTop(newCursorIndex - contentHeight + 1)
        }
        setUpdateTime(Date.now())
      }
    }
  }, [height, scrollTop, cursorIndex, dataLength])

  const paddingRows = []
  if (dataLength < contentHeight) {
    for (let i = 0; i < contentHeight - dataLength; i++) {
      paddingRows.push(<Box> </Box>)
    }
  }

  const border = '-'.repeat(columns)
  let topBorder = border
  if (scrollTop > 0) {
    const linesAbove = `${scrollTop}`
    topBorder = topBorder.slice(0,1) +
      figures.arrowUp +
      linesAbove +
      topBorder.slice(2 + linesAbove.length)
  }
  let bottomBorder = border
  if (scrollTop + contentHeight < dataLength) {
    const linesBelow = `${dataLength - contentHeight - scrollTop}`
    bottomBorder = bottomBorder.slice(0,1) +
      figures.arrowDown +
      linesBelow +
      bottomBorder.slice(2 + linesBelow.length)
  }

  return (
    <Box flexDirection="column" textWrap="truncate">
      <Box>{topBorder}</Box>
      {
        render({
          height: contentHeight,
          scrollTop,
          cursorIndex,
          onDataLength: setDataLength
        })
      }
      {paddingRows}
      <Box>{bottomBorder}</Box>
    </Box>
  )
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

