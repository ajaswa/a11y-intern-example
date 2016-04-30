# Automated a11y testing example in The Intern

This is meant to be an example of a way to do basic automated accessibility testing in [The Intern](https://theintern.github.io). Because I haven't had time to dig into a lot of what The Intern has to offer and this got the job done for what I needed. A better way of doing this will be forthcoming but for now it will have to do.

## Setup

I use a standalone selenium server with phantomjs. This should work with other setups but YMMV. To have a setup like mine on a Mac:

`npm install -g phantomjs-prebuilt intern && brew install selenium-server-standalone && npm install`

## Running

If you have the same setup as mine you can just run `npm test`.

## a11y tests

Right now I have both the [Google Chrome Accessibility Developer Tools](https://github.com/GoogleChrome/accessibility-developer-tools) (ADT) and [Deque Labs aXe core](https://github.com/dequelabs/axe-core) working with The Intern. Other test suites should be able to be run but there are some interesting things I had to do in the [tests](https://github.com/ajaswa/a11y-intern-example) to get the a11y suites working.

## How it works

In Intern tests you can [execute](https://theintern.github.io/leadfoot/module-leadfoot_Session.html#execute) code in the browser you are trying to test. This means you can also inject JS files into the remote browser and then run that code. Since both ADT and aXe core expect to be run in a browser, being able to inject and run them from your test suite is preferred because it requires no modification to what ever you are testing.

Once the a11y test suites are run I needed some way to get the results from those tests back out of the browser environment and into Intern. This was mostly straight forward with ADT, but with aXe core is was a little more difficult as I couldn't figure how to get the `a11yCheck` to return its results in a way that could be read by The Intern. I finally logged the results and then had The Intern read the logs on its side and then parsed the log. It is all kinda gross, but it seems to work. I need to dig into how the web driver works and more docs around all this and to be shown another way. But for now, it works.

## Future

I plan on making this all into a Node Module abstracted out, so your tests are nice and clean but that is for another day.
