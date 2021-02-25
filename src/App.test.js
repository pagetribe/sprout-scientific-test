import App from './App';
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  rest.get('https://sprout-scientific-test.glitch.me/getEmails', (req, res, ctx) => {
    return res(ctx.json([]))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("email form", () => {
  describe('reset button', () => {
    it('should be disabled when Email empty', () => {
      render(<App />)
      expect(screen.getByRole('button', { name: /reset/i })).toBeDisabled()
    })
    it('should be enabled when email input has value', () => {
      render(<App />)
      userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'asdf@asdf.com')
      // expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('asdf@asdf.com')
      expect(screen.getByRole('button', { name: /reset/i })).toBeEnabled()
    })
  })

  describe("email input", () => {
    it('displays validation error when text entered not in email format', async () => {
      render(<App />)
      userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'asdfasdfasdf')
      expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('asdfasdfasdf')
      // const submit = screen.getByRole('button', { name: /email/i })
      userEvent.click(screen.getByRole('button', { name: /email/i }))
      await waitFor(() => {
        expect(screen.getByText('Email Invalid.')).toBeInTheDocument()
      })
    })
  })

  describe('file upload', () => {
    it('upload file form', () => {
      render(<App />)
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const input = screen.getByTestId('file-upload')
      userEvent.upload(input, file)
      expect(input.files[0]).toStrictEqual(file)
      expect(input.files.item(0)).toStrictEqual(file)
      expect(input.files).toHaveLength(1)
    })
  })

  describe('email form submission', () => {
    it('displays success message', async () => {
      server.use(
        rest.post("https://sprout-scientific-test.glitch.me/addEmail", (req, res, ctx) => {
          return res(ctx.status(200))
        })
      )
      render(<App />)
      userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'asdf@asdf.com')
      userEvent.click(screen.getByRole('button', { name: /email/i }))
      await waitFor(() => {
        expect(screen.queryByText(/Success! Email Sent/i)).toBeInTheDocument()
      })
    })

    it('resets the form to empty values', async () => {
      server.use(
        rest.post("https://sprout-scientific-test.glitch.me/addEmail", (req, res, ctx) => {
          return res(ctx.status(200))
        })
      )
      render(<App />)
      userEvent.type(screen.getByRole('textbox', { name: /email/i }), 'asdf@asdf.com')
      userEvent.click(screen.getByRole('button', { name: /email/i }))
      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('')
      })
    })

  })

})

describe("submissions list", () => {
  it('should show no submissions when finished loading and items empty', async () => {
    render(<App />)
    expect(screen.getByText("Loading submissions...")).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByText("No submissions yet.", { exact: false })).toBeInTheDocument()
    )
  })

  it('shows error state', async () => {
    server.use(
      rest.get('https://sprout-scientific-test.glitch.me/getEmails', (req, res, ctx) => {
        return res(ctx.status(404))
      })
    )
    render(<App />)
    expect(await screen.findByText("Request failed with status code 404")).toBeInTheDocument()
  })

  it('shows list of submissions', async () => {
    server.use(
      rest.get('https://sprout-scientific-test.glitch.me/getEmails', (req, res, ctx) => {
        return res(ctx.json([{ "id": 1, "email": "abc**@test2.com", "file_name": "test.pdf", "created_at": "2021-02-16 06:36:40" }]))
      })
    )
    render(<App />)
    await waitFor(() => {
      const table = screen.getByLabelText("submission list")
      expect(within(table).getByText("abc**@test2.com")).toBeTruthy()
    })
  })
})
