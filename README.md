## ManageTeam Logger

## Install

```
    npm i vklymniuk-logger --save
```

## How to use

Add config into your project root: config/message-bus.js
```
    import logger from 'vklymniuk-logger';

    logger.info('Process finished');
```

## Sentry

Sentry logging is enabled automatically when APP__DEBUG is set to false and provided:
    * SENTRY__DSN=https://key:secret@sentry.io/222222
    * APP__ENV_NAME=prod