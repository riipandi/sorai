import type { Meta, StoryObj } from '@storybook/react-vite'
import { Blockquote, Code, Heading, Lead, Strong, Text, TextLink } from '#/components/typography'

const meta = {
  title: 'Components/Typography',
  component: undefined,
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
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const PageHeading: Story = {
  args: {},
  render: () => (
    <div className='flex flex-col gap-4'>
      <Heading level={1} size='xl'>
        The Da Vinci Code
      </Heading>
      <Heading level={2} size='lg'>
        Harry Potter and the Sorcerer's Stone
      </Heading>
      <Heading level={3} size='md'>
        Angels & Demons
      </Heading>
      <Heading level={4} size='sm'>
        The Chamber of Secrets
      </Heading>
      <Heading level={5} size='xs'>
        Inferno
      </Heading>
    </div>
  )
}

export const Paragraph: Story = {
  args: {},
  render: () => (
    <div className='flex max-w-xl flex-col gap-2'>
      <Text>
        Professor Robert Langdon awakens in a hospital bed in Florence, Italy, with no recollection
        of how he got there.
      </Text>

      <Text>
        Harry Potter discovers he is a wizard on his eleventh birthday when{' '}
        <TextLink href='https://www.wizardingworld.com' target='_blank'>
          Hagrid
        </TextLink>{' '}
        arrives to take him to Hogwarts School of Witchcraft and Wizardry.
      </Text>

      <Text>
        The <Strong>Philosopher's Stone</Strong> grants immortality and unlimited wealth.
      </Text>

      <Text>
        You can also add <Code>Expelliarmus!</Code> to your spells.
      </Text>
    </div>
  )
}

export const LeadParagraph: Story = {
  args: {},
  render: () => (
    <div className='flex max-w-xl flex-col gap-4'>
      <Lead>
        A Harvard professor must decipher codes hidden in works of art to stop an ancient secret
        society from destroying the Vatican.
      </Lead>

      <Lead>
        The boy who lived discovers his destiny at Hogwarts School of Witchcraft and Wizardry, where
        he learns magic and confronts the dark wizard who killed his parents.
      </Lead>
    </div>
  )
}

export const Blockquotes: Story = {
  args: {},
  render: () => (
    <div className='flex max-w-md flex-col gap-4'>
      <Blockquote>
        "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay
        for the privilege."
      </Blockquote>

      <Blockquote>
        "It does not do to dwell on dreams and forget to live, remember that. Now, why don't you put
        that admirable Cloak back on?"
      </Blockquote>

      <Blockquote>
        "Science and religion are not enemies. They are simply two different languages attempting to
        tell the same story."
      </Blockquote>

      <Blockquote>
        "It is our choices, Harry, that show what we truly are, far more than our abilities."
      </Blockquote>
    </div>
  )
}

export const AllComponents: Story = {
  args: {},
  render: () => (
    <div className='flex max-w-4xl flex-col gap-6'>
      <Heading level={1} size='xl'>
        The Ultimate Literary Showdown
      </Heading>

      <Lead>
        Two legendary series that have captivated millions worldwide: Dan Brown's thrilling Robert
        Langdon adventures and J.K. Rowling's magical Harry Potter saga.
      </Lead>

      <Text className='text-justify'>
        Professor <Strong>Robert Langdon</Strong>, a Harvard symbologist, finds himself entangled in
        global conspiracies involving ancient secrets, religious symbols, and powerful
        organizations. His journey begins in{' '}
        <TextLink href='https://en.wikipedia.org/wiki/Angels_%26_Demons' target='_blank'>
          Angels & Demons
        </TextLink>{' '}
        and continues through <Code>The Da Vinci Code</Code>, Inferno, and Origin.
      </Text>

      <Text>
        Meanwhile, in a world of magic and mystery, <Strong>Harry Potter</Strong> discovers his
        destiny as{' '}
        <TextLink href='https://www.wizardingworld.com' target='_blank'>
          The Boy Who Lived
        </TextLink>
        . From the Hogwarts Express to the final battle at Hogwarts, his story spans seven
        unforgettable books.
      </Text>

      <Blockquote>
        "It is our choices, Harry, that show what we truly are, far more than our abilities." —
        Albus Dumbledore
      </Blockquote>

      <Text>
        Both series explore themes of <Strong>friendship</Strong>, <Strong>courage</Strong>, and the
        eternal struggle between good and evil. Whether deciphering cryptic codes in European
        cathedrals or casting spells in the Great Hall, these stories remind us that{' '}
        <Strong>knowledge is power</Strong>.
      </Text>

      <Lead>
        Discover the adventures that have shaped modern literature and captured the imagination of
        readers across generations.
      </Lead>

      <Blockquote>
        "Science and religion are not enemies. They are simply two different languages attempting to
        tell the same story." — Robert Langdon
      </Blockquote>
    </div>
  )
}
