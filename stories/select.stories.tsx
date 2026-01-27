import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Select,
  SelectPopup,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue
} from '#/components/selia/select'

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered'
  },
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
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => {
    const options = [
      { value: 'liverpool', label: 'Liverpool' },
      { value: 'man-city', label: 'Manchester City' },
      { value: 'chelsea', label: 'Chelsea' },
      { value: 'arsenal', label: 'Arsenal' }
    ]

    return (
      <Select items={options}>
        <SelectTrigger className='lg:w-64'>
          <SelectValue placeholder='Football club' />
        </SelectTrigger>
        <SelectPopup>
          <SelectList>
            {options.map((option) => (
              <SelectItem key={option.value} value={option}>
                {option.label}
              </SelectItem>
            ))}
          </SelectList>
        </SelectPopup>
      </Select>
    )
  }
}
