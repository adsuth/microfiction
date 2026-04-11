
<div style="text-align: center; align: center">
  <h1>Microfiction</h1>
  <h2>Coursework for Enterprise Web Development</h2>

  <img src="./src/public/microfiction.svg" width="250px"/>

  A Twitter-like website where users can post and engage with short stories known as "microfictions"
</div>

## About
Microfiction is an app that allows users to share and engage with short stories known as Microfictions.
Those not logged in can still engage with stories and even create their own, claiming them later if they keep the given code.

There is an account set up for testing:
`test@test.com`
`Testing123`

Logging in, you will have access to more functionality, including the developer menu.
* Provide ratings to stories
* View your own stories
* Access the Suggested tab
* Stories you have read can be filtered out

The site also has a leaderboard that rates the top three authors and readers based on metrics.

These metrics are updated every 15 minutes by a CRON web job or via the developer menu

## Technologies
| Element | Technology |
| --- | ---- |
| Framework | Next.JS |
| UI | React MUI |
| Database | MongoDB |
| Authentication | Auth0 |

The app has a Cron Web Job to update the metrics of each of the stories (average rating, view count et cetera) every 15 minutes.
