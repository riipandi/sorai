import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '#/components/selia/label'
import { Radio, RadioGroup, RadioGroupLabel } from '#/components/selia/radio'

const meta = {
  title: 'Components/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  argTypes: {},
  tags: [], // ['autodocs']
  args: {},
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-md items-center justify-center'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: { value: null },
  render: () => (
    <RadioGroup defaultValue='pink-floyd' aria-labelledby='radio-example'>
      <RadioGroupLabel id='radio-example'>Select your favorite band</RadioGroupLabel>
      <Label>
        <Radio value='pink-floyd' />
        Pink Floyd
      </Label>
      <Label>
        <Radio value='the-beatles' />
        The Beatles
      </Label>
      <Label>
        <Radio value='led-zeppelin' />
        Led Zeppelin
      </Label>
    </RadioGroup>
  )
}
