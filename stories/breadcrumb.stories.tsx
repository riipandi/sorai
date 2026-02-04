import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbButton,
  BreadcrumbSeparator,
  BreadcrumbEllipsis
} from '#/components/breadcrumb'
import { Button } from '#/components/button'
import { Menu, MenuItem, MenuPopup, MenuTrigger } from '#/components/menu'

const meta = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
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
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbButton render={<a href='/' />}>Home</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbButton render={<a href='https://base-ui.com/react/overview/quick-start' />}>
            Docs
          </BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbButton active>Breadcrumb</BreadcrumbButton>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export const Ellipsis: Story = {
  args: {},
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbButton render={<a href='/' />}>Home</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbButton render={<a href='/docs/introduction' />}>Components</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbButton active>Breadcrumb</BreadcrumbButton>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export const EllipsisMenu: Story = {
  args: {},
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbButton render={<a href='/' />}>Home</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Menu>
            <MenuTrigger
              render={
                <Button variant='plain' size='icon-sm'>
                  <BreadcrumbEllipsis />
                </Button>
              }
            />
            <MenuPopup size='compact'>
              <MenuItem>React</MenuItem>
              <MenuItem>Vue</MenuItem>
              <MenuItem>Svelte</MenuItem>
              <MenuItem>Solid</MenuItem>
            </MenuPopup>
          </Menu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbButton render={<a href='/docs/introduction' />}>Components</BreadcrumbButton>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbButton active>Breadcrumb</BreadcrumbButton>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
