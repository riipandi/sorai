import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from '#/components/selia/checkbox'
import { Label } from '#/components/selia/label'

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
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
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Label>
      <Checkbox />
      <span>I agree that Liverpool is the best football club in the world.</span>
    </Label>
  )
}
