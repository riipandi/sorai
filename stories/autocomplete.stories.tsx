import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Autocomplete,
  AutocompletePopup,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteCollection
} from '#/components/selia/autocomplete'

const meta = {
  title: 'Components/Autocomplete',
  component: Autocomplete,
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
} satisfies Meta<typeof Autocomplete>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => {
    const items = [
      {
        group: 'Rock',
        items: [
          { value: 'radiohead', label: 'Radiohead' },
          { value: 'deftones', label: 'Deftones' },
          { value: 'tool', label: 'Tool' },
          { value: 'blur', label: 'Blur' },
          { value: 'nirvana', label: 'Nirvana' },
          { value: 'soundgarden', label: 'Soundgarden' },
          { value: 'foo-fighters', label: 'Foo Fighters' },
          { value: 'pearl-jam', label: 'Pearl Jam' }
        ]
      },
      {
        group: 'Classic Rock',
        items: [
          { value: 'pink-floyd', label: 'Pink Floyd' },
          { value: 'led-zeppelin', label: 'Led Zeppelin' },
          { value: 'the-beatles', label: 'The Beatles' }
        ]
      }
    ]

    return (
      <Autocomplete items={items}>
        <AutocompleteInput placeholder='Search for bands...' className='w-full lg:w-64' />
        <AutocompletePopup>
          <AutocompleteEmpty>No results found</AutocompleteEmpty>
          <AutocompleteList>
            {(group) => (
              <AutocompleteGroup key={group.group} items={group.items}>
                <AutocompleteGroupLabel>{group.group}</AutocompleteGroupLabel>
                <AutocompleteCollection>
                  {(item) => (
                    <AutocompleteItem key={item.value} value={item}>
                      {item.label}
                    </AutocompleteItem>
                  )}
                </AutocompleteCollection>
              </AutocompleteGroup>
            )}
          </AutocompleteList>
        </AutocompletePopup>
      </Autocomplete>
    )
  }
}
