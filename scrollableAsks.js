import React, { useState, useEffect } from 'react'
import { Box, Text } from 'ink'

export default function ScrollableAsks ({ height }) {
  const rows = []
  for (let i = 0; i < height; i++) {
    rows.push(<Box>Row {i + 1} of {height}</Box>)
  }
  return (
    <Box flexDirection="column">
      {rows}
    </Box>
  )
}

