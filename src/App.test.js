import { render, screen, waitFor } from '@testing-library/react';
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

test('should show Loading when no submissions', () => {
  render(<App />)
  expect(screen.getByText("Loading submissions...")).toBeInTheDocument()
})

test('should show no submissions when finished loading and items empty', async () => {
  render(<App />)
  await waitFor(() =>
    expect(screen.getByText("No submissions yet.", { exact: false })).toBeInTheDocument()
  )
})

// test('should show Loading when no submissions', () => {
//   const props = { isLoaded: false, items: [], error: null }
//   render(<SubmissionsList {...props} />)
//   const input = screen.getByText("Loading submissions...")
// })


// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
