import {processBlock, toMilliseconds, toTimeCode} from '../offset.js'

describe('offset', () => {
  describe('toMilliseconds', () => {
    it.each`
    timecode | amount
    ${'00:00:05,070'} | ${5070}
    ${'00:01:05,070'} | ${65070}
    ${'01:01:05,070'} | ${3665070}
    `('should convert $timecode to $amount ms', ({timecode, amount}) => {
      expect(toMilliseconds(timecode)).toEqual(amount)
    });
  });

  describe('toTimeCode', () => {
    it.each`
    timecode | amount
    ${'00:00:05,070'} | ${5070}
    ${'00:01:05,070'} | ${65070}
    ${'01:01:05,070'} | ${3665070}
    `('should convert $amount into timecode', ({timecode, amount}) => {
      expect(toTimeCode(amount)).toEqual(timecode)
    });
  });

  describe('processBlock', () => {
    it('should increase the time of subtitle', () => {
      const initialBlock = [
        '1',
        '00:00:05,070 --> 00:00:07,039',
        'Précédemment dans',
        'The Suicide Squad.',
      ]
      const expectedBlock = [
        '1',
        '00:00:06,070 --> 00:00:08,039',
        'Précédemment dans',
        'The Suicide Squad.',
      ]
      expect(processBlock(initialBlock, 1000)).toEqual(expectedBlock)
    });

    it('should decrease the time of subtitle', () => {
      const initialBlock = [
        '1',
        '00:00:05,070 --> 00:00:07,039',
        'Précédemment dans',
        'The Suicide Squad.',
      ]
      const expectedBlock = [
        '1',
        '00:00:04,070 --> 00:00:06,039',
        'Précédemment dans',
        'The Suicide Squad.',
      ]
      expect(processBlock(initialBlock, -1000)).toEqual(expectedBlock)
    });
  })
})
