import React, { useState, useEffect } from 'react'
import { Box, Text, StdinContext } from 'ink'
import figures from 'figures'

export default function Asks ({
  height,
  scrollTop,
  cursorIndex,
  onDataLength
}) {
  const dataLength = 100

  useEffect(() => onDataLength(dataLength), true)

  const rows = []
  for (let i = 0; i < dataLength; i++) {
    if (i >= scrollTop && i < scrollTop + height) {
      const pointer = (i === cursorIndex) ? figures.pointer : ' '
      rows.push(
        <Box>
          {pointer} Row {i + 1} of {dataLength}{' '}
        </Box>
      )
    }
  }
  return <>{rows}</>
}

