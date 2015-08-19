# Conversation topic voting tool

A socket-based voting tool for use in meetups, language exchange groups, etc.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

Manual Heroku deploy:
```sql
heroku create

heroku addons:create heroku-postgresql:hobby-dev
node dbInit.js

# to enable db access from local app:
# get DATABASE_URL info from:
heroku config -s
# Replace CONFIG_VAL with the URL and run:
export DATABASE_URL=CONFIG_VAL?ssl=true
```

### License

MIT
