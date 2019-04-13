import React, { useState, useEffect } from 'react'
import { Box, Text, StdinContext } from 'ink'
import figures from 'figures'
import BigNumber from 'bignumber.js'
import useFilecoinAsks from './useFilecoinAsks'

export default function Asks ({
  height,
  scrollTop,
  cursorIndex,
  onDataLength
}) {
  const [asks] = useFilecoinAsks()

  useEffect(() => onDataLength(asks ? asks.length : 0), [asks])

  const rows = []
  if (asks) {
    const sortedAsks = asks.sort((a, b) => BigNumber(a.price).comparedTo(b.price))
    for (let i = 0; i < sortedAsks.length; i++) {
      if (i >= scrollTop && i < scrollTop + height) {
        const ask = sortedAsks[i]
        const pointer = (i === cursorIndex) ? figures.pointer : ' '
        rows.push(
          <Box>
            {pointer} Row {i + 1} of {asks.length}{' '}{JSON.stringify(ask)}
          </Box>
        )
      }
    }
  }
  return <>{rows}</>
}

