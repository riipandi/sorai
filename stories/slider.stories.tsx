import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider, SliderThumb } from '#/components/slider'

const meta = {
  title: 'Components/Slider',
  component: Slider,
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
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex w-full max-w-sm flex-col gap-10'>
      <Slider defaultValue={20}>
        <SliderThumb />
      </Slider>
      <Slider defaultValue={[33, 66]}>
        <SliderThumb index={0} />
        <SliderThumb index={1} />
      </Slider>
    </div>
  )
}
