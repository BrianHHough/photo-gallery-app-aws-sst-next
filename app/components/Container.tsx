"use client"
import React from 'react'
import Gallery from './Gallery'
import styled from "@emotion/styled"
import { StyledContainer } from './ContainerElements'


const Container = () => {
  return (
    <StyledContainer>
        <h1>Photo Gallery</h1>
        <Gallery/>
    </StyledContainer>
  )
}

export default Container