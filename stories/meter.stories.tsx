import type { Meta, StoryObj } from '@storybook/react-vite'
import { Meter, MeterLabel, MeterValue } from '#/components/meter'

const meta = {
  title: 'Components/Meter',
  component: Meter,
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
} satisfies Meta<typeof Meter>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: { value: 69 },
  render: (args) => (
    <Meter {...args} className='w-full'>
      <MeterLabel>Magic Power</MeterLabel>
      <MeterValue />
    </Meter>
  )
}
