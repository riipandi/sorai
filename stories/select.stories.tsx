import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import {
  Select,
  SelectPopup,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectGroupLabel
} from '#/components/select'

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
      { value: 'gryffindor', label: 'Gryffindor' },
      { value: 'slytherin', label: 'Slytherin' },
      { value: 'ravenclaw', label: 'Ravenclaw' },
      { value: 'hufflepuff', label: 'Hufflepuff' }
    ]

    return (
      <div className='w-full max-w-52'>
        <Select items={options}>
          <SelectTrigger>
            <SelectValue placeholder='Hogwarts House' />
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
      </div>
    )
  }
}

export const MultiSelect: Story = {
  args: {},
  render: () => {
    const options = [
      { value: 'gryffindor', label: 'Gryffindor' },
      { value: 'slytherin', label: 'Slytherin' },
      { value: 'ravenclaw', label: 'Ravenclaw' },
      { value: 'hufflepuff', label: 'Hufflepuff' }
    ]

    return (
      <div className='w-full max-w-60'>
        <Select items={options} multiple>
          <SelectTrigger>
            <SelectValue placeholder='Hogwarts Houses' />
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
      </div>
    )
  }
}

export const GroupItems: Story = {
  args: {},
  render: () => {
    const optionsGrouped = [
      {
        label: 'Dan Brown Novels',
        options: [
          { value: 'da-vinci-code', label: 'The Da Vinci Code' },
          { value: 'angels-demons', label: 'Angels & Demons' },
          { value: 'inferno', label: 'Inferno' },
          { value: 'lost-symbol', label: 'The Lost Symbol' }
        ]
      },
      {
        label: 'Harry Potter Books',
        options: [
          { value: 'sorcerers-stone', label: "The Sorcerer's Stone" },
          { value: 'chamber-secrets', label: 'The Chamber of Secrets' },
          { value: 'prisoner-azkaban', label: 'The Prisoner of Azkaban' }
        ]
      },
      {
        label: 'Other Mysteries',
        options: [
          { value: 'origin', label: 'Origin' },
          { value: 'goblet-fire', label: 'The Goblet of Fire' },
          { value: 'order-phoenix', label: 'The Order of the Phoenix' }
        ]
      }
    ]

    return (
      <div className='w-full max-w-64'>
        <Select>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Choose a book' />
          </SelectTrigger>
          <SelectPopup>
            <SelectList>
              {optionsGrouped.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectGroupLabel>{group.label}</SelectGroupLabel>
                  {group.options.map((option) => (
                    <SelectItem key={option.value} value={option}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectList>
          </SelectPopup>
        </Select>
      </div>
    )
  }
}

export const ItemWithIcon: Story = {
  args: {},
  render: () => {
    const optionsWithIcon = [
      { value: 'gryffindor', label: 'Gryffindor', icon: <Lucide.BoltIcon /> },
      { value: 'slytherin', label: 'Slytherin', icon: <Lucide.ShieldIcon /> },
      { value: 'ravenclaw', label: 'Ravenclaw', icon: <Lucide.EyeIcon /> }
    ]

    return (
      <div className='w-full max-w-52'>
        <Select items={optionsWithIcon}>
          <SelectTrigger>
            <SelectValue placeholder='Your house' />
          </SelectTrigger>
          <SelectPopup>
            <SelectList>
              {optionsWithIcon.map((option) => (
                <SelectItem key={option.value} value={option}>
                  {option.icon}
                  {option.label}
                </SelectItem>
              ))}
            </SelectList>
          </SelectPopup>
        </Select>
      </div>
    )
  }
}

export const DisabledItem: Story = {
  args: {},
  render: () => {
    const options = [
      { value: 'gryffindor', label: 'Gryffindor' },
      { value: 'slytherin', label: 'Slytherin' },
      { value: 'ravenclaw', label: 'Ravenclaw' },
      { value: 'hufflepuff', label: 'Hufflepuff' },
      { value: 'unknown', label: 'Ilvermorny', disabled: true }
    ]
    return (
      <div className='w-full max-w-52'>
        <Select items={options}>
          <SelectTrigger>
            <SelectValue placeholder='Hogwarts House' />
          </SelectTrigger>
          <SelectPopup>
            <SelectList>
              {options.map((option) => (
                <SelectItem key={option.value} value={option} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectList>
          </SelectPopup>
        </Select>
      </div>
    )
  }
}
