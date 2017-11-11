# pr-review-submit-unassign

> a GitHub App built with [probot](https://github.com/probot/probot) that 
> can unasign reviewer and asign pull request owner when pull request review submited.

## Setup

```
# Install dependencies
npm install

# Run the bot
npm start
```

See [docs/deploy.md](docs/deploy.md) if you would like to run your own instance of this app.

## Config

set up ``` .github/pr_review_submit_unassign.yml```

default:
```
commentUnassign: 'unassign @{reviwer}',
commentAssign: 'assign @{repoOwner}',
unAssignReviwer: true,
assignPrOwner: true
``` 
