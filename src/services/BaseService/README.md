## Base Service - Superclass that other services inherit for use of EventListeners

## Most of the information on how to extend this class exists inside of the index.ts file in the form of comments

## Some notes

If you have implemented your NewService extends BaseService and it isn't getting initialized or specifically listening for
the events that you have specified: Add import '@services/slack/listeners';

Add
```js 
import '@services/listenerDirectory/listeners';
```
to src/services/listeners/index.ts

If you have questions on how to make this /listeners directory check out the example /listeners directory located in this
BaseService folder
