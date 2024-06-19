'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'

import { Box } from '@chakra-ui/react'


export default function MdBox() {
  const searchParams = useSearchParams()
  const chapter = parseInt(searchParams.get('chapter')) || 0
  const step = parseInt(searchParams.get('step')) || 0
  const [md, setMd] = useState("Loading...")

  useEffect(() => {
    import(`@/markdown/chapter_${chapter}_step_${step}.mdx`).then(module => {
      setMd(module.default)
    }).catch(err => {
      setMd(undefined)
    })
  }, [chapter, step])  // Add chapter and step as dependencies

  return (
    <Box
      className='md'
      flex={5}
      padding={"20px"}
      height={"100%"}
      overflow={"scroll"}
    >
      {
        md ? md : "404 not found"
      }
    </Box>
  )
}
