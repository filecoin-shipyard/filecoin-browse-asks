import React from 'react'
import { Box } from 'ink'
import figures from 'figures'
import BigNumber from 'bignumber.js'

export default function Asks ({
  height,
  scrollTop,
  cursorIndex,
  asks
}) {
  const rows = []
  if (asks) {
    const sortedAsks = asks.sort((a, b) => BigNumber(a.price).comparedTo(b.price))
    for (let i = 0; i < sortedAsks.length; i++) {
      if (i >= scrollTop && i < scrollTop + height) {
        const ask = sortedAsks[i]
        const pointer = (i === cursorIndex) ? figures.pointer : ' '
        rows.push(
          <Box textWrap="truncate">
            {pointer} {`${i + 1}`.padStart(3)} {ask.miner}{' '}
            {`${ask.id}`.padEnd(2)}{' '}
            {`${ask.price}`.padEnd(22)}{' '}
            {ask.expiry}
          </Box>
        )
      }
    }
  }
  return <>{rows}</>
}

