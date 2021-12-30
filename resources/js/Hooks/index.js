import { useState, useEffect } from 'react'

export function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value)
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)
        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])
    return debouncedValue
}

export function useModalState(state = false) {
    const [isOpen, setIsOpen] = useState(state)
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    const [data, setData] = useState(null)

    return {
        isOpen,
        toggle, 
        setIsOpen,
        data,
        setData,
    }
}
