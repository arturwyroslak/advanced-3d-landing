import { describe, it, expect } from 'vitest'
import { clamp } from '../src/utils'

describe('utils', ()=>{
  it('clamps values within bounds', ()=>{
    expect(clamp(5,0,10)).toBe(5)
    expect(clamp(-3,0,10)).toBe(0)
    expect(clamp(12,0,10)).toBe(10)
  })
})
