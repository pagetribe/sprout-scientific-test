import { render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
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
    const errorMessage = await screen.findByText("Request failed with status code 404")
    expect(errorMessage).toBeInTheDocument()
    // expect(await screen.findByText("Request failed with status code 404")).toBeInTheDocument()
    // await waitFor(() => {
    //   expect(screen.getByText("Request failed with status code 404")).toBeInTheDocument()
    // })
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
