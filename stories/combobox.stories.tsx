import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Combobox,
  ComboboxPopup,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxSearch,
  ComboboxTrigger,
  ComboboxValue
} from '#/components/selia/combobox'

const meta = {
  title: 'Components/Combobox',
  component: Combobox,
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
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => {
    const options = [
      { value: 'software-engineering', label: 'Software Engineering' },
      { value: 'machine-learning', label: 'Machine Learning' },
      { value: 'data-science', label: 'Data Science' },
      { value: 'artificial-intelligence', label: 'Artificial Intelligence' },
      { value: 'cybersecurity', label: 'Cybersecurity' },
      { value: 'network-engineering', label: 'Network Engineering' },
      { value: 'database-management', label: 'Database Management' }
    ]

    return (
      <Combobox items={options} defaultValue={options[0]}>
        <ComboboxTrigger className='w-64'>
          <ComboboxValue />
        </ComboboxTrigger>
        <ComboboxPopup>
          <ComboboxSearch />
          <ComboboxEmpty>No results found</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxPopup>
      </Combobox>
    )
  }
}
