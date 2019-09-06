#!/usr/bin/env node

import meow from 'meow'
import React, { useState, useEffect } from 'react'
import { render, Box, Color } from 'ink'
import useFilecoinConfig from '@filecoin-shipyard/use-filecoin-config'
import useFilecoinHead from '@filecoin-shipyard/use-filecoin-head'
import useFilecoinNetworkInfo from '@filecoin-shipyard/use-filecoin-network-info'
import useFilecoinAsks from '@jimpick/use-filecoin-asks'
import InkWatchForExitKey from '@jimpick/ink-watch-for-exit-key'
import Scrollable from './scrollable'
import Asks from './asks'

const cli = meow(
  `
    Usage
      $ filecoin-browse-asks [options]
  `,
  {
    flags: {
    }
  }
)

const args = cli.flags

const Main = () => {
  const [, nickname] = useFilecoinConfig('heartbeat.nickname')
  const [, , height, updateTime] = useFilecoinHead({
    interval: 5000
  })
  const [, netName, , netHeight] = useFilecoinNetworkInfo({
    interval: 30000
  })
  const [unfilteredAsks] = useFilecoinAsks()
  const asks = unfilteredAsks &&
    unfilteredAsks.filter(ask => ask.expiry > height)

  const { columns, rows } = process.stdout

  if (!updateTime) {
    return <Box>Loading...</Box>
  }

  const seconds = (
    <Box>
      ({Math.floor((Date.now() - updateTime) / 1000)}s ago)
    </Box>
  )

  const netInfo = (
    <Box>
      {netName}: {netHeight >= 0 ? netHeight : 'Loading...'}
    </Box>
  )

  const content = <Scrollable
    height={rows - 3}
    dataLength={asks && asks.length}
    render={
      ({ height, scrollTop, cursorIndex }) => {
        return (
          <Asks
            asks={asks}
            height={height}
            scrollTop={scrollTop}
            cursorIndex={cursorIndex} />
        )
      }
    } />

  return (
    <Box flexDirection="column" width={columns} height={rows - 1}>
      <Box>
        <Box flexGrow={1}>
          <Color green>Filecoin Browse Asks</Color>
        </Box>
        <Box>
          {asks && `${asks.length} asks`}
        </Box>
      </Box>
      {content}
      <Box>
        <Box>
          {nickname && nickname + ' '}
        </Box>
        <Box flexGrow={1}>
          {height} {seconds}
        </Box>
        <Box>
          <Box>{netInfo}</Box>
        </Box>
      </Box>
      <InkWatchForExitKey />
    </Box>
  )
}

async function run () {
  const { rerender, waitUntilExit } = render(<Main/>)

  process.on('SIGWINCH', () => rerender(<Main/>))

  try {
    await waitUntilExit()
    process.exit(0)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

run()
