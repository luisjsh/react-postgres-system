import React from 'react'
import styled from 'styled-components'

export const Page = styled.div`
    padding: 5em;
`

const Section = styled.section`
`

const SectionHeader = styled.div`
`

const Title = styled.h3`
    font-weight: bold;
    transition: 0.4s;
    margin: 0;

    ${Section}:hover & {
        color: #0E8FFF;
    }

    ${Section}:focus-within & {
        color: #0E8FFF;
    }   
`

const SectionBody = styled.div`
    display: grid;
    grid-template-columns: 2fr 2fr;
    grid-gap: 1em;
    padding: 1.5em;
`

export const SectionWithTitle =({title, children})=>{
    return (
        <Section>
            <SectionHeader>
                <Title>{title}</Title>
            </SectionHeader>
            <SectionBody>
                {children}
            </SectionBody>
        </Section>
    )
}

 const BirthDiv = styled.div`
`

 const BirthSection = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 2fr;
    grid-gap: 1em;
`

 const Label = styled.label`
    transition: .3s;

    ${BirthDiv}:hover & {
        color: black;
    }
    
    ${BirthDiv}:focus-within & {
        color: black;
    }
`

export const BirthSectionTitle = ({title, children})=>{
    return(
        <BirthDiv>
            <Label>
                {title}
            </Label>
            <BirthSection>
                {children}
            </BirthSection>
        </BirthDiv>
    )}
