import React, { useState, useEffect } from 'react'
import Filecoin from 'filecoin-api-client'

const fc = Filecoin()

export default function useFilecoinAsks () {
  const [asks, setAsks] = useState()

  useEffect(() => {
    async function doWork () {
      const asks = []
      for await (const ask of fc.client.listAsks()) {
        asks.push(ask)
      }
      setAsks(asks)
    }
    doWork()
  }, true)

  return [asks]
}
