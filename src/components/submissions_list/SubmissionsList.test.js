// import { screen, render } from '@testing-library/react'
// import SubmissionsList from './SubmissionsList'
// import { rest } from 'msw'
// import { setupServer } from 'msw/node'

// const server = setupServer(
//   rest.get('https://sprout-scientific-test.glitch.me/getEmails', (req, res, ctx) => {
//     return res(ctx.json({}))
//   })
// )

// beforeAll(() => server.listen())
// afterEach(() => server.resetHandlers())
// afterAll(() => server.close())

// test('should show Loading when no submissions', () => {
//   const props = { isLoaded: false, items: [], error: null }
//   render(<SubmissionsList {...props} />)
//   const input = screen.getByText("Loading submissions...")
// })

// test('should show no submissions when finished loading and items empty', () => {
//   const props = { isLoaded: true, items: [], error: null }
//   render(<SubmissionsList {...props} />)
//   const input = screen.getByText("No submissions yet.", { exact: false }) // substring match
// })