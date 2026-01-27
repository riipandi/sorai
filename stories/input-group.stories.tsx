import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Input } from '#/components/selia/input'
import { InputGroup, InputGroupAddon, InputGroupText } from '#/components/selia/input-group'

const meta = {
  title: 'Components/InputGroup',
  component: InputGroup,
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
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex w-full flex-col gap-4 xl:w-10/12 2xl:w-8/12'>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <Input placeholder='example.com' />
      </InputGroup>
      <InputGroup>
        <Input placeholder='yourname' />
        <InputGroupAddon align='end'>
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon align='start'>
          <Lucide.SearchIcon />
        </InputGroupAddon>
        <Input placeholder='Search' />
      </InputGroup>
    </div>
  )
}
